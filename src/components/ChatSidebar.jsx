import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loader from "./Loader";
import Modal from "./Modal";
const ChatSidebar = ({
  currentUser,
  setCurrentUser,
  setSelectedChat,
  selectedChat,
  socket,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // const getUsers = async()=>{
  //   try {
  //     setLoading(true)
  //     const {data}  = await axios.get(`${getUsersRoute}/${currentUser.id}`)
  //   setChats(data)
  //   setLoading(false)
  //   } catch (error) {
  //     setLoading(false)
  //   }

  // }
  //  useEffect(()=>{

  //   if(currentUser){
  //     getUsers()
  //   }
  //  },[currentUser])
  const handleClick = (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    socket.on("newUsers", (data) => {
      setChats(data);
    });
  }, [socket, chats]);
  function handleLogout() {
    localStorage.removeItem("tiktalk-user");
    navigate("/login");
    window.location.reload();
  }
  return (
    <Container className={selectedChat ? "hidden" : ""}>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          showModal={showModal}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}
      <div className="sidebar-container">
        <div className="user">
          <div className="user-avatar">
            <img src={currentUser?.avatar} alt="" className="avatar" />
          </div>
          <div className="user-details">
            <div>
              <h2 className="username">You</h2>
              <p className="about">{currentUser?.bio}</p>
            </div>

            <div className="action" onClick={() => setShowModal(!showModal)}>
              Edit
            </div>
          </div>
        </div>

        <div className="contacts">
          {loading ? (
            <Loader />
          ) : chats?.length > 1 ? (
            chats
              .filter((c) => c.userId !== currentUser.id)
              .map((chat) => (
                <div
                  className={
                    chat.userId === selectedChat?.userId
                      ? "contact selected"
                      : "contact"
                  }
                  key={chat.userId}
                  onClick={() => handleClick(chat)}
                >
                  <div className="contact-profile">
                    <img src={chat.avatar} alt="" className="profile" />
                  </div>
                  <div className="contact-info">
                    <h2>{chat.username}</h2>
                    <p
                      className={
                        chat.online ? "status online" : "status offline"
                      }
                    >
                      {chat.online ? "online" : "offline"}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <p className="info">
              No user is online share tiktalk with friends
              <button
                className="copy"
                onClick={() =>{
                  navigator.clipboard.writeText("https://tiktalk.netlify.app")
                alert("link copied to clipboard")
                }
                }
              >
                Share
              </button>
             
            </p>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </Container>
  );
};
const Container = styled.div`
  width: 30%;
  padding: 20px 30px;
  /* display:none; */
  position: relative;
  p.info{
    font-size: 14px;
    button{
      color:#6c37f3;
      background: #ececec;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;

margin-left:10px; font-weight:700   }
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
      .action {
        cursor: pointer;
        font-size: 14px;
        color: #8b64ef;
      }
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    max-height: 80vh;
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
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .contact-info {
        h2 {
          color: #6c37f3;
          margin-bottom: 3px;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 10px;
          text-transform: capitalize;
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
