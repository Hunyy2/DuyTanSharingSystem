import { useEffect, useState } from "react";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Friendly from "../components/FriendComponent/Friendly";
import FriendRequestsReceived from "../components/FriendComponent/FriendRequestReceived";
import FriendRequestsSent from "../components/FriendComponent/FriendRequestSent";
import FriendSuggestions from "../components/FriendComponent/FriendSuggestions";
import FooterHome from "../components/HomeComponent/FooterHome";
import Header from "../components/HomeComponent/Header";
import LeftSidebar from "../components/HomeComponent/LeftSideBarHome";
import {
  fetchFriendSuggestions,
  fetchFriendsWithCursor,
  fetchReceivedRequestsWithCursor,
  fetchSentRequestsWithCursor,
} from "../stores/action/friendAction";
import { userProfile } from "../stores/action/profileActions";
import "../styles/FriendViews/FriendView.scss";
import "../styles/HomeView.scss";
import "../styles/MoblieReponsive/HomeViewMobile/HomeMobile.scss";
import {
  useBackButtonToCloseSidebar,
  useSwipeToOpenSidebar,
} from "../utils/OpenMenuLeftisdebar";

const FriendView = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users) || {};
  const { users } = usersState;
  const {
    listFriendsCursor,
    listFriendReceivedCursor,
    listFriendsSentCursor,
    friendSuggestions,
  } = useSelector((state) => state.friends || {});
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");

  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  // Fetch data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case "friends":
        dispatch(fetchFriendsWithCursor());
        break;
      case "requests-received":
        dispatch(fetchReceivedRequestsWithCursor());
        break;
      case "requests-sent":
        dispatch(fetchSentRequestsWithCursor());
        break;
      case "suggestions":
        dispatch(fetchFriendSuggestions({ limit: 10, offset: 0 }));
        break;
      default:
        break;
    }
  }, [activeTab, dispatch]);

  // Handle pagination
  const handleLoadMore = () => {
    switch (activeTab) {
      case "friends":
        if (listFriendsCursor.nextCursor) {
          dispatch(fetchFriendsWithCursor(listFriendsCursor.nextCursor));
        }
        break;
      case "requests-received":
        if (listFriendReceivedCursor.nextCursor) {
          dispatch(
            fetchReceivedRequestsWithCursor(listFriendReceivedCursor.nextCursor)
          );
        }
        break;
      case "requests-sent":
        if (listFriendsSentCursor.nextCursor) {
          dispatch(
            fetchSentRequestsWithCursor(listFriendsSentCursor.nextCursor)
          );
        }
        break;
      case "suggestions":
        if (friendSuggestions.hasMore) {
          dispatch(
            fetchFriendSuggestions({
              limit: 10,
              offset: friendSuggestions.offset,
            })
          );
        }
        break;
      default:
        break;
    }
  };

  // Sidebar controls
  useSwipeToOpenSidebar(setShowSidebar);
  useBackButtonToCloseSidebar(showSidebar, setShowSidebar);

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
          <div className="friend-tab-buttons">
            <button
              className={activeTab === "requests-received" ? "active" : ""}
              onClick={() => setActiveTab("requests-received")}
            >
              Lời mời kết bạn
            </button>
            <button
              className={activeTab === "friends" ? "active" : ""}
              onClick={() => setActiveTab("friends")}
            >
              Bạn bè
            </button>
            <button
              className={activeTab === "requests-sent" ? "active" : ""}
              onClick={() => setActiveTab("requests-sent")}
            >
              Lời mời đi
            </button>
            <button
              className={activeTab === "suggestions" ? "active" : ""}
              onClick={() => setActiveTab("suggestions")}
            >
              Gợi ý kết bạn
            </button>
          </div>

          {activeTab === "requests-received" && (
            <FriendRequestsReceived
              requests={listFriendReceivedCursor.data || []}
              onLoadMore={handleLoadMore}
              hasMore={!!listFriendReceivedCursor.nextCursor}
              loading={listFriendReceivedCursor.loading}
              error={listFriendReceivedCursor.error}
            />
          )}
          {activeTab === "friends" && (
            <Friendly
              friends={listFriendsCursor.data || []}
              onLoadMore={handleLoadMore}
              hasMore={!!listFriendsCursor.nextCursor}
              loading={listFriendsCursor.loading}
              error={listFriendsCursor.error}
            />
          )}
          {activeTab === "requests-sent" && (
            <FriendRequestsSent
              requests={listFriendsSentCursor.data || []}
              onLoadMore={handleLoadMore}
              hasMore={!!listFriendsSentCursor.nextCursor}
              loading={listFriendsSentCursor.loading}
              error={listFriendsSentCursor.error}
            />
          )}
          {activeTab === "suggestions" && (
            <FriendSuggestions
              suggestions={friendSuggestions.data || []}
              loading={friendSuggestions.loading}
              error={friendSuggestions.error}
              hasMore={friendSuggestions.hasMore}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendView;
