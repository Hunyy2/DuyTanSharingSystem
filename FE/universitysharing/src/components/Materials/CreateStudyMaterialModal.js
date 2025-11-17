import { useState } from "react";
import { FaFile, FaTimes, FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createStudyMaterial } from "../../stores/action/studyMaterialAction";
import "../../styles/Material/CreateStudyMaterialModal.scss";
const CreateStudyMaterialModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    semester: "",
    faculty: ""
  });
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Các lựa chọn cho dropdown (có thể fetch từ API nếu cần)
  const facultyOptions = [
    "Công nghệ Thông tin",
    "Điện - Điện tử",
    "Cơ khí",
    "Xây dựng",
    "Kinh tế",
    "Quản trị Kinh doanh",
    "Ngoại ngữ",
    "Khác"
  ];

  const semesterOptions = [
    "Học kỳ 1",
    "Học kỳ 2",
    "Học kỳ Hè",
    "Năm 1",
    "Năm 2", 
    "Năm 3",
    "Năm 4"
  ];

  const subjectOptions = [
    "Toán cao cấp",
    "Lập trình C++",
    "Cấu trúc dữ liệu",
    "Cơ sở dữ liệu",
    "Mạng máy tính",
    "Giải tích",
    "Vật lý đại cương",
    "Tiếng Anh",
    "Khác"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and size
    const validFiles = selectedFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed'
      ];
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          files: `File type ${file.type} không được hỗ trợ`
        }));
        return false;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setErrors(prev => ({
          ...prev,
          files: `File ${file.name} vượt quá 50MB`
        }));
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0 && errors.files) {
      setErrors(prev => ({
        ...prev,
        files: ""
      }));
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Môn học là bắt buộc";
    }
    
    if (!formData.faculty.trim()) {
      newErrors.faculty = "Khoa là bắt buộc";
    }
    
    if (files.length === 0) {
      newErrors.files = "Ít nhất một file là bắt buộc";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await dispatch(createStudyMaterial({
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        semester: formData.semester,
        faculty: formData.faculty,
        files: files
      })).unwrap();
      
      // Reset form and close modal on success
      resetForm();
      onClose();
      
    } catch (error) {
      console.error("Error creating study material:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      semester: "",
      faculty: ""
    });
    setFiles([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Đăng Tài Liệu Mới</h2>
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="create-material-form">
          {/* Tiêu đề */}
          <div className="form-group">
            <label className="form-label">
              Tiêu đề <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Nhập tiêu đề tài liệu..."
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Mô tả */}
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="Mô tả về tài liệu..."
            />
          </div>

          <div className="form-row">
            {/* Môn học */}
            <div className="form-group">
              <label className="form-label">
                Môn học <span className="required">*</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`form-select ${errors.subject ? 'error' : ''}`}
              >
                <option value="">Chọn môn học</option>
                {subjectOptions.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            {/* Khoa */}
            <div className="form-group">
              <label className="form-label">
                Khoa <span className="required">*</span>
              </label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className={`form-select ${errors.faculty ? 'error' : ''}`}
              >
                <option value="">Chọn khoa</option>
                {facultyOptions.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
              {errors.faculty && <span className="error-message">{errors.faculty}</span>}
            </div>
          </div>

          {/* Học kỳ */}
          <div className="form-group">
            <label className="form-label">Học kỳ</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Chọn học kỳ</option>
              {semesterOptions.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label className="form-label">
              File đính kèm <span className="required">*</span>
            </label>
            
            <div className="file-upload-area">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="file-input"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar,.7z"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <FaUpload className="upload-icon" />
                <span>Chọn file hoặc kéo thả vào đây</span>
                <small>Hỗ trợ: PDF, Word, Excel, Image, Archive (Tối đa 50MB/file)</small>
              </label>
            </div>
            
            {errors.files && <span className="error-message">{errors.files}</span>}

            {/* File List */}
            {files.length > 0 && (
              <div className="file-list">
                <h4>File đã chọn ({files.length})</h4>
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <FaFile className="file-icon" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="remove-file-btn"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Đang đăng...
                </>
              ) : (
                "Đăng tài liệu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudyMaterialModal;