import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMarketIndices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("marketData")
      .withIndex("by_type", (q) => q.eq("type", "index"))
      .collect();
  },
});

export const getWatchlist = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("marketData")
      .withIndex("by_watchlist", (q) => q.eq("isWatchlist", true))
      .collect();
  },
});

export const getPriceHistory = query({
  args: { 
    symbol: v.string(),
    timeRange: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let startTime = now - (24 * 60 * 60 * 1000); // Default 1 day

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
      .query("priceHistory")
      .withIndex("by_symbol_and_time", (q) => 
        q.eq("symbol", args.symbol).gte("timestamp", startTime)
      )
      .collect();
  },
});
