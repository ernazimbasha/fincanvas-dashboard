import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { Id } from "./_generated/dataModel";

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

export const placeDemoTrade = mutation({
  args: {
    symbol: v.string(),
    companyName: v.string(),
    side: v.union(v.literal("buy"), v.literal("sell")),
    quantity: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");
    if (args.quantity <= 0 || args.price <= 0) throw new Error("Quantity and price must be positive");

    // Try to get existing position by user+symbol
    const existing = await ctx.db
      .query("positions")
      .withIndex("by_user_and_symbol", (q) => q.eq("userId", user._id).eq("symbol", args.symbol))
      .unique()
      .catch(() => null);

    if (!existing) {
      if (args.side === "sell") {
        // Nothing to sell; no-op for demo
        return "No existing position to sell";
      }
      // Create new position on buy
      const quantity = args.quantity;
      const costBasis = args.price; // per share
      const currentPrice = args.price;
      const marketValue = currentPrice * quantity;

      await ctx.db.insert("positions", {
        userId: user._id,
        symbol: args.symbol,
        companyName: args.companyName,
        quantity,
        costBasis,
        currentPrice,
        marketValue,
        todayGainLoss: 0,
        totalGainLoss: (currentPrice - costBasis) * quantity,
        todayGainLossPercent: 0,
        totalGainLossPercent: costBasis > 0 ? ((currentPrice - costBasis) / costBasis) * 100 : 0,
      });
      return "Position created";
    }

    // Update existing position
    const prevQty = existing.quantity;
    const prevCost = existing.costBasis; // per share
    const price = args.price;

    if (args.side === "buy") {
      const newQty = prevQty + args.quantity;
      const newCostBasis = ((prevQty * prevCost) + (args.quantity * price)) / newQty;
      const currentPrice = price;
      const marketValue = currentPrice * newQty;

      await ctx.db.patch(existing._id as Id<"positions">, {
        quantity: newQty,
        costBasis: newCostBasis,
        currentPrice,
        marketValue,
        totalGainLoss: (currentPrice - newCostBasis) * newQty,
        totalGainLossPercent: newCostBasis > 0 ? ((currentPrice - newCostBasis) / newCostBasis) * 100 : 0,
      });
      return "Position updated (buy)";
    } else {
      const sellQty = Math.min(args.quantity, prevQty);
      const newQty = prevQty - sellQty;

      if (newQty <= 0) {
        await ctx.db.delete(existing._id as Id<"positions">);
        return "Position closed";
      }

      const currentPrice = price;
      const marketValue = currentPrice * newQty;

      await ctx.db.patch(existing._id as Id<"positions">, {
        quantity: newQty,
        // costBasis stays as previous (per-share)
        currentPrice,
        marketValue,
        totalGainLoss: (currentPrice - prevCost) * newQty,
        totalGainLossPercent: prevCost > 0 ? ((currentPrice - prevCost) / prevCost) * 100 : 0,
      });
      return "Position updated (sell)";
    }
  },
});