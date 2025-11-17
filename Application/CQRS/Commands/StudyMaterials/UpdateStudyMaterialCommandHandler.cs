using Application.CQRS.Commands.StudyMaterial;
using static Application.DTOs.StudyMaterial.GetAllStudyMaterialDto;

namespace Application.CQRS.Commands.StudyMaterials
{
    public class UpdateStudyMaterialCommandHandler : IRequestHandler<UpdateStudyMaterialCommand, ResponseModel<StudyMaterialDto>>
    {
        // File: Application/CQRS/Commands/StudyMaterial/UpdateStudyMaterialCommandHandler.cs (Cập nhật Handle method)
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;
        private readonly IFileService _fileService; // Thêm service upload
        public UpdateStudyMaterialCommandHandler(IUnitOfWork unitOfWork, IUserContextService userContextService,IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
            _fileService = fileService;

        }
        public async Task<ResponseModel<StudyMaterialDto>> Handle(UpdateStudyMaterialCommand request, CancellationToken cancellationToken)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var userId = _userContextService.UserId();
                if (userId == Guid.Empty)
                    return ResponseFactory.Fail<StudyMaterialDto>("User not authenticated", 401);

                // Tìm tài liệu cần cập nhật
                var material = await _unitOfWork.StudyMaterialRepository.GetByIdAsync(request.Id);

                if (material == null)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ResponseFactory.Fail<StudyMaterialDto>("Study Material not found", 404);
                }

                // Kiểm tra quyền sở hữu
                if (material.UserId != userId)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ResponseFactory.Fail<StudyMaterialDto>("You do not have permission to update this material", 403);
                }

                // Xử lý upload nhiều file mới (nếu có)
                List<string> newFileUrls = new List<string>();
                if (request.FileUrls != null && request.FileUrls.Any())
                {
                    foreach (var file in request.FileUrls)
                    {
                        if (file.Length > 0)
                        {
                            var fileUrl = await _fileService.SaveFileAsync(file, "study-materials", isImage: false);
                            if (string.IsNullOrEmpty(fileUrl))
                                return ResponseFactory.Fail<StudyMaterialDto>("One or more files upload failed", 400);
                            newFileUrls.Add(fileUrl);
                        }
                    }
                }
                else if (request.ExistingFileUrls != null && request.ExistingFileUrls.Any())
                {
                    // Nếu có ExistingFileUrls từ frontend (giữ nguyên file cũ, không upload mới)
                    newFileUrls = request.ExistingFileUrls.ToList();
                }
                // Nếu cả hai null: giữ nguyên file cũ từ DB (không set gì)

                // Cập nhật các trường (sử dụng method Update của entity)
                // Chỉ set fileUrl nếu có thay đổi (file mới hoặc existing)
                string fileUrlToSet = newFileUrls.Any() ? string.Join(",", newFileUrls) : material.FileUrl;
                material.Update(
                    title: request.Title ?? material.Title,
                    fileUrl: fileUrlToSet,  // Sử dụng fileUrl mới hoặc giữ nguyên
                    subject: request.Subject ?? material.Subject,
                    description: request.Description ?? material.Description,
                    semester: request.Semester ?? material.Semester,
                    faculty: request.Faculty ?? material.Faculty
                );

                // Lưu vào DB
                await _unitOfWork.StudyMaterialRepository.UpdateAsync(material);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();
                var user = await _unitOfWork.UserRepository.GetUserByIdAsync(material.UserId);

                // Trả về DTO (thêm trường mới)
                return ResponseFactory.Success(
                    new StudyMaterialDto
                    {
                        Id = material.Id,
                        UserId = material.UserId,
                        UserName = user?.FullName ?? "Unknown",
                        ProfilePicture = user?.ProfilePicture,

                        Title = material.Title,
                        Description = material.Description ?? string.Empty,
                        Subject = material.Subject ?? string.Empty,
                        Semester = material.Semester,
                        Faculty = material.Faculty,
                        FileUrls = material.FileUrl?
                            .Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(url => $"{Constaint.baseUrl}{url}")
                            .ToList() ?? new List<string>(),
                        DownloadCount = material.DownloadCount,
                        ViewCount = material.ViewCount,
                        ApprovalStatus = material.ApprovalStatus.ToString(),
                        CreatedAt = FormatUtcToLocal(material.CreatedAt)
                    },
                    "Study Material updated successfully",
                    200);
            }
            catch (Exception e)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResponseFactory.Fail<StudyMaterialDto>(e.Message, 500);
            }
        }
    }
}
