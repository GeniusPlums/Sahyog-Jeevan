import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import db from "../db";
import { users, User } from "../db/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import createMemoryStore from "memorystore";

const scryptAsync = promisify(scrypt);

const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
    return salt + ":" + derivedKey.toString("hex");
  },
  verify: async (password: string, hash: string) => {
    const [salt, key] = hash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
    return timingSafeEqual(keyBuffer, derivedKey);
  }
};

declare global {
  namespace Express {
    // Use the User type from schema.ts
    interface User {
      id: number;
      username: string;
      role: "worker" | "employer" | "admin";
    }
  }
}

export function setupAuth(app: express.Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || process.env.REPL_ID || "blue-collar-jobs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true
    },
    store: new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    }),
  };

  // Check if we're in production mode
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    console.log("Setting up session for production environment");
    // In AWS and other cloud environments, we need to be careful with cookie settings
    // Remove secure: true for now as it requires HTTPS
    sessionSettings.cookie = {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      // Don't set secure: true unless you have HTTPS configured
      // secure: true,
      // Don't set sameSite: 'none' unless you have HTTPS configured
      // sameSite: 'none'
    };
    
    // Trust the first proxy in production
    app.set("trust proxy", 1);
  } else {
    console.log("Setting up session for development environment");
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

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
        const isMatch = await bcrypt.compare(password, user.password);
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

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, role = "worker" } = req.body;

      if (!username || !password) {
        return res.status(400).send("Username and password are required");
      }

      if (!["worker", "employer", "admin"].includes(role)) {
        return res.status(400).send("Invalid role");
      }

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          role: role as "worker" | "employer" | "admin",
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

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: User, info: any) => {
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
        // Log successful login
        console.log(`User ${user.username} logged in successfully`);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send("Logout failed");
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Add a GET endpoint to check if the user is authenticated
  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      console.log(`User ${req.user.username} is authenticated`);
      return res.json(req.user);
    } else {
      console.log("User is not authenticated");
      return res.status(401).json({ message: "Not authenticated" });
    }
  });
}