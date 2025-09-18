import { query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getInsights = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);
  },
});

export const getUnreadAlertsCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return 0;

    const unreadAlerts = await ctx.db
      .query("insights")
      .withIndex("by_user_and_read", (q) => 
        q.eq("userId", user._id).eq("isRead", false)
      )
      .collect();

    return unreadAlerts.length;
  },
});

export const generateDemoInsight = mutation({
  args: {
    symbol: v.optional(v.string()),
    title: v.optional(v.string()),
    message: v.optional(v.string()),
    severity: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    const doc = {
      userId: user._id,
      type: "insight" as const,
      title: args.title ?? "AI Insight Update",
      message:
        args.message ??
        `Pattern strength improving${
          args.symbol ? ` in ${args.symbol}` : ""
        }. Pullbacks to 20D MA have been supported; watch for volume confirmation.`,
      symbol: args.symbol,
      severity: args.severity ?? "low",
      isRead: false,
    };

    await ctx.db.insert("insights", doc);
    return "Insight generated";
  },
});