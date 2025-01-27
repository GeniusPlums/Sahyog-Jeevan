import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { users, userSettings, type User } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);
const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  },
  compare: async (suppliedPassword: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  },
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
};

declare global {
  namespace Express {
    interface User extends User {}
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || "blue-collar-jobs",
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      secure: true,
    };
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy for both workers and employers
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.password) {
          return done(null, false, { message: "Invalid login method." });
        }
        const isMatch = await crypto.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Registration endpoint that supports both methods
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, role = "worker", phone, preferredAuth = "password" } = req.body;

      // Validate input based on preferred authentication method
      if (preferredAuth === "password") {
        if (!username || !password) {
          return res.status(400).send("Username and password are required for password authentication");
        }
      } else if (preferredAuth === "otp") {
        if (!phone) {
          return res.status(400).send("Phone number is required for OTP authentication");
        }
      }

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(
          preferredAuth === "password" 
            ? eq(users.username, username) 
            : eq(users.phone, phone)
        )
        .limit(1);

      if (existingUser) {
        return res.status(400).send(
          preferredAuth === "password" 
            ? "Username already exists" 
            : "Phone number already registered"
        );
      }

      let hashedPassword = null;
      if (password) {
        hashedPassword = await crypto.hash(password);
      }

      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          role,
          phone,
          preferredAuth,
        })
        .returning();

      // Log the user in after registration
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(newUser);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint that supports both methods
  app.post("/api/login", (req, res, next) => {
    const { username, password, phone, otp } = req.body;

    if (username && password) {
      // Handle username/password login
      passport.authenticate("local", (err: any, user: Express.User, info: IVerifyOptions) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(400).send(info.message ?? "Login failed");
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json(user);
        });
      })(req, res, next);
    } else if (phone && otp) {
      // Redirect to OTP verification
      res.redirect(307, "/api/auth/verify-otp");
    } else {
      res.status(400).send("Invalid login credentials");
    }
  });

  // Keep existing OTP-related endpoints
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).send("Phone number is required");
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);

      // Generate OTP
      const otp = crypto.generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

      if (existingUser) {
        await db
          .update(users)
          .set({ otp, otpExpiry })
          .where(eq(users.id, existingUser.id));
      } else {
        await db
          .insert(users)
          .values({
            phone,
            role: "worker",
            otp,
            otpExpiry
          });
      }

      // TODO: Integrate with actual SMS service
      console.log(`OTP for ${phone}: ${otp}`);

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).send("Failed to send OTP");
    }
  });

  app.post("/api/auth/verify-otp", async (req, res, next) => {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        return res.status(400).send("Phone and OTP are required");
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);

      if (!user) {
        return res.status(400).send("User not found");
      }

      if (!user.otp || !user.otpExpiry) {
        return res.status(400).send("No OTP was generated");
      }

      if (new Date() > new Date(user.otpExpiry)) {
        return res.status(400).send("OTP has expired");
      }

      if (user.otp !== otp) {
        return res.status(400).send("Invalid OTP");
      }

      // Clear OTP
      await db
        .update(users)
        .set({ otp: null, otpExpiry: null })
        .where(eq(users.id, user.id));

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send("Logout failed");
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    res.json(req.user);
  });
}