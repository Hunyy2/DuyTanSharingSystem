// File: views/MaterialView.js

import { useEffect, useState } from "react";
import {
  RiArrowRightDoubleFill
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import FooterHome from "../components/HomeComponent/FooterHome";
import Header from "../components/HomeComponent/Header";
import LeftSidebar from "../components/HomeComponent/LeftSideBarHome";
import RightSidebar from "../components/HomeComponent/RightSideBarHome";
import StudyMaterial from "../components/Materials/StudyMaterial";
import { useAuth } from "../contexts/AuthContext";
import { userProfile } from "../stores/action/profileActions";
import "../styles/Material/MaterialView.scss"; // Import SCSS mới
import {
  useBackButtonToCloseSidebar,
  useSwipeToOpenSidebar,
} from "../utils/OpenMenuLeftisdebar";

const MaterialView = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users) || {};
  const [showSidebar, setShowSidebar] = useState(false);
  const { userRole } = useAuth();

  const { users } = usersState;

  //đóng mở left side bar
  useSwipeToOpenSidebar(setShowSidebar);
  useBackButtonToCloseSidebar(showSidebar, setShowSidebar);
  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  return (
    <div className="material-view"> {/* Đổi className thành material-view */}
      <Header className="header" usersProfile={users} />
      <div className="main-content">
        <div
          className={`left-sidebar-overlay ${showSidebar ? "show" : ""}`}
          onClick={() => setShowSidebar(false)}
        />
        <div className={`left-sidebar ${showSidebar ? "show" : ""}`}>
          <LeftSidebar usersProfile={users} />
          <FooterHome />
        </div>
        {/* Toggle button cho sidebar */}
        <div
          className={`sidebar-toggle ${showSidebar ? "move-right" : ""}`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <RiArrowRightDoubleFill
            className={`toggle-icon ${showSidebar ? "rotate" : ""}`}
          />
        </div>
        <div
          className={`Open-menu ${showSidebar ? "move-right" : ""}`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <RiArrowRightDoubleFill
            className={`Open-menu-icon ${showSidebar ? "rotate" : ""}`}
          />
        </div>

        <div className="center-content">
          <StudyMaterial className="study-materials" usersProfile={users} />
        </div>
        <RightSidebar className="right-sidebar" />
      </div>
    </div>
  );
};

export default MaterialView;