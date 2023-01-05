import React from "react";
import styled from "styled-components";
import moment from "moment";
import { ChatAppState } from "../AppContext/AppProvider";
import { getChatDetails } from "../utils/getChatDetails";
import axios from "axios";
import { createChatRoute } from "../api";
const Profile = ({ showProfile, setShowProfile }) => {
  const { selectedChat,setSelectedChat, currentUser ,chats,setChats} = ChatAppState();
const openChat =async (user) =>{
  console.log(user)
  const chat = chats.find(c=>c.isGroup === false && c.users.map(u=>u._id).includes(user._id));
 
  if(chat){
    setSelectedChat(chat)
   return;
  }else{
    try {
      const { data } = await axios.post(
        `${createChatRoute}?from=${currentUser?.id}&to=${user._id}`,
      );
      setChats(prev=>[data,...prev.filter(chat=>chat._id !== data._id)])
      setSelectedChat(data)
    } catch (error) {
      console.log(error);
    }
  }
}
  return (
    <Container className={showProfile ? "visible" : ""}>
      {selectedChat && (
        <div className="profile-container">
          <div className="profile-header">
            <span
              className="fas fa-times"
              onClick={() => setShowProfile(false)}
            ></span>{" "}
            <h2 className="profile-title">
              {selectedChat.isGroup ? "Group Info" : "Contact info"}
            </h2>
          </div>
          <div className="profile-body">
            <div className="profile-item profile-center">
              <div className="profile-img">
                <img
                  src={
                    selectedChat.isGroup
                      ? selectedChat.groupAvatar
                      : getChatDetails(currentUser, selectedChat?.users).avatar
                  }
                  alt=""
                />
              </div>
              <div className="info-container">
                <h2 className="profile-name">
                  {selectedChat.isGroup
                    ? selectedChat.name
                    : getChatDetails(currentUser, selectedChat?.users).username}
                </h2>
                <p className="profile-email">
                  {selectedChat.isGroup
                    ? `Group ${selectedChat.users.length} participants`
                    : getChatDetails(currentUser, selectedChat?.users).email}
                </p>
              </div>
            </div>

            <div className="profile-item">
              <h2 className="title">About</h2>
              <p className="profile-bio">
                {selectedChat?.isGroup
                  ? `Group created by ${
                      selectedChat?.users.find(
                        (u) => u._id === selectedChat?.groupAdmin
                      )._id === currentUser.id
                        ? "You"
                        : selectedChat?.users.find(
                            (u) => u._id === selectedChat?.groupAdmin
                          ).username
                    } ${moment(selectedChat?.createdAt).fromNow()}`
                  : getChatDetails(currentUser, selectedChat?.users).bio}
              </p>
            </div>

            {selectedChat.isGroup && <div className="profile-item">
            <h2 className="title">
                  {selectedChat.users.length} participants
                </h2>
                
                <div className="group-members">
                <div className="group-member">
                    <img src={currentUser.avatar} alt="" />
                    <div className="group-member-info">
                      <h2 className="g-m-name">You</h2>
                      <p className="g-m-bio">{currentUser.bio}</p>
                    </div>
                  </div>
                  {selectedChat.users.filter(u=>u._id !== currentUser.id).map(user=>(
                     <div className="group-member" onClick={()=>openChat(user)}>
                     <img src={user.avatar} alt={user.username} />
                     <div className="group-member-info">
                       <h2 className="g-m-name">{user.username}</h2>
                       <p className="g-m-bio">{user.bio}</p>
                     </div>
                   </div>
                  ))}
                </div>
              </div>}
           
          </div>
        </div>
      )}
    </Container>
  );
};
const Container = styled.div`
  width: 0;
  opacity: 0;
  visibility: hidden;
  height: 100vh;
  max-height: 100vh;
  background: #ececec;
  transform: translateY(-100%);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.3rem;
    &-thumb {
      background: #8b64ef;
      border-radius: 0.5rem;
    }
  }
  transition: 500ms transform ease-in-out;
  position: relative;
  &.visible {
    width: 40%;
    visibility: visible;
    opacity: 1;
    @media (max-width: 768px) {
      width: 100%;
    }
    transform: translateY(0);
  }
  .profile-container {
    display: flex;
    flex-direction: column;
    .profile-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 50px;
      .profile-item {
        background: #fff;

        .title {
          font-weight: 600;
          font-size: 15px;
          color: #8b64ef;
          /* margin-bottom: 10px; */
          padding: 20px 20px 0 20px;
        }
        .group-members {
          display: flex;
          flex-direction: column;
          margin-top: 10px;

          .group-member {
            display: flex;
            gap: 10px;
            align-items: center;
            padding: 10px 20px 10px 20px;
            cursor: pointer;
            &:hover {
              background: #ececec;
            }
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
            }
            .g-m-name {
              font-weight: 600;
              font-size: 15px;
              color: #6c37f3;
            }
            .g-m-bio {
              font-size: 13px;
              text-overflow: ellipsis;
              overflow-wrap: break-word;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
              display: -webkit-box;
            }
          }
        }
        .profile-bio {
          font-weight: 400;
          font-size: 15px;
          padding: 20px 20px 20px 20px;
        }
        &.profile-center {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 20px 0;

          .profile-img {
            width: 13rem;
            height: 13rem;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 20px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .info-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .profile-name {
            color: #6c37f3;
            font-size: 17px;
            font-weight: 600;
            margin-bottom: 5px;
            text-transform: capitalize;
          }
          .profile-email {
            font-size: 14px;
          }
        }
      }
    }
    .profile-header {
      display: flex;
      align-items: center;
      gap: 2rem;
      background: #ececec;
      padding: 20px 20px;
      position: fixed;
      top: 0;
      width: 100%;

      .fa-times {
        cursor: pointer;
        font-size: 20px;
        color: #6c37f3;
      }
      .profile-title {
        color: #8b64ef;
        font-weight: 400;
        font-size: 17px;
      }
    }
  }
`;

export default Profile;
