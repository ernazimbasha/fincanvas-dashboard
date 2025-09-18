import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const seedMarketData = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed market indices
    const indices = [
      { symbol: "^GSPC", name: "S&P 500", price: 4783.45, change: -12.37, changePercent: -0.26, volume: 0, type: "index" as const },
      { symbol: "^DJI", name: "Dow Jones", price: 37863.80, change: -57.44, changePercent: -0.15, volume: 0, type: "index" as const },
      { symbol: "^IXIC", name: "NASDAQ", price: 15055.65, change: +45.12, changePercent: +0.30, volume: 0, type: "index" as const },
      { symbol: "^RUT", name: "Russell 2000", price: 2043.22, change: +8.91, changePercent: +0.44, volume: 0, type: "index" as const },
    ];

    // Seed watchlist stocks
    const watchlistStocks = [
      { symbol: "AAPL", name: "Apple Inc.", price: 171.62, change: -0.95, changePercent: -0.55, volume: 834156, type: "stock" as const, isWatchlist: true },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: 139.17, change: -1.12, changePercent: -0.80, volume: 1404486, type: "stock" as const, isWatchlist: true },
      { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: -0.31, changePercent: -0.12, volume: 2388945, type: "stock" as const, isWatchlist: true },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 417.30, change: +1.25, changePercent: +0.30, volume: 490488, type: "stock" as const, isWatchlist: true },
    ];

    // Insert market data
    for (const item of [...indices, ...watchlistStocks]) {
      await ctx.db.insert("marketData", item);
    }

    return "Market data seeded successfully";
  },
});

export const seedUserPortfolio = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User not authenticated");

    // Seed user positions
    const positions = [
      {
        userId: user._id,
        symbol: "AAPL",
        companyName: "Apple Inc.",
        quantity: 100,
        costBasis: 150.00,
        currentPrice: 171.62,
        marketValue: 17162.00,
        todayGainLoss: -95.00,
        totalGainLoss: 2162.00,
        todayGainLossPercent: -0.55,
        totalGainLossPercent: 14.41,
      },
      {
        userId: user._id,
        symbol: "TSLA",
        companyName: "Tesla Inc.",
        quantity: 50,
        costBasis: 200.00,
        currentPrice: 248.50,
        marketValue: 12425.00,
        todayGainLoss: -15.50,
        totalGainLoss: 2425.00,
        todayGainLossPercent: -0.12,
        totalGainLossPercent: 24.25,
      },
      {
        userId: user._id,
        symbol: "MSFT",
        companyName: "Microsoft Corp.",
        quantity: 75,
        costBasis: 300.00,
        currentPrice: 417.30,
        marketValue: 31297.50,
        todayGainLoss: 93.75,
        totalGainLoss: 8797.50,
        todayGainLossPercent: 0.30,
        totalGainLossPercent: 39.10,
      },
    ];

    for (const position of positions) {
      await ctx.db.insert("positions", position);
    }

    // Update user portfolio value
    await ctx.db.patch(user._id, {
      portfolioValue: 60884.50,
      cashBuyingPower: 25000.00,
      totalPositions: 3,
    });

    // Seed portfolio history (last 30 days)
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const baseValue = 58000 + Math.random() * 5000;
      const dayChange = (Math.random() - 0.5) * 1000;
      
      await ctx.db.insert("portfolioHistory", {
        userId: user._id,
        timestamp,
        totalValue: baseValue,
        dayChange,
        dayChangePercent: (dayChange / baseValue) * 100,
      });
    }

    // Seed AI insights
    const insights = [
      {
        userId: user._id,
        type: "alert" as const,
        title: "High Volatility Alert",
        message: "TSLA showing increased volatility. Consider reviewing position size.",
        symbol: "TSLA",
        severity: "medium" as const,
        isRead: false,
      },
      {
        userId: user._id,
        type: "insight" as const,
        title: "Portfolio Diversification",
        message: "Your portfolio is well-diversified across tech sectors. Consider adding exposure to other industries.",
        severity: "low" as const,
        isRead: false,
      },
    ];

    for (const insight of insights) {
      await ctx.db.insert("insights", insight);
    }

    return "User portfolio seeded successfully";
  },
});
