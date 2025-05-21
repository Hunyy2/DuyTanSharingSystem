import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardOverview,
  fetchUserStats,
  fetchReportStats,
  fetchRecentPosts,
  fetchUserTrend,
  fetchInteractionActivity,
  fetchUserStatsScore,
} from "../action/dashboardActions";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    overview: {
      totalUsers: 0,
      totalLockedUsers: 0,
      totalUserReports: 0,
      totalPostReports: 0,
    },
    userStats: {
      activeUsers: 0,
      suspendedUsers: 0,
      lockedUsers: 0,
    },
    reportStats: {
      pendingReports: 0,
      acceptedReports: 0,
      rejectedReports: 0,
    },
    recentPosts: [],
    userTrend: { labels: [], data: [] },
    interactionActivity: {
      labels: [],
      datasets: { likes: [], comments: [], shares: [] },
    },
    userStatsScore: { labels: [], data: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch dashboard overview
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch report stats
      .addCase(fetchReportStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportStats.fulfilled, (state, action) => {
        state.loading = false;
        state.reportStats = action.payload;
      })
      .addCase(fetchReportStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recent posts
      .addCase(fetchRecentPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.recentPosts = action.payload;
      })
      .addCase(fetchRecentPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.userTrend = action.payload;
      })
      .addCase(fetchUserTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchInteractionActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractionActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.interactionActivity = action.payload;
      })
      .addCase(fetchInteractionActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserStatsScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatsScore.fulfilled, (state, action) => {
        state.loading = false;
        state.userStatsScore = action.payload;
      })
      .addCase(fetchUserStatsScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
