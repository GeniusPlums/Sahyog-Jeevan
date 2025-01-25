import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { jobs, profiles, applications } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

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
  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "employer") {
      return res.status(401).send("Unauthorized");
    }
    
    try {
      const [job] = await db
        .insert(jobs)
        .values({ ...req.body, employerId: req.user.id })
        .returning();
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const allJobs = await db
        .select()
        .from(jobs)
        .orderBy(desc(jobs.createdAt));
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
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
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
        .orderBy(desc(applications.createdAt));
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
        .orderBy(desc(applications.createdAt));
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
