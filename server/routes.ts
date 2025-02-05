import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { jobs, type Job, profiles, applications } from "@db/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from 'fs'; // Added fs import

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'));
    }
  }
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Ensure uploads directory exists
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // Profiles
  app.post("/api/profiles", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Not authenticated");

    try {
      const [profile] = await db
        .insert(profiles)
        .values({ ...req.body, userId: req.user.id })
        .returning();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  app.get("/api/profiles/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Not authenticated");

    try {
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, parseInt(req.params.userId)))
        .limit(1);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Jobs
  app.post("/api/jobs", upload.fields([
    { name: 'companyLogo', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 }
  ]), async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "employer") {
      return res.status(401).send("Unauthorized");
    }

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Process files
      const companyLogo = files?.companyLogo?.[0]?.filename;
      const previewImage = files?.previewImage?.[0]?.filename;

      // Parse requirements and benefits
      const requirements = req.body.requirements ? JSON.parse(req.body.requirements) : [];
      const benefits = req.body.benefits ? JSON.parse(req.body.benefits) : [];

      const [job] = await db
        .insert(jobs)
        .values({
          ...req.body,
          employerId: req.user.id,
          requirements,
          benefits,
          companyLogo,
          previewImage,
          createdAt: new Date()
        })
        .returning();

      res.json(job);
    } catch (error) {
      console.error('Job creation error:', error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const allJobs = await db
        .select()
        .from(jobs)
        .where(eq(jobs.status, 'open'))
        .orderBy(jobs.createdAt, 'desc');
      res.json(allJobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const [job] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, parseInt(req.params.id)))
        .limit(1);

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // Add employer jobs endpoint
  app.get("/api/employer/jobs", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "employer") {
      return res.status(401).send("Unauthorized");
    }

    try {
      const employerJobs = await db
        .select()
        .from(jobs)
        .where(eq(jobs.employerId, req.user.id))
        .orderBy(jobs.createdAt);
      res.json(employerJobs);
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      res.status(500).json({ error: "Failed to fetch employer jobs" });
    }
  });


  // Applications
  app.post("/api/applications", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "worker") {
      return res.status(401).send("Unauthorized");
    }

    try {
      const [application] = await db
        .insert(applications)
        .values({ ...req.body, workerId: req.user.id })
        .returning();
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  app.get("/api/applications/worker", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "worker") {
      return res.status(401).send("Unauthorized");
    }

    try {
      const workerApplications = await db
        .select()
        .from(applications)
        .where(eq(applications.workerId, req.user.id))
        .orderBy(applications.createdAt);
      res.json(workerApplications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/employer/:jobId", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "employer") {
      return res.status(401).send("Unauthorized");
    }

    try {
      const jobApplications = await db
        .select()
        .from(applications)
        .where(eq(applications.jobId, parseInt(req.params.jobId)))
        .orderBy(applications.createdAt);
      res.json(jobApplications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.put("/api/applications/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "employer") {
      return res.status(401).send("Unauthorized");
    }

    try {
      const [application] = await db
        .update(applications)
        .set({ status: req.body.status })
        .where(eq(applications.id, parseInt(req.params.id)))
        .returning();
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}