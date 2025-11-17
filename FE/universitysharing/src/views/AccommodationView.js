// File: AccommodationView.js
import { useEffect, useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import AllAccommodationPosts from "../components/Accommodation/AllAccommodationPosts";
import FooterHome from "../components/HomeComponent/FooterHome";
import Header from "../components/HomeComponent/Header";
import LeftSidebar from "../components/HomeComponent/LeftSideBarHome";
import { userProfile } from "../stores/action/profileActions";
import "../styles/Accommodation/AccommodationView.scss";
import {
  useBackButtonToCloseSidebar,
  useSwipeToOpenSidebar,
} from "../utils/OpenMenuLeftisdebar";

const AccommodationView = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users) || {};
  const [showSidebar, setShowSidebar] = useState(false);
  const { users } = usersState;

  useSwipeToOpenSidebar(setShowSidebar);
  useBackButtonToCloseSidebar(showSidebar, setShowSidebar);

  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  return (
    <div className="accommodation-view">
      <Header className="header" usersProfile={users} />
      <div className="accommodation-main-content">
        {/* Left Sidebar với toggle */}
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

        {/* Main content - Bản đồ chiếm phần còn lại */}
        <div className="accommodation-map-content">
          <AllAccommodationPosts />
        </div>
      </div>
    </div>
  );
};

export default AccommodationView;