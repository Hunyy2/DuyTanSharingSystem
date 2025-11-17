import { useEffect, useState } from "react";
import {
  RiArrowRightDoubleFill
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import AllPostHome from "../components/HomeComponent/AllPostHome";
import FooterHome from "../components/HomeComponent/FooterHome";
import Header from "../components/HomeComponent/Header";
import LeftSidebar from "../components/HomeComponent/LeftSideBarHome";
import PostInputHome from "../components/HomeComponent/PostInputHome";
import RightSidebar from "../components/HomeComponent/RightSideBarHome";
import { useAuth } from "../contexts/AuthContext";
import { userProfile } from "../stores/action/profileActions";
import "../styles/HomeView.scss";
import "../styles/MoblieReponsive/HomeViewMobile/HomeMobile.scss";
import {
  useBackButtonToCloseSidebar,
  useSwipeToOpenSidebar,
} from "../utils/OpenMenuLeftisdebar";

const HomeView = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users) || {};
  const [showSidebar, setShowSidebar] = useState(false);
  const { userRole } = useAuth();
  // console.warn("Role người dùng", userRole);

  const { users } = usersState;
  // console.log("Thong tin user>>>", users);

  //đóng mở left side bar
  useSwipeToOpenSidebar(setShowSidebar);
  useBackButtonToCloseSidebar(showSidebar, setShowSidebar);
  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  return (
    <div className="home-view">
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
          <PostInputHome className="post-input" usersProfile={users} />
          <AllPostHome className="all-posts" usersProfile={users} />
        </div>
        <RightSidebar className="right-sidebar" />
      </div>
    </div>
  );
};

export default HomeView;
