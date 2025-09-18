import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

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
