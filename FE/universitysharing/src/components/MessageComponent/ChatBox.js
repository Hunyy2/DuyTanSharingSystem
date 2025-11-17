import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaEllipsisV,
  FaMicrophone,
  FaPaperclip,
  FaPhone,
  FaSearch,
  FaSmile,
  FaTimes,
  FaVideo,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import avatarDefault from "../../assets/AvatarDefault.png";
import {
  getMessagess
} from "../../stores/action/messageAction";
import "../../styles/MessageView/ChatBox.scss";
import "../../styles/MoblieReponsive/ChatBoxMobile/chatBoxMoblie.scss";
import getUserIdFromToken from "../../utils/JwtDecode";
import { useChatHandle, useTypingReceiver } from "../../utils/MesengerHandle";
const TYPING_INTERVAL = 3000;
const ChatBox = ({
  conversationId,
  messenger,
  onClose,
  selectFriend,
  messengerState,
  isUserTyping,
  setIsUserTyping,
  newMessage,
  setNewMessage,
  isSending,
  setIsSending,
  handleSendMessage,
  friendId,
}) => {
  const dispatch = useDispatch();

  const { handleTyping } = useChatHandle();
  const typingTimeoutRef = useRef(null); // thêm ở đầu component
  const lastTypingTimeRef = useRef(0);
  const currentUserID = getUserIdFromToken(); // Lấy ID người dùng hiện tại
  const handleInputChange = useCallback(
    (e) => {
      const newMessage = e.target.value;
      setNewMessage(newMessage);
      handleTyping(e, {
        conversationId,
        friendId,
        currentUserID,
        setNewMessage: setNewMessage,
        setIsUserTyping,
        lastTypingTimeRef,
        TYPING_INTERVAL,
      });
      setIsUserTyping(true);
    },
    [
      conversationId,
      friendId,
      currentUserID,
      setNewMessage,
      setIsUserTyping,
      handleTyping,
    ]
  );
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  //lấy thêm tin nhắn
  const topRef = useRef(null);
  const observer = useRef(null);
  const scrollContainerRef = useRef(null);

  //lướt lên trên để load thêm tin nhắn
  useEffect(() => {
    // console.error("Nét cơ so global>>>", topRef.current);
    if (!topRef.current || !messengerState.nextCursor) return;

    // Huỷ observer cũ nếu có
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && messengerState?.nextCursor) {
          console.warn("Đã vào");
          const token = localStorage.getItem("token");
          dispatch(
            getMessagess({
              conversationId: messengerState.conversationId,
              token,
              nextCursor: messengerState.nextCursor,
              pageSize: 20,
              append: true,
            })
          );
        }
      },
      {
        root: document.querySelector(".chat-messagess"), // phải đúng class scroll container
        threshold: 1.0,
      }
    );

    observer.current.observe(topRef.current);

    return () => observer.current?.disconnect();
  }, [messengerState?.nextCursor, messengerState?.conversationId]);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isInputFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const reversedMessages = [...messenger].reverse();

  // Lấy trạng thái typing từ Redux
  useTypingReceiver(selectFriend?.friendId, conversationId);
  const typingUserId = useSelector((state) => state.typing[conversationId]);
  const isSelfTyping = typingUserId === currentUserID; // Gõ từ mình
  const isFriendTyping = typingUserId === selectFriend?.friendId; // Gõ từ bạn bè

  return (
    <div className={`chat-box ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-header" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="user-info">
          <img
            src={selectFriend?.pictureProfile || avatarDefault}
            alt="Friend"
          />
          <span className="sort-name-friendly">
            {selectFriend?.fullName || "University Sharing"}
          </span>
          <span className="status-dot online"></span>
        </div>
        <div className="header-actions">
          <button className="action-btn">
            <FaVideo />
          </button>
          <button className="action-btn">
            <FaPhone />
          </button>
          <button className="action-btn">
            <FaSearch />
          </button>
          <button className="action-btn">
            <FaEllipsisV />
          </button>
          <button
            className="action-btn close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-messagess" ref={scrollContainerRef}>
            {isFriendTyping && (
              <div className="message them typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {isSelfTyping && (
              <div className="message me typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {reversedMessages.map((msg) => {
              const isMe = msg.senderId === currentUserID;
              return (
                <div key={msg.id} className={`message ${isMe ? "me" : "them"}`}>
                  <div className="message-content">
                    <p>{msg.content}</p>
                    <span className="message-time">
                      {new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && (
                      <span className={`status ${msg.status?.toLowerCase()}`}>
                        {msg.status === "Sent"
                          ? "Đã gửi"
                          : msg.status === "Seen"
                          ? "Đã xem"
                          : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={topRef} style={{ height: "1px" }} />
          </div>

          <form
            className="message-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newMessage.trim()) return;

              handleSendMessage({
                friendId: selectFriend?.friendId,
                content: newMessage,
                conversationId: messengerState?.conversationId,
                token: localStorage.getItem("token"),
                isSending,
                setIsSending,
                setNewMessage,
                setIsUserTyping,
              });
            }}
          >
            <div className="input-tools">
              <button type="button" className="tool-btn">
                <FaPaperclip />
              </button>
              <button
                type="button"
                className="tool-btn emoji-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaSmile />
              </button>
            </div>

            {showEmojiPicker && (
              <div className="emoji-picker-container" ref={emojiPickerRef}>
                {/* Emoji picker sẽ được thêm ở đây */}
              </div>
            )}

            {/* <textarea placeholder="Nhập vào tin nhắn" rows="1" /> */}

            <textarea
              placeholder="Nhập vào tin nhắn"
              rows="1"
              value={newMessage}
              onChange={handleInputChange}
            />

            <button type="submit" className="send-btn">
              {newMessage ? <FiSend /> : <FaMicrophone />}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBox;

