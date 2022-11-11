import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { leaveGroup, messageRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import Loader from "./Loader";
import MessageInput from "./MessageInput";
import { format } from "timeago.js";
import { getChatDetails } from "../utils/getChatDetails";
import Linkify from "react-linkify";
const Room = ({
  showProfile,
  setShowProfile,
  setModalChildren,
  setShowModal,
}) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const lastMessageRef = useRef();
  const {
    notifications,
    setNotifications,
    setTypingStatus,
    typingStatus,
    currentUser,
    selectedChat,
    socket,
    setSelectedChat,
    onlineUsers,
    fetchChats,
    setFetchChats,
    setGroupId,
    setShowMessage,
    setMessage,
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
        console.log(error);

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
      setFetchChats(!fetchChats);

      if (!selectedChat?._id || selectedChat?._id !== data.chatId) {
        const notifExists = notifications.findIndex(
          (notif) => notif.chatId === data.chatId
        );
        if (notifExists !== -1) {
          let newNotifs = notifications;
          newNotifs[notifExists].count += 1;
          newNotifs[notifExists].createdAt = Date.now();
          setNotifications([...newNotifs]);
        } else {
          setNotifications([data, ...notifications]);
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
      setTypingStatus((prev) => [
        ...prev.filter((p) => p.userId !== data.from),
        { chatId: data.chatId, text: data.text, userId: data.from },
      ]);
    });
    socket.off("stopped-typing").on("stopped-typing", (data) => {
      setTypingStatus((prev) => prev.filter((sts) => sts.userId !== data.from));
    });
  }, [socket]);

  const handleGroupUpdate = () => {
    setGroupId(selectedChat._id);
    setModalChildren("group");
    setShowModal(true);
  };
  const handleLeaveGroup = async () => {
    const { data } = await axios.put(`${leaveGroup}/${currentUser.id}`, {
      chatId: selectedChat._id,
    });
    if (data.success) {
      setMessage({
        type: "info",
        text: `You left ${selectedChat.name}`,
      });
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setShowModal(false);
      }, 5000);
    }
    setSelectedChat((prev) => {
      return { ...prev, users: prev.users.filter((u) => u._id !== data.left) };
    });
  };
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
                src={
                  selectedChat.isGroup
                    ? selectedChat.groupAvatar
                    : getChatDetails(currentUser, selectedChat.users).avatar
                }
                alt=""
              />
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setShowProfile(true)}
              >
                <p className="room-name">
                  {selectedChat.isGroup
                    ? selectedChat.name
                    : getChatDetails(currentUser, selectedChat.users).username}
                </p>

                {typingStatus.length > 0 &&
                selectedChat._id === typingStatus[0].chatId ? (
                  selectedChat.isGroup ? (
                    typingStatus.map((s) => (
                      <p className="room-status" key={s.id}>
                        {s.text}
                        {", "}
                      </p>
                    ))
                  ) : (
                    <p className="room-status">{typingStatus[0].text}</p>
                  )
                ) : selectedChat.isGroup ? (
                  <div className="members">
                    {" "}
                    {selectedChat.users.map((u, idx, arr) => (
                      <span key={u._id} className="group-member">
                        {u.username}
                        {idx !== arr.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                ) : onlineUsers.includes(
                    getChatDetails(currentUser, selectedChat.users)._id
                  ) ? (
                  <p className="room-status online">online</p>
                ) : (
                  <p className="room-status offline">offline</p>
                )}
              </div>
            </div>
            <button>
              <span
                className="fas fa-ellipsis-v"
                onClick={() => setShowMenu(!showMenu)}
              ></span>

              {showMenu && (
                <ul className="menu">
                  <li
                    className="menu-item"
                    onClick={() => {
                      setShowProfile(true);
                      setShowMenu(false);
                    }}
                  >
                    {selectedChat.isGroup ? "Group Info" : "Contact info"}
                  </li>
                  <li
                    className="menu-item"
                    onClick={() => {
                      setSelectedChat(null);
                      setShowProfile(false);
                      setShowMenu(false);
                    }}
                  >
                    Close Chat
                  </li>

                  {selectedChat.isGroup &&
                    selectedChat.users
                      .map((u) => u._id)
                      .includes(currentUser.id.toString()) && (
                      <li
                        className="menu-item"
                        onClick={
                          selectedChat.groupAdmin === currentUser.id
                            ? handleGroupUpdate
                            : handleLeaveGroup
                        }
                      >
                        {selectedChat.groupAdmin === currentUser.id
                          ? "Update Group"
                          : "Exit Group"}
                      </li>
                    )}
                </ul>
              )}
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
                      : selectedChat.isGroup
                      ? selectedChat?.users.find((u) => u._id === msg.sender)
                          .username
                      : getChatDetails(currentUser, selectedChat.users)
                          .username}
                  </div>
                  <div className="message">
                    <p className="messsage-content">
                      <Linkify>{msg.message}</Linkify>
                    </p>
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
    width: 60%;
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
      .group-member {
        font-size: 12px;
      }
      .members {
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        display: -webkit-box;
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
      background: none;
      position: relative;
      .fa-ellipsis-v {
        color: #6c37f3;
        cursor: pointer;
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: none;
        transition: 250ms ease-in-out;
        &:hover {
          background: #ececec;
        }
      }
      .menu {
        position: absolute;
        top: 40px;
        left: -60%;
        transform: translateX(-60%);
        width: 200px;
        background: #ffffff;
        list-style: none;
        text-align: left;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.15);
        .menu-item {
          cursor: pointer;
          color: #404040;
          font-size: 14px;
          padding: 10px 0;

          &:hover {
            color: #8b64ef;
          }
        }
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
      a {
        font-weight: 600;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }

      &.sender {
        align-self: flex-end;
        .message {
          background: #6c37f3;
          color: #ffffff;
          border-radius: 30px 30px 0 30px;

          a {
            color: #ff7070;
          }
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

        border-radius: 30px 30px 30px 0;
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
