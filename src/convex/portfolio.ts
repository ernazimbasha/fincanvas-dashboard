import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const getPortfolioOverview = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const positions = await ctx.db
      .query("positions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalMarketValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalCostBasis = positions.reduce((sum, pos) => sum + (pos.costBasis * pos.quantity), 0);
    const totalGainLoss = totalMarketValue - totalCostBasis;
    const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
    
    const todayGainLoss = positions.reduce((sum, pos) => sum + pos.todayGainLoss, 0);
    const todayGainLossPercent = totalMarketValue > 0 ? (todayGainLoss / (totalMarketValue - todayGainLoss)) * 100 : 0;

    return {
      accountValue: totalMarketValue + (user.cashBuyingPower || 10000),
      marketValue: totalMarketValue,
      totalGainLoss,
      totalGainLossPercent,
      todayGainLoss,
      todayGainLossPercent,
      cashBuyingPower: user.cashBuyingPower || 10000,
      totalPositions: positions.length,
    };
  },
});

export const getPositions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("positions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getPortfolioHistory = query({
  args: { timeRange: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const now = Date.now();
    let startTime = now - (30 * 24 * 60 * 60 * 1000); // Default 30 days

    switch (args.timeRange) {
      case "1D":
        startTime = now - (24 * 60 * 60 * 1000);
        break;
      case "5D":
        startTime = now - (5 * 24 * 60 * 60 * 1000);
        break;
      case "1M":
        startTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case "3M":
        startTime = now - (90 * 24 * 60 * 60 * 1000);
        break;
      case "YTD":
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        startTime = yearStart.getTime();
        break;
    }

    return await ctx.db
      .query("portfolioHistory")
      .withIndex("by_user_and_time", (q) => 
        q.eq("userId", user._id).gte("timestamp", startTime)
      )
      .collect();
  },
});
