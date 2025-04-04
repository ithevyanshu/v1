import { users, type User, type InsertUser, socialAccounts, type SocialAccount, type InsertSocialAccount, posts, type Post, type InsertPost, analytics, type Analytics, type InsertAnalytics } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, inArray, or, and, desc } from "drizzle-orm";
import { hashPassword } from "./auth";
import connectPgSimple from "connect-pg-simple";
import { Pool } from '@neondatabase/serverless';

const PostgresStore = connectPgSimple(session);

// Use any for session store type to avoid typescript errors
type SessionStoreType = any;

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByManagerId(managerId: number): Promise<User[]>;

  // Social account operations
  getSocialAccount(id: number): Promise<SocialAccount | undefined>;
  getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]>;
  getSocialAccountsByManagerId(managerId: number): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, account: Partial<SocialAccount>): Promise<SocialAccount | undefined>;

  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getPostsByAccountIds(accountIds: number[], status?: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<Post>): Promise<Post | undefined>;

  // Analytics operations
  getAnalyticsByAccountIds(accountIds: number[]): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;

  // Session store
  sessionStore: SessionStoreType;
}

export class DatabaseStorage implements IStorage {
  sessionStore: SessionStoreType;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true,
    });

    // Initialize test data when appropriate
    this.initializeTestData();
  }

  private async initializeTestData() {
    try {
      // Check if we already have users
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        console.log("Database already has data, skipping initialization");
        return;
      }

      console.log("Initializing test data in the database...");

      // Create test users
      const professionalUser = await this.createUser({
        username: "professional",
        password: await hashPassword("password"),
        email: "professional@example.com",
        fullName: "Professional User",
        role: "professional"
      });
      
      const brandUser = await this.createUser({
        username: "brand",
        password: await hashPassword("password"),
        email: "brand@example.com",
        fullName: "Brand Account",
        role: "brand"
      });
      
      const managerUser = await this.createUser({
        username: "manager",
        password: await hashPassword("password"),
        email: "manager@example.com",
        fullName: "Social Media Manager",
        role: "manager"
      });
      
      // Create social accounts for professional user
      const professionalInstagram = await this.createSocialAccount({
        userId: professionalUser.id,
        platform: "instagram",
        accountName: "professionalgram",
        accountId: "prof123",
        followers: 1500,
        isConnected: true,
        managerId: null
      });
      
      const professionalX = await this.createSocialAccount({
        userId: professionalUser.id,
        platform: "x",
        accountName: "professionalx",
        accountId: "prof_x",
        followers: 2200,
        isConnected: true,
        managerId: null
      });
      
      // Create social accounts for brand user
      const brandInstagram = await this.createSocialAccount({
        userId: brandUser.id,
        platform: "instagram",
        accountName: "brandgram",
        accountId: "brand123",
        followers: 5000,
        isConnected: true,
        managerId: null
      });
      
      const brandFacebook = await this.createSocialAccount({
        userId: brandUser.id,
        platform: "facebook",
        accountName: "BrandPage",
        accountId: "brandpage",
        followers: 7500,
        isConnected: true,
        managerId: null
      });
      
      // Create managed accounts
      const managedAccount = await this.createSocialAccount({
        userId: professionalUser.id,
        platform: "youtube",
        accountName: "ManagedChannel",
        accountId: "prof_yt",
        followers: 10000,
        isConnected: true,
        managerId: managerUser.id
      });
      
      const managedBrandAccount = await this.createSocialAccount({
        userId: brandUser.id,
        platform: "linkedin",
        accountName: "Brand LinkedIn",
        accountId: "brand_linkedin",
        followers: 3000,
        isConnected: true,
        managerId: managerUser.id
      });
      
      // Create some posts
      await this.createPost({
        socialAccountId: professionalInstagram.id,
        content: "Check out my latest work!",
        mediaUrl: "https://example.com/image1.jpg",
        status: "published",
        publishedAt: new Date(),
        scheduledFor: null
      });
      
      await this.createPost({
        socialAccountId: brandInstagram.id,
        content: "New product launch coming soon!",
        mediaUrl: "https://example.com/product.jpg",
        status: "published",
        publishedAt: new Date(),
        scheduledFor: null
      });
      
      await this.createPost({
        socialAccountId: managedAccount.id,
        content: "Tutorial video coming this week",
        mediaUrl: "https://example.com/thumbnail.jpg",
        status: "scheduled",
        publishedAt: null,
        scheduledFor: new Date(Date.now() + 86400000) // Tomorrow
      });
      
      // Create analytics data
      await this.createAnalytics({
        socialAccountId: professionalInstagram.id,
        date: new Date(),
        reach: 2500,
        engagement: 300,
        followers: 15,
        posts: 1,
        data: {
          postPerformance: [
            { postId: 1, likes: 120, comments: 30, shares: 15 }
          ]
        }
      });
      
      await this.createAnalytics({
        socialAccountId: brandInstagram.id,
        date: new Date(),
        reach: 6000,
        engagement: 750,
        followers: 50,
        posts: 1,
        data: {
          postPerformance: [
            { postId: 2, likes: 500, comments: 75, shares: 120 }
          ]
        }
      });
      
      console.log("Test data initialization complete");
    } catch (error) {
      console.error("Error initializing test data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getUsersByManagerId(managerId: number): Promise<User[]> {
    // First find all social accounts managed by this manager
    const managedAccounts = await db.select().from(socialAccounts).where(eq(socialAccounts.managerId, managerId));
    const userIds = [...new Set(managedAccounts.map(account => account.userId))];
    
    if (userIds.length === 0) return [];
    
    return await db.select().from(users).where(inArray(users.id, userIds));
  }

  // Social account operations
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    const result = await db.select().from(socialAccounts).where(eq(socialAccounts.id, id));
    return result[0];
  }

  async getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts).where(eq(socialAccounts.userId, userId));
  }

  async getSocialAccountsByManagerId(managerId: number): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts).where(
      or(
        eq(socialAccounts.managerId, managerId),
        eq(socialAccounts.userId, managerId)
      )
    );
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const result = await db.insert(socialAccounts).values(insertAccount).returning();
    return result[0];
  }

  async updateSocialAccount(id: number, updateData: Partial<SocialAccount>): Promise<SocialAccount | undefined> {
    const result = await db.update(socialAccounts)
      .set(updateData)
      .where(eq(socialAccounts.id, id))
      .returning();
    return result[0];
  }

  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  }

  async getPostsByAccountIds(accountIds: number[], status?: string): Promise<Post[]> {
    let query = db.select().from(posts).where(inArray(posts.socialAccountId, accountIds));
    
    if (status) {
      query = query.where(eq(posts.status, status));
    }
    
    return await query.orderBy(desc(posts.scheduledFor));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(insertPost).returning();
    return result[0];
  }

  async updatePost(id: number, updateData: Partial<Post>): Promise<Post | undefined> {
    const result = await db.update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();
    return result[0];
  }

  // Analytics operations
  async getAnalyticsByAccountIds(accountIds: number[]): Promise<Analytics[]> {
    return await db.select()
      .from(analytics)
      .where(inArray(analytics.socialAccountId, accountIds))
      .orderBy(desc(analytics.date));
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const result = await db.insert(analytics).values(insertAnalytics).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
