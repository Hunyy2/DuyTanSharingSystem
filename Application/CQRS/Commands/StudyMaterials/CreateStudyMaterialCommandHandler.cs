using Application.CQRS.Commands.StudyMaterial;

using static Application.DTOs.StudyMaterial.GetAllStudyMaterialDto;

namespace Application.CQRS.Commands.StudyMaterials
{
    public class CreateStudyMaterialCommandHandler : IRequestHandler<CreateStudyMaterialCommand, ResponseModel<StudyMaterialDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;
        private readonly IFileService _fileService; // Thêm service upload

        public CreateStudyMaterialCommandHandler(
            IUnitOfWork unitOfWork,
            IUserContextService userContextService,
            IFileService fileService) // Thêm dependency
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
            _fileService = fileService;
        }

        public async Task<ResponseModel<StudyMaterialDto>> Handle(CreateStudyMaterialCommand request, CancellationToken cancellationToken)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var userId = _userContextService.UserId();
                if (userId == Guid.Empty)
                    return ResponseFactory.Fail<StudyMaterialDto>("User not authenticated", 401);
                var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
                if (user == null)
                    return ResponseFactory.Fail<StudyMaterialDto>("User not found", 404);
                if (user.TrustScore < 30 && user.TrustScore >= 0)
                    return ResponseFactory.Fail<StudyMaterialDto>("Để thao tác được chức năng này, bàn cần đạt ít nhất 31 điểm uy tín", 403);
                // Xử lý upload nhiều file (nếu có)
                List<string> fileUrls = new List<string>();
                if (request.Files != null && request.Files.Any())
                {
                    foreach (var file in request.Files)
                    {
                        if (file.Length > 0)
                        {
                            var fileUrl = await _fileService.SaveFileAsync(file, "study-materials", isImage: false);
                            if (string.IsNullOrEmpty(fileUrl))
                                return ResponseFactory.Fail<StudyMaterialDto>("One or more files upload failed", 400);
                            fileUrls.Add(fileUrl);
                        }
                    }
                }
                else
                {
                    return ResponseFactory.Fail<StudyMaterialDto>("No files provided", 400);
                }

                // Tạo Entity (sử dụng list fileUrls đã upload)
                var material = new Domain.Entities.StudyMaterial(
                    userId: userId,
                    title: request.Title,
                    fileUrl: string.Join(",", fileUrls), // Giả sử entity có List<string> FileUrls; nếu string thì: string.Join(",", fileUrls)
                    subject: request.Subject,
                    description: request.Description,
                    semester: request.Semester,
                    faculty: request.Faculty
                );

                // Lưu vào DB
                await _unitOfWork.StudyMaterialRepository.AddAsync(material);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();


                // Trả về DTO (FileUrls là list URL full)
                return ResponseFactory.Success(
                    new StudyMaterialDto
                    {
                        Id = material.Id,
                        UserId = material.UserId,
                        UserName = _userContextService.FullName() ?? "Unknown",
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
                    "Study Materials created successfully",
                    201);
            }
            catch (Exception e)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResponseFactory.Fail<StudyMaterialDto>(e.Message, 500);
            }
        }
    }
    }
