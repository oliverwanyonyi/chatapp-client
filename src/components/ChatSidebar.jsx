import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { getChatsRoute, notifyRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import { getChatDetails } from "../utils/getChatDetails";
import Loader from "./Loader";
import Modal from "./Modal";
import SearchUsers from "./SearchUsers";
import { format } from "timeago.js";
const ChatSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const {
    selectedChat,
    setSelectedChat,
    socket,
    notifications,
    setNotifications,
    typingId,
    typingStatus,
    currentUser,
    fetchChats,
    setFetchChats,
    chats,
    setChats,
    onlineUsers,
    setOnlineUsers,
    setMessage,
    setShowMessage,
  } = ChatAppState();
  const clearReadNotif = async (chatId, userId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(notifyRoute);
      const { data } = await axios.put(
        `${notifyRoute}/`,
        { chatId, userId },
        config
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick = (chat) => {
    setSelectedChat(chat);

    if (notifications.length > 0) {
      const newNotifs = notifications.filter(
        (notif) => notif.chatId !== chat._id
      );

      setNotifications(newNotifs);
      clearReadNotif(chat._id, currentUser.id);
    }
  };

  useEffect(() => {
    socket.off("newUsers").on("newUsers", (data) => {
      let users = [];
      for (const item of data) {
        users.push(item.userId);
      }

      setOnlineUsers(users);
    });
  }, [socket, onlineUsers]);

  const getChats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${getChatsRoute}/${currentUser?.id}`);

      setChats(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, fetchChats]);

  function handleLogout() {
    localStorage.removeItem("talktoo-user");
    navigate("/login");
    setShowMessage(true);
    setMessage({
      type: "success",
      title: "Logout Succesful",
      text: "logout was successful",
    });
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  }

  const handleClickNotif = (notif) => {
    const chat = chats.find((chat) => chat._id === notif.chatId);
    handleClick(chat);
  };
  return (
    <Container className={selectedChat ? "hidden" : ""}>
      {showModal && <Modal setShowModal={setShowModal} showModal={showModal} />}
      <div className="sidebar-container">
        <div className="user">
          <div className="user-avatar">
            <img src={currentUser?.avatar} alt="" className="avatar" />
          </div>
          <div className="user-details">
            <div>
              <h2 className="username">You </h2>
              <p className="about">{currentUser?.bio}</p>
            </div>
            <div className="actions">
              {showNotif && (
                <ul className="notifications">
                  {notifications.length > 0 ? (
                    notifications?.map((notif, idx) => (
                      <li
                        className="notification"
                        onClick={() => handleClickNotif(notif)}
                        key={idx}
                      >
                        ({notif.count})
                        {notif.text.replace(
                          "message",
                          `${notif.count > 1 ? "messages" : "message"}`
                        )}
                        <span>{format(notif.createdAt)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="notification info">
                      You don't have any new notifications
                    </li>
                  )}
                </ul>
              )}

              <div
                className="action fas fa-bell"
                onClick={() => setShowNotif(!showNotif)}
              >
                {notifications.length > 0 && (
                  <span className="notif-count">{notifications.length}</span>
                )}
              </div>
              <div className="action" onClick={() => setShowModal(!showModal)}>
                Edit
              </div>
            </div>
          </div>
        </div>

        <div
          className="search-trigger"
          onClick={() => setShowSearch(!showSearch)}
        >
          <i className="fas fa-search"></i>
          Search user and click to start a conversation
        </div>

        <SearchUsers
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          fetchChats={fetchChats}
          setFetchChats={setFetchChats}
        />

        <div className="contacts">
          {loading ? (
            <Loader />
          ) : chats?.length > 0 ? (
            chats
              .filter((c) => c.userId !== currentUser.id)
              .map((chat) => (
                <div
                  className={
                    chat._id === selectedChat?._id
                      ? "contact selected"
                      : "contact"
                  }
                  key={chat._id}
                  onClick={() => handleClick(chat)}
                >
                  <div className="contact-profile">
                    <img
                      src={getChatDetails(currentUser, chat.users)?.avatar}
                      alt=""
                      className="profile"
                    />
                    {onlineUsers.includes(
                      getChatDetails(currentUser, chat.users)?._id
                    ) && <div className="online-badge"></div>}
                  </div>
                  <div className="contact-info">
                    <div className="contact-info-wrapper">
                      <h2>
                        {getChatDetails(currentUser, chat.users)?.username}
                        <span className="time-stamp">
                          {moment(chat.lastMessage.time).fromNow()}
                        </span>
                      </h2>
                      <p className="last-message">
                        {typingStatus && typingId === chat._id
                          ? typingStatus
                          : chat.lastMessage.text
                          ? `${chat.lastMessage.text} 
                             
                            `
                          : "No messages here yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="info">No previous conversations</p>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </Container>
  );
};
const Container = styled.div`
  width: 30%;
  padding: 20px 10px;
  /* display:none; */
  position: relative;
  p.info {
    font-size: 14px;
    text-align: center;
  }
  .logout-btn {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 200px;
    padding: 12px;
    color: #fff;
    background: #6c37f3;
    border-radius: 10px;
    cursor: pointer;
    i {
      margin-left: 10px;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    &.hidden {
      display: none;
    }
  }
  .user {
    display: flex;
    gap: 1rem;
    align-items: center;

    width: 100%;
    margin-bottom: 20px;
    .user-avatar {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .user-details {
      display: flex;
      justify-content: space-between;
      width: calc(100% - 5rem);
      .username {
        color: #6c37f3;
        margin-bottom: 3px;
        font-size: 15px;
        font-weight: 700;
      }
      .about {
        overflow-wrap: break-word;
        font-size: 14px;
        color: #292929;
      }
      .actions {
        display: flex;
        gap: 1rem;
        align-items: center;
        position: relative;
        .notifications {
          padding: 10px 0;
          width: 280px;
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 40px;
          left: -50%;
          z-index: 2;
          transform: translateX(-50%);
          list-style: none;
          background: #ffffff;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          border: 4px solid #6c37f3;
          border-radius: 5px;
          @media (max-width: 768px) {
            left: -70%;
            transform: translateX(-70%);
            top: 35px;
          }
          .notification {
            cursor: pointer;
            padding: 5px 10px;
            line-clamp: 1;
            font-size: 14px;
            font-weight: 600;
            color: #000000;
            span {
              font-weight: 700;
              margin-left: 5px;
            }
            &.info {
              color: #292929;
              text-align: center;
              cursor: text;
            }
            &:not(:last-child) {
              border-bottom: 1px solid #ececec;
            }
          }
        }
        .action.fa-bell {
          font-size: 17px;
          color: #000000;
          position: relative;
          .notif-count {
            position: absolute;
            right: -7px;
            top: -8px;
            width: 15px;
            height: 15px;
            background: #ec1616;
            font-size: 10px;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .action {
        cursor: pointer;
        font-size: 14px;
        color: #8b64ef;
      }
    }
  }
  .search-trigger {
    background: #ececec;
    height: 40px;
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 14px;
    color: #404040;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
  }

  .contacts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    max-height: 60vh;
    padding-top: 25px;
    &::-webkit-scrollbar {
      width: 0.5rem;
      &-thumb {
        background: #8b64ef;
        border-radius: 0.5rem;
      }
    }
    .contact {
      display: flex;
      gap: 1rem;
      cursor: pointer;
      padding: 10px;
      border-radius: 10px;

      &.selected {
        background: #ececec;
      }
      .contact-profile {
        position: relative;
        .online-badge {
          position: absolute;
          right: 5px;
          top: 2px;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #10f32e;
        }
        img {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .contact-info {
        width: calc(100% - 3rem);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .notif-count {
          color: #ffffff;
          background: #6c37f3;
          width: 1.5rem;
          height: 1.5rem;
          font-size: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .contact-info-wrapper {
          width: 100%;
        }
        h2 {
          color: #6c37f3;
          margin-bottom: 3px;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 10px;
          text-transform: capitalize;
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: flex-start;
          span.time-stamp {
            color: #292929;
            font-size: 13px;
            text-transform: none;
          }
        }
        .last-message {
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          display: -webkit-box;
        }

        .status {
          overflow-wrap: break-word;
          font-size: 14px;
          font-weight: 600;
          &.online {
            color: #10f32e;
          }
          &.offline {
            color: #444444;
          }
        }
      }
    }
  }
`;
export default ChatSidebar;
