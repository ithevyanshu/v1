import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertSocialAccountSchema, insertPostSchema, insertAnalyticsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Social Media Account Routes
  app.get("/api/accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = req.user!.id;
    const userRole = req.user!.role;
    
    let accounts;
    if (userRole === "manager") {
      // Managers can see all accounts they manage and their own
      accounts = await storage.getSocialAccountsByManagerId(userId);
    } else {
      // Professionals and brands only see their own accounts
      accounts = await storage.getSocialAccountsByUserId(userId);
    }
    
    res.json(accounts);
  });

  app.post("/api/accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const validatedData = insertSocialAccountSchema.parse({
        ...req.body,
        userId: userId
      });
      
      const account = await storage.createSocialAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).send("Failed to create account");
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const accountId = parseInt(req.params.id);
    const account = await storage.getSocialAccount(accountId);
    
    if (!account) {
      return res.status(404).send("Account not found");
    }
    
    // Check if user is authorized to view this account
    const userId = req.user!.id;
    const userRole = req.user!.role;
    
    if (
      account.userId !== userId && 
      account.managerId !== userId && 
      userRole !== "manager"
    ) {
      return res.sendStatus(403);
    }
    
    res.json(account);
  });

  // Posts Routes
  app.get("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const status = req.query.status as string | undefined;
    
    // Get user's social accounts to filter posts
    let accounts;
    if (userRole === "manager") {
      accounts = await storage.getSocialAccountsByManagerId(userId);
    } else {
      accounts = await storage.getSocialAccountsByUserId(userId);
    }
    
    const accountIds = accounts.map(account => account.id);
    const posts = await storage.getPostsByAccountIds(accountIds, status);
    
    res.json(posts);
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const validatedData = insertPostSchema.parse(req.body);
      
      // Verify user has access to this social account
      const account = await storage.getSocialAccount(validatedData.socialAccountId);
      if (!account || (account.userId !== userId && account.managerId !== userId)) {
        return res.status(403).send("Not authorized to post to this account");
      }
      
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).send("Failed to create post");
    }
  });

  // Analytics Routes
  app.get("/api/analytics", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = req.user!.id;
    const userRole = req.user!.role;
    
    // Get user's social accounts to filter analytics
    let accounts;
    if (userRole === "manager") {
      accounts = await storage.getSocialAccountsByManagerId(userId);
    } else {
      accounts = await storage.getSocialAccountsByUserId(userId);
    }
    
    const accountIds = accounts.map(account => account.id);
    const analytics = await storage.getAnalyticsByAccountIds(accountIds);
    
    res.json(analytics);
  });

  // For managers: Get a list of users they manage
  app.get("/api/managed-users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userRole = req.user!.role;
    if (userRole !== "manager") {
      return res.status(403).send("Only managers can access this endpoint");
    }
    
    const managerId = req.user!.id;
    const users = await storage.getUsersByManagerId(managerId);
    
    res.json(users);
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
