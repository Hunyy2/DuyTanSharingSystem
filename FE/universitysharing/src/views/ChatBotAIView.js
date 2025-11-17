import { useEffect, useState } from "react";
import {
  RiArrowRightDoubleFill
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import ChatLayout from "../components/ChatAIComponent/ChatLayout";
import FooterHome from "../components/HomeComponent/FooterHome";
import Header from "../components/HomeComponent/Header";
import LeftSidebar from "../components/HomeComponent/LeftSideBarHome";
import { userProfile } from "../stores/action/profileActions";
import "../styles/ChatAI/ChatBotAIView.scss";
import "../styles/HomeView.scss";
import "../styles/MoblieReponsive/HomeViewMobile/HomeMobile.scss";
import {
  useBackButtonToCloseSidebar,
  useSwipeToOpenSidebar,
} from "../utils/OpenMenuLeftisdebar";
const ChatBotAIView = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users) || {};
  const [showSidebar, setShowSidebar] = useState(false);

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
          <div className="chat-ai-container">
            <ChatLayout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotAIView;
