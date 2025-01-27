import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// User language preferences and regional settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  preferredLanguage: text("preferred_language").notNull().default("en"),
  region: text("region"),
  whatsappNumber: text("whatsapp_number"),
  notificationPreferences: jsonb("notification_preferences")
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["worker", "employer", "admin"] }).notNull().default("worker"),
  createdAt: timestamp("created_at").defaultNow(),
  isVerified: boolean("is_verified").default(false),
  lastActive: timestamp("last_active"),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  bio: text("bio"),
  skills: text("skills").array(),
  location: text("location"),
  contact: text("contact"),
  companyName: text("company_name"),
  companyDescription: text("company_description"),
  // New fields for enhanced worker profiles
  skillPhotos: text("skill_photos").array(),
  skillVideos: text("skill_videos").array(),
  primaryLanguage: text("primary_language"),
  secondaryLanguages: text("secondary_languages").array(),
  workHistory: jsonb("work_history"),
  certificates: jsonb("certificates"),
  availability: text("availability"),
  expectedSalary: text("expected_salary"),
  preferredLocations: text("preferred_locations").array()
});

// Work history records
export const workHistory = pgTable("work_history", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").references(() => users.id).notNull(),
  employerId: integer("employer_id").references(() => users.id),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description"),
  skills: text("skills").array(),
  rating: integer("rating"),
  feedback: text("feedback"),
  verificationStatus: text("verification_status", {
    enum: ["pending", "verified", "disputed"]
  }).default("pending"),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  requirements: text("requirements").array(),
  type: text("type", { enum: ["full-time", "part-time", "contract"] }).notNull(),
  status: text("status", { enum: ["open", "closed"] }).notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  // New fields for enhanced job listings
  languageRequirements: text("language_requirements").array(),
  benefits: jsonb("benefits"),
  shiftTiming: text("shift_timing"),
  immediateStart: boolean("immediate_start").default(false),
  verificationRequired: boolean("verification_required").default(false)
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  workerId: integer("worker_id").references(() => users.id).notNull(),
  status: text("status", {
    enum: ["pending", "shortlisted", "accepted", "rejected", "withdrawn"]
  }).notNull().default("pending"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
  interviewDate: timestamp("interview_date"),
  // New fields for enhanced application tracking
  documents: jsonb("documents"),
  interviewLocation: text("interview_location"),
  offeredSalary: text("offered_salary"),
  joinDate: timestamp("join_date")
});

// Relations
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const workHistoryRelations = relations(workHistory, ({ one }) => ({
  worker: one(users, {
    fields: [workHistory.workerId],
    references: [users.id],
  }),
  employer: one(users, {
    fields: [workHistory.employerId],
    references: [users.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  employer: one(users, {
    fields: [jobs.employerId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  worker: one(users, {
    fields: [applications.workerId],
    references: [users.id],
  }),
}));

// Export schemas for validation
export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const selectUserSettingsSchema = createSelectSchema(userSettings);

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertWorkHistorySchema = createInsertSchema(workHistory);
export const selectWorkHistorySchema = createSelectSchema(workHistory);

export const insertJobSchema = createInsertSchema(jobs);
export const selectJobSchema = createSelectSchema(jobs);

export const insertApplicationSchema = createInsertSchema(applications);
export const selectApplicationSchema = createSelectSchema(applications);

// Export types
export type UserSettings = typeof userSettings.$inferSelect;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type WorkHistory = typeof workHistory.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;