import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import avatarWeb from "../../assets/AvatarDefault.png";
import "../../styles/SharingPost.scss";
import getUserIdFromToken from "../../utils/JwtDecode";

const SharedPost = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getUserIdFromToken();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  // Mở comment modal
  const handleOpenCommentModal = (post, index = 0) => {
    navigate(`/post/${post.postId}`, { state: { background: location } });
  };

  const navigateUser = (userId) => {
    if (userId === userId) {
      navigate("/ProfileUserView");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  // Lấy thông hình ảnh và video set lên post nhiều hay 1 ảnh và 1 video
  const getMediaContainerClass = (post) => {
    const imageCount = post.imageUrl ? post.imageUrl.split(",").length : 0;
    const hasVideo = !!post.videoUrl;
    const totalMedia = imageCount + (hasVideo ? 1 : 0);

    let className = "media-container";
    switch (totalMedia) {
      case 1:
        className += hasVideo ? " single-video" : " single-image";
        break;
      case 2:
        className += " two-items";
        if (hasVideo) className += " has-video";
        break;
      default:
        if (totalMedia >= 3) {
          className += " multi-items";
          if (hasVideo) className += " has-video";
        }
    }
    return className;
  };

  // Render media items
  const renderMediaItems = (post) => {
    const imageUrls = post.imageUrl ? post.imageUrl.split(",") : [];
    const hasVideo = !!post.videoUrl;
    const totalMedia = imageUrls.length + (hasVideo ? 1 : 0);
    if (totalMedia === 0) return null;

    return (
      <div className={getMediaContainerClass(post)}>
        {imageUrls.map((url, index) => {
          const fullUrl = url.startsWith("http")
            ? url.trim()
            : `${baseUrl}${url.trim()}`;
          const showOverlay = totalMedia > 2 && index === (hasVideo ? 0 : 1);

          if (totalMedia > 2 && index > (hasVideo ? 0 : 1)) return null;
          if (hasVideo && index > 0) return null;

          return (
            <div className="media-item" key={index}>
              <img
                src={fullUrl}
                alt={`Post media ${index}`}
                onClick={() => handleOpenCommentModal(post, index)}
              />
              {showOverlay && (
                <div className="media-overlay">
                  +{totalMedia - (hasVideo ? 1 : 2)}
                </div>
              )}
            </div>
          );
        })}
        {hasVideo && (
          <div className="media-item video-item">
            <video controls>
              <source src={post.videoUrl} type="video/mp4" />
            </video>
          </div>
        )}
      </div>
    );
  };

  // Xác định trạng thái quyền riêng tư
  const getPrivacyStatus = (privacy) => {
    switch (privacy) {
      case 0:
        return "Công khai";
      case 1:
        return "riêng tư";
      case 2:
        return "bạn bè";
      default:
        return "Công khai"; // Mặc định nếu không có giá trị
    }
  };

  return (
    <div className="shared-post-container">
      <div className="post-share" key={post.id}>
        {/* Header Post */}
        <div className="header-post-share">
          <div className="AvaName-share">
            <img
              className="avtardefaut-share"
              src={post.originalPost.author.profilePicture || avatarWeb}
              alt="Avatar"
            />
            <div className="user-info-share">
              <strong
                onClick={() => navigateUser(post.originalPost.author.userId)}
              >
                {post.originalPost.author.userName || "University Sharing"}
              </strong>
              <div className="status-time-post-share">
                <span className="timePost-share">
                  {formatDistanceToNow(new Date(post.originalPost.createAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
                <span className="status-post-share">
                  {getPrivacyStatus(post.originalPost.scope)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung bài viết */}
        <span className="content-posts-share">{post.originalPost.content}</span>

        {renderMediaItems(post.originalPost)}
      </div>
    </div>
  );
};

export default SharedPost;
