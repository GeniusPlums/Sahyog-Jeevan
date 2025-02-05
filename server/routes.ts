import express from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import db from "../db";
import { users, jobs, applications, profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from 'fs'; 
import bcrypt from 'bcryptjs'; 

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

export function registerRoutes(app: express.Express): Server {
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
      const files = req.files as { [fieldname: string]: express.Multer.File[] };

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

  // Get all jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const allJobs = await db.query.jobs.findMany({
        where: eq(jobs.status, "open"),
      });
      res.json(allJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await db.query.jobs.findFirst({
        where: eq(jobs.id, jobId),
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const employer = await db.query.users.findFirst({
        where: eq(users.id, job.employerId),
        columns: {
          companyName: true,
        },
      });

      return res.json({
        ...job,
        companyName: employer?.companyName || 'Company Name'
      });
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Internal server error" });
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

  // Test endpoint to create a job
  app.post("/api/test/create-job", async (req, res) => {
    try {
      console.log('Creating test job...');
      const job = await db.insert(jobs).values({
        employerId: 1,
        title: "Test Job",
        category: "Construction",
        description: "This is a test job",
        location: "mumbai",
        salary: "30000",
        requirements: ["test requirement"],
        type: "FULL TIME",
        shift: "day",
        workingDays: "Monday-Friday",
        status: "open",
        benefits: { "health": true, "insurance": true },
      }).returning();
      console.log('Created test job:', job);
      res.json(job);
    } catch (error) {
      console.error('Error creating test job:', error);
      res.status(500).json({ error: "Failed to create test job" });
    }
  });

  // Test endpoint to create jobs
  app.post("/api/test/create-jobs", async (req, res) => {
    try {
      console.log('Creating test jobs...');
      
      // First, create a test employer
      const employer = await db.insert(users).values({
        username: "testemployer",
        password: "password123",
        role: "employer"
      }).returning();

      // Create multiple test jobs
      const testJobs = [
        {
          employerId: employer[0].id,
          title: "Driver Required",
          category: "Driver",
          description: "Looking for experienced drivers",
          location: "Mumbai",
          salary: "25000",
          requirements: ["Valid license", "2 years experience"],
          type: "FULL TIME",
          shift: "day",
          workingDays: "Monday-Friday",
          status: "open",
          benefits: { health: true, insurance: true }
        },
        {
          employerId: employer[0].id,
          title: "Security Guard",
          category: "Security",
          description: "Night shift security guard needed",
          location: "Delhi",
          salary: "20000",
          requirements: ["Security certification", "Physical fitness"],
          type: "FULL TIME",
          shift: "night",
          workingDays: "Monday-Sunday",
          status: "open",
          benefits: { health: true, insurance: true }
        },
        {
          employerId: employer[0].id,
          title: "Construction Worker",
          category: "Construction",
          description: "Experienced construction workers needed",
          location: "Bangalore",
          salary: "30000",
          requirements: ["Physical fitness", "Construction experience"],
          type: "FULL TIME",
          shift: "day",
          workingDays: "Monday-Saturday",
          status: "open",
          benefits: { health: true, insurance: true }
        }
      ];

      const createdJobs = await db.insert(jobs).values(testJobs).returning();
      console.log('Created jobs:', createdJobs);
      res.json(createdJobs);
    } catch (error) {
      console.error('Error creating test jobs:', error);
      res.status(500).json({ error: "Failed to create test jobs" });
    }
  });

  // Test endpoint to create employer
  app.post("/api/test/create-employer", async (req, res) => {
    try {
      console.log('Creating test employer...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const employer = await db.insert(users).values({
        username: "testemployer",
        password: hashedPassword,
        role: "employer"
      }).returning();

      console.log('Created employer:', employer);
      res.json(employer);
    } catch (error) {
      console.error('Error creating test employer:', error);
      res.status(500).json({ error: "Failed to create test employer" });
    }
  });

  // Test endpoint to create employer profile
  app.post("/api/test/create-employer-profile", async (req, res) => {
    try {
      console.log('Creating test employer profile...');
      const { employerId, companyName, companyDescription } = req.body;
      
      const profile = await db.insert(profiles).values({
        userId: employerId,
        name: "Test Employer",
        companyName,
        companyDescription,
        location: "Mumbai",
        contact: "1234567890"
      }).returning();

      console.log('Created profile:', profile);
      res.json(profile);
    } catch (error) {
      console.error('Error creating test employer profile:', error);
      res.status(500).json({ error: "Failed to create test employer profile" });
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