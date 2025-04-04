import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["professional", "brand", "manager"] }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Social media accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  managerId: integer("manager_id").references(() => users.id),
  platform: text("platform", { enum: ["instagram", "facebook", "youtube", "x", "linkedin"] }).notNull(),
  accountName: text("account_name").notNull(),
  accountId: text("account_id").notNull(),
  followers: integer("followers").default(0),
  isConnected: boolean("is_connected").default(true),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).pick({
  userId: true,
  managerId: true,
  platform: true,
  accountName: true,
  accountId: true,
  followers: true,
  isConnected: true,
});

export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;

// Posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  socialAccountId: integer("social_account_id").notNull().references(() => socialAccounts.id),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  reach: integer("reach").default(0),
  engagement: integer("engagement").default(0),
  clicks: integer("clicks").default(0),
  status: text("status", { enum: ["draft", "scheduled", "published"] }).default("draft"),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  socialAccountId: true,
  content: true,
  mediaUrl: true,
  scheduledFor: true,
  publishedAt: true,
  status: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Analytics data
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  socialAccountId: integer("social_account_id").notNull().references(() => socialAccounts.id),
  date: timestamp("date").notNull(),
  followers: integer("followers").default(0),
  engagement: integer("engagement").default(0),
  reach: integer("reach").default(0),
  posts: integer("posts").default(0),
  data: jsonb("data"), // Additional platform-specific analytics data
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  socialAccountId: true,
  date: true,
  followers: true,
  engagement: true,
  reach: true,
  posts: true,
  data: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
