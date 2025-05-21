import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../Service/axiosClient"; // Sử dụng axiosClient
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lấy tổng quan dashboard
export const fetchDashboardOverview = createAsyncThunk(
  "dashboard/fetchDashboardOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/api/AdminDashboard/overview");
      console.log("[fetchDashboardOverview] Response:", response.data); // Gỡ lỗi
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Lỗi khi lấy tổng quan dashboard";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Lấy thống kê người dùng
export const fetchUserStats = createAsyncThunk(
  "dashboard/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/api/AdminDashboard/user-stats");
      console.log("[fetchUserStats] Response:", response.data); // Gỡ lỗi
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Lỗi khi lấy thống kê người dùng";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Lấy thống kê báo cáo
export const fetchReportStats = createAsyncThunk(
  "dashboard/fetchReportStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/api/AdminDashboard/report-stats"
      );
      console.log("[fetchReportStats] Response:", response.data); // Gỡ lỗi
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Lỗi khi lấy thống kê báo cáo";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Lấy bài viết mới
export const fetchRecentPosts = createAsyncThunk(
  "dashboard/fetchRecentPosts",
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/api/post/get-posts-by-admin", {
        params: { pageNumber, pageSize },
      });

      console.log("[fetchRecentPosts] API Response:", response.data);
      const posts = response.data.data?.posts || [];
      return posts;
    } catch (error) {
      console.error("[fetchRecentPosts] API Error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Phiên đăng nhập hết hạn");
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        if (error.response.status === 403) {
          toast.error("Bạn không có quyền truy cập");
          return rejectWithValue({ message: "Bạn không có quyền truy cập" });
        }
        const errorMsg =
          error.response.data?.message ||
          "Có lỗi xảy ra khi lấy danh sách bài viết!";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      } else if (error.request) {
        toast.error("Không kết nối được với server");
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      toast.error("Lỗi không xác định");
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Lấy xu hướng người dùng
export const fetchUserTrend = createAsyncThunk(
  "dashboard/fetchUserTrend",
  async ({ timeRange }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/api/AdminDashboard/user-trend", {
        params: { timeRange },
      });
      console.log("[fetchUserTrend] Response:", response.data); // Gỡ lỗi
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Lỗi khi lấy xu hướng người dùng";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Lấy hoạt động tương tác
export const fetchInteractionActivity = createAsyncThunk(
  "dashboard/fetchInteractionActivity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/api/AdminDashboard/interaction-activity"
      );
      console.log("[fetchInteractionActivity] Response:", response.data); // Gỡ lỗi
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Lỗi khi lấy hoạt động tương tác";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Lấy điểm số thống kê người dùng
export const fetchUserStatsScore = createAsyncThunk(
  "dashboard/fetchUserStatsScore",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/api/AdminDashboard/user-stats-score"
      );
      console.log("[fetchUserStatsScore] Response:", response.data); // Gỡ lỗi
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Lỗi khi lấy điểm số thống kê người dùng";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);
