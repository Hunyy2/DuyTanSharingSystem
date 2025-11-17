// File: stores/action/studyMaterialAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosClient from "../../Service/axiosClient"; // Giả định axiosClient đã được cấu hình

// ====================================================================
// 1. CREATE STUDY MATERIAL (Đăng tài liệu học tập - POST với FormData vì có file)
// ====================================================================
// File: stores/action/studyMaterialAction.js

export const createStudyMaterial = createAsyncThunk(
  "studyMaterial/create",
  async (
    { title, description, subject, semester, faculty, files },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      
      // Append data với đúng tên field theo BE yêu cầu
      formData.append('Title', title);
      formData.append('Description', description || '');
      formData.append('Subject', subject);
      formData.append('Semester', semester || '');
      formData.append('Faculty', faculty);

      // Append files - QUAN TRỌNG: Phải append từng file với key 'Files' (theo BE)
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append('Files', file); // Sửa: 'Files' thay vì 'File'
        });
      }

      console.log('FormData contents:'); // Debug
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axiosClient.post(
        "/api/StudyMaterial",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // QUAN TRỌNG: Không set header này
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Lỗi từ server khi tạo tài liệu");
      }

      toast.success(response.data.message || "Đăng tài liệu thành công!");
      return response.data.data;
    } catch (error) {
      console.error("Error in createStudyMaterial:", error);
      
      // Log chi tiết lỗi từ server
      if (error.response?.data) {
        console.error("Server error details:", error.response.data);
      }
      
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') ||
        "Lỗi mạng hoặc server không phản hồi";
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==================== UPDATE STUDY MATERIAL ====================
export const updateStudyMaterial = createAsyncThunk(
  "studyMaterial/update",
  async (
    { id, title, description, subject, semester, faculty, files, existingFiles }, // Thêm existingFiles
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('Id', id);
      formData.append('Title', title);
      formData.append('Description', description || '');
      formData.append('Subject', subject || '');
      formData.append('Semester', semester || '');
      formData.append('Faculty', faculty);

      // Append files mới nếu có
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('Files', file); // Giữ nguyên 'Files' plural theo BE
        });
      } else if (existingFiles && existingFiles.length > 0) {
        // Nếu không có file mới, gửi list URL file cũ để BE giữ nguyên (không upload lại)
        formData.append('ExistingFileUrls', JSON.stringify(existingFiles));
      }

      const response = await axiosClient.put(
        "/api/StudyMaterial",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Lỗi từ server khi cập nhật tài liệu");
      }

      toast.success(response.data.message || "Cập nhật tài liệu thành công!");
      return response.data.data;
    } catch (error) {
      console.error("Error in updateStudyMaterial:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi mạng hoặc server không phản hồi";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ====================================================================
// 3. FETCH ALL STUDY MATERIALS (Lấy danh sách tài liệu - GET với query params)
// ====================================================================
export const fetchStudyMaterials = createAsyncThunk(
  "studyMaterial/fetchAll",
  async ({ LastStudyMaterialId, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/api/StudyMaterial`, // Endpoint BE tương ứng (GetAllStudyMaterialQuery)
        {
          params: {
            // Giả định BE sử dụng 'lastId' (hoặc NextCursor) và 'pageSize'
            LastStudyMaterialId,
            pageSize: pageSize || 10,
          },
        }
      );
      console.log("fetchStudyMaterials response:", response.data);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Lỗi khi lấy danh sách tài liệu");
      }
      
      return response.data.data; // Trả về { Materials: [], NextCursor: Guid? , TotalCount: int }
    } catch (error) {
      console.error("Error in fetchStudyMaterials:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi mạng hoặc server không phản hồi";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ====================================================================
// 4. FETCH DETAIL STUDY MATERIAL (Lấy chi tiết tài liệu - GET /{id})
// ====================================================================
export const fetchStudyMaterialDetail = createAsyncThunk(
  "studyMaterial/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/api/StudyMaterial/${id}`); // Giả định endpoint tồn tại

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Lỗi khi lấy chi tiết tài liệu");
      }
      console.log("fetchStudyMaterialDetail response:", response.data);
      return response.data.data; // Trả về DTO chi tiết
    } catch (error) {
      console.error("Error in fetchStudyMaterialDetail:", error);
      const errorMessage = error.response?.data?.message || "Lỗi mạng hoặc server không phản hồi";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ====================================================================
// 5. DELETE STUDY MATERIAL (Xóa tài liệu)
// ====================================================================
export const deleteStudyMaterial = createAsyncThunk(
  "studyMaterial/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(
        `/api/StudyMaterial/${id}`, // Endpoint BE tương ứng
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Lỗi khi xóa tài liệu");
      }

      toast.success(response.data.message || "Xóa tài liệu thành công!");
      return id; // Trả về ID để Reducer xử lý xóa khỏi state
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi mạng hoặc server không phản hồi";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
//6 đếm số lượt tải tài liệu
export const countMaterialDownloads = createAsyncThunk(
  "studyMaterial/countDownloads",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        `/api/StudyMaterial/count-download/${id}`, // Sửa: Đúng endpoint backend
        { StudyMaterialId: id }, // Sửa: Body theo CountDowloadCommand
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Lỗi khi đếm lượt tải tài liệu");
      }
      return { id, count: response.data.data }; // Sửa: Return id + count mới để reducer cập nhật
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi mạng hoặc server không phản hồi";
      toast.error(errorMessage); // Thêm toast error
      return rejectWithValue(errorMessage);
    }
  }
);