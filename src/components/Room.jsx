import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { messageRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import Loader from "./Loader";
import MessageInput from "./MessageInput";
import { format } from "timeago.js";
import { getChatDetails } from "../utils/getChatDetails";
const Room = ({ showProfile, setShowProfile }) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const lastMessageRef = useRef();
  const {
    notifications,
    setNotifications,
    setTypingId,
    setTypingStatus,
    typingStatus,
    currentUser,
    selectedChat,
    socket,
    setSelectedChat,
    typingId,
    onlineUsers,
    fetchChats,setFetchChats
  } = ChatAppState();
  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoadingMessages(true);
        const { data } = await axios.get(
          `${messageRoute}/${selectedChat?._id}?from=${currentUser?.id}`
        );
        setMessages(data);
        setLoadingMessages(false);
      } catch (error) {
        setLoadingMessages(false);
      }
    };
    if (currentUser && selectedChat) {
      getMessages();
    }
  }, [selectedChat, currentUser]);

  useEffect(() => {
    socket.off("message-received").on("message-received", (data) => {
      if (selectedChat?._id === data.message.chatId) {
        setMessages([...messages, data.message]);
      }
    });
  }, [selectedChat?._id, messages]);
  useEffect(() => {
    socket.off("new-notification").on("new-notification", (data) => {
      setFetchChats(!fetchChats)

      if (!selectedChat?._id || selectedChat?._id !== data.chatId) {
        const notifExists = notifications.findIndex(
          (notif) => notif.chatId === data.chatId
        );
        if (notifExists !== -1) {
          let newNotifs = notifications;
          newNotifs[notifExists].count += 1;

          setNotifications([...newNotifs]);
          localStorage.setItem("notifications", JSON.stringify(newNotifs));
        } else {
          setNotifications([data, ...notifications]);
          localStorage.setItem(
            "notifications",
            JSON.stringify([data, ...notifications])
          );
        }
      } else {
        return;
      }
    });
  }, [selectedChat?._id, notifications]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.off("user-typing").on("user-typing", (data) => {
      setTypingStatus(data.text);
      setTypingId(data.chatId);
    });
    socket.off("stopped-typing").on("stopped-typing", () => {
      setTypingStatus(null);
      setTypingId(null);
    });
  }, [socket]);

  return (
    <Container className={showProfile ? "streched" : ""}>
      {selectedChat ? (
        <>
          <div className="room-header">
            <div className="room-profile">
              <button
                className="mobile-show-chats"
                onClick={() => setSelectedChat(null)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <img
                src={getChatDetails(currentUser, selectedChat.users).avatar}
                alt=""
              />
              <div>
                <p className="room-name">
                  {getChatDetails(currentUser, selectedChat.users).username}
                </p>

                {typingStatus && selectedChat._id === typingId ? (
                  <p className="room-status">{typingStatus}</p>
                ):onlineUsers.includes(getChatDetails(currentUser,selectedChat.users)._id)?<p className="room-status online">online</p>:<p className="room-status offline">offline</p>}
              </div>
            </div>
            <button onClick={() => setShowProfile(!showProfile)}>
              <i className="fas fa-eye"></i>
            </button>
          </div>
          <div className="room-body">
            {loadingMessages ? (
              <Loader />
            ) : messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div
                  className={
                    msg.fromSelf
                      ? "message-container sender"
                      : "message-container"
                  }
                  key={idx}
                >
                  <div className="message-sender">
                    {msg.fromSelf
                      ? "You "
                      : getChatDetails(currentUser, selectedChat.users)
                          .username}
                  </div>
                  <div className="message">
                    <p className="messsage-content">{msg.message}</p>
                  </div>
                  <span className="time-stamp">{format(msg.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="welcome">
                <p>No messages yet!</p>
              </div>
            )}
            <div ref={lastMessageRef} />
          </div>
          <MessageInput
            selectedChat={selectedChat}
            currentUser={currentUser}
            setMessages={setMessages}
            messages={messages}
            socket={socket}
          />
        </>
      ) : (
        <div className="welcome">
          <h2>
            Welcome back <span>{currentUser?.username}</span>
          </h2>
          <p>Click on a chat to start a conversation.</p>
        </div>
      )}
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  transition: 200ms width ease-in-out;
  /* display:none; */
  &.streched {
    width: 70%;
    @media (max-width: 768px) {
      display: none;
    }
  }

  display: flex;
  .welcome {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    width: 100%;
    background: #ececec;
    border-radius: 10px;
    h2 {
      font-size: 17px;
      span {
        color: #6c37f3;
      }
    }
  }
  flex-direction: column;
  padding: 10px 20px;
  .room-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    height: 10vh;
    .room-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      .mobile-show-chats {
        display: flex;
        align-items: center;
        gap: 7px;
        background: #6c37f3;
        color: #fff;
        padding: 0.5rem 1rem;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.2rem;
        transition: 0.5s ease-out;
        text-transform: capitalize;
        transition: 200ms ease-in-out;
        display: none;
        &:hover {
          background: #8b64ef;
        }
        @media (max-width: 768px) {
          display: flex;
        }
      }
      img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        object-fit: cover;
      }
      .room-name {
        color: #6c37f3;
      }
        .room-status {
          font-size: 13px;
          &.online {
            color: #37f385;
          }
          &.offline {
            color: #494949;
        }
      }
    }
    button {
      background: #6c37f3;
      color: #ffffff;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 5px;
      font-size: 14px;
      transition: 500ms ease-in-out;
      &:hover {
        background: #8b64ef;
      }
    }
  }
  .room-body {
    height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 2px solid #ececec;
    overflow-y: auto;
    padding: 10px;
    &::-webkit-scrollbar {
      width: 0.5rem;
      &-thumb {
        background: #8b64ef;
        border-radius: 0.5rem;
      }
    }
    .message-container {
      width: max-content;
      max-width: 60%;
      &.sender {
        align-self: flex-end;
        .message {
          background: #6c37f3;
          color: #ffffff;
          border-radius: 30px 30px 0 30px;
        }
      }
      .message-sender {
        color: #292929;
        font-weight: 600;
        margin-bottom: 5px;
        font-size: 15px;
      }
      .message {
        background: #ececec;
        padding: 10px 20px;
        display: flex;
        border-radius: 30px 30px 30px 0;
        gap: 3rem;
        .message-text {
          font-size: 15px;
        }
      }
      .time-stamp {
        font-size: 14px;
        margin-top: 10px;
        display: block;
        color: #494949;
      }
    }
  }
`;

export default Room;
