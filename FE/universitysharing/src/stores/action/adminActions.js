import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../Service/axiosClient";
// Lấy danh sách bài viết có báo cáo
export const fetchReportedPosts = createAsyncThunk(
  "report/fetchReportedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }
      const response = await axios.get(
        "/api/report/posts-report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách báo cáo!"
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Lấy danh sách báo cáo người dùng
export const fetchUserUserReports = createAsyncThunk(
  "report/fetchUserUserReports",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }
      const response = await axios.get(
        "/api/report/user-user-report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách báo cáo người dùng!"
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Lấy danh sách người dùng
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }
      const response = await axios.get(
        "https://localhost:7053/api/Admin/GetallUser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success && response.data.data) {
        const mappedUsers = response.data.data.map((user) => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          isVerifiedEmail: user.isVerifiedEmail,
          trustScore: user.trustScore,
          role: user.role === 0 ? "User" : "Admin",
          phone: user.phone || "N/A",
          relativePhone: user.relativePhone || "N/A",
          status: user.status,
          totalReports: user.totalReports,
          lastLoginDate: user.lastActive,
        }));
        return mappedUsers;
      } else {
        return rejectWithValue({
          message: "Không thể tải danh sách người dùng.",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message ||
            "Đã xảy ra lỗi khi lấy danh sách người dùng."
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Lấy danh sách thông báo
export const fetchNotifications = createAsyncThunk(
  "admin/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }
      const response = await axios.get(
        "https://localhost:7053/api/report/admin/ride-reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message || "Không thể tải thông báo."
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Action chặn người dùng
export const blockUser = createAsyncThunk(
  "admin/blockUser",
  async ({ userId, untilISO }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }
      const response = await axios.post(
        `https://localhost:7053/api/Admin/${userId}/block?blockUntil=${encodeURIComponent(
          untilISO
        )}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        return { userId, untilISO };
      } else {
        return rejectWithValue({
          message: response.data.message || "Không thể chặn người dùng.",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message || "Đã xảy ra lỗi khi chặn người dùng."
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Action tạm ngưng người dùng
export const suspendUser = createAsyncThunk(
  "admin/suspendUser",
  async ({ userId, untilISO }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }
      const response = await axios.post(
        `https://localhost:7053/api/Admin/${userId}/suspend?suspendUntil=${encodeURIComponent(
          untilISO
        )}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        return { userId, untilISO };
      } else {
        return rejectWithValue({
          message: response.data.message || "Không thể tạm ngưng người dùng.",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message ||
            "Đã xảy ra lỗi khi tạm ngưng người dùng."
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Action kích hoạt người dùng
export const activateUser = createAsyncThunk(
  "admin/activateUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }
      const response = await axios.post(
        `https://localhost:7053/api/Admin/${userId}/unblock`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        return userId;
      } else {
        return rejectWithValue({
          message: response.data.message || "Không thể kích hoạt người dùng.",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message ||
            "Đã xảy ra lỗi khi kích hoạt người dùng."
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Action xóa bài viết
export const deletePost = createAsyncThunk(
  "report/deletePost",
  async (postId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
    }

    try {
      const response = await axios.patch(
        `/api/report/delete-post-report/${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { postId, ...response.data };
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Action xóa tất cả báo cáo của bài viết
export const deleteAllReports = createAsyncThunk(
  "report/deleteAllReports",
  async (postId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
    }

    try {
      const response = await axios.delete(
        `/api/report/delete-all-report/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { postId, ...response.data };
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Action lấy danh sách bài post bởi admin
export const fetchPostsByAdmin = createAsyncThunk(
  "adminPosts/fetchPostsByAdmin",
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
      }

      const response = await axios.get(
        `/api/post/get-posts-by-admin?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        if (error.response.status === 403) {
          return rejectWithValue({ message: "Bạn không có quyền truy cập" });
        }
        return rejectWithValue(
          error.response.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách bài viết!"
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Action duyệt bài viết
export const approvePost = createAsyncThunk(
  "adminPosts/approvePost",
  async (postId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue({ message: "Bạn chưa đăng nhập!" });
    }

    try {
      const response = await axios.patch(
        `/api/post/approve?PostId=${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { postId, ...response.data };
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue({ message: "Phiên đăng nhập hết hạn" });
        }
        return rejectWithValue(
          error.response.data?.message || "Không thể duyệt bài viết!"
        );
      } else if (error.request) {
        return rejectWithValue({ message: "Không kết nối được với server" });
      }
      return rejectWithValue({ message: "Lỗi không xác định" });
    }
  }
);

// Xóa bài viết
export const adDeletePost = createAsyncThunk(
  "posts/deletePost",
  async (postID, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete(
        `/api/Post/ad-delete?PostId=${postID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return postID;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
