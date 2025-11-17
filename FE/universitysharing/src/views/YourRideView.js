import { useEffect, useState } from "react";
import Footer from "../components/HomeComponent/FooterHome";
import Header from "../components/HomeComponent/Header";
import LeftSidebar from "../components/HomeComponent/LeftSideBarHome";
import RightSidebar from "../components/HomeComponent/RightSideBarHome";


import { RiArrowRightDoubleFill } from "react-icons/ri";
import YourRide from "../components/RideComponent/YourRIde";
import {
  useBackButtonToCloseSidebar,
  useSwipeToOpenSidebar,
} from "../utils/OpenMenuLeftisdebar";

import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../stores/action/profileActions";
import "../styles/HomeView.scss";
const SharingRideView = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users) || {};
  const [showSidebar, setShowSidebar] = useState(false);
  const { users } = usersState;
  // console.log("Thong tin user>>>", users);

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
          <Footer />
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
          <YourRide className="all-posts" />
        </div>
        <RightSidebar className="right-sidebar" />
      </div>
    </div>
  );
};

export default SharingRideView;
