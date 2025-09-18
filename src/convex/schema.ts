import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // FinCanvas AI specific fields
      portfolioValue: v.optional(v.number()),
      cashBuyingPower: v.optional(v.number()),
      totalPositions: v.optional(v.number()),
      riskTolerance: v.optional(v.string()),
      tradingExperience: v.optional(v.string()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Portfolio positions
    positions: defineTable({
      userId: v.id("users"),
      symbol: v.string(),
      companyName: v.string(),
      quantity: v.number(),
      costBasis: v.number(),
      currentPrice: v.number(),
      marketValue: v.number(),
      todayGainLoss: v.number(),
      totalGainLoss: v.number(),
      todayGainLossPercent: v.number(),
      totalGainLossPercent: v.number(),
    }).index("by_user", ["userId"])
      .index("by_user_and_symbol", ["userId", "symbol"]),

    // Market data for watchlist and indices
    marketData: defineTable({
      symbol: v.string(),
      name: v.string(),
      price: v.number(),
      change: v.number(),
      changePercent: v.number(),
      volume: v.number(),
      marketCap: v.optional(v.number()),
      type: v.union(v.literal("stock"), v.literal("index"), v.literal("crypto")),
      isWatchlist: v.optional(v.boolean()),
    }).index("by_symbol", ["symbol"])
      .index("by_type", ["type"])
      .index("by_watchlist", ["isWatchlist"]),

    // Historical price data for charts
    priceHistory: defineTable({
      symbol: v.string(),
      timestamp: v.number(),
      open: v.number(),
      high: v.number(),
      low: v.number(),
      close: v.number(),
      volume: v.number(),
    }).index("by_symbol_and_time", ["symbol", "timestamp"]),

    // Portfolio performance history
    portfolioHistory: defineTable({
      userId: v.id("users"),
      timestamp: v.number(),
      totalValue: v.number(),
      dayChange: v.number(),
      dayChangePercent: v.number(),
    }).index("by_user_and_time", ["userId", "timestamp"]),

    // AI insights and alerts
    insights: defineTable({
      userId: v.id("users"),
      type: v.union(v.literal("alert"), v.literal("insight"), v.literal("recommendation")),
      title: v.string(),
      message: v.string(),
      symbol: v.optional(v.string()),
      severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      isRead: v.boolean(),
    }).index("by_user", ["userId"])
      .index("by_user_and_read", ["userId", "isRead"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;