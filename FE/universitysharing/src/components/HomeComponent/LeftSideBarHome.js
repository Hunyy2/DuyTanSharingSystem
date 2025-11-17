import { motion } from "framer-motion";
import {
  FiChevronRight,
  FiHome,
  FiMapPin,
  FiMessageSquare,
  FiUsers
} from "react-icons/fi";
import {
  RiAiGenerate,
  RiFilePaper2Line,
  RiHotelLine,
  RiUserLocationLine,
} from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import avatartDefault from "../../assets/AvatarDefaultFill.png";

const LeftSidebar = ({ usersProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = usersProfile?.fullName || "Người dùng";

  // 🧭 Danh sách menu (icon đổi hợp lý, biểu tượng rõ ràng)
  const menuItems = [
    { path: "/home", icon: <FiHome />, label: "Trang chủ" },
    { path: "/friend", icon: <FiUsers />, label: "Bạn bè" },
    { path: "/MessageView", icon: <FiMessageSquare />, label: "Nhắn tin" },
    { path: "/chatBoxAI", icon: <RiAiGenerate />, label: "Sharing AI" },
    { path: "/sharing-ride", icon: <FiMapPin />, label: "Chia sẻ xe" },
    { path: "/your-ride", icon: <RiUserLocationLine />, label: "Chuyến đi của bạn" },
    { path: "/accommodation", icon: <RiHotelLine />, label: "Tìm trọ" },
    { path: "/material", icon: <RiFilePaper2Line />, label: "Tài liệu học tập" },
  ];

  return (
    <aside className="left-sidebar-menu">
      {/* 🧑‍💻 Hồ sơ người dùng */}
      <motion.div
        onClick={() => navigate("/ProfileUserView")}
        className="user-profile-navigate"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <img
          src={usersProfile?.profilePicture || avatartDefault}
          alt="Profile"
          className="profile-icon"
        />
        <span className="User-Name">{username}</span>
      </motion.div>

      {/* 📜 Menu điều hướng */}
      <ul>
        {menuItems.map((item) => (
          <motion.li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="menu-item-content">
              <span className="sidebar-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </div>
            {location.pathname === item.path && (
              <motion.div
                className="active-indicator"
                layoutId="activeIndicator"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <FiChevronRight className="chevron-icon" />
          </motion.li>
        ))}
      </ul>
    </aside>
  );
};

export default LeftSidebar;
