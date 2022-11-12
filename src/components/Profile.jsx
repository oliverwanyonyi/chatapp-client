import React from "react";
import styled from "styled-components";
import moment from "moment";
import { ChatAppState } from "../AppContext/AppProvider";
import { getChatDetails } from "../utils/getChatDetails";
const Profile = ({ showProfile, setShowProfile }) => {
  const { selectedChat, currentUser } = ChatAppState();

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
  background: #ececec;
  transform: translateY(-100%);
  transition: 500ms transform ease-in-out;
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
      .profile-item {
        background: #fff;
        padding: 20px;

        .title {
          font-weight: 600;
          font-size: 17px;
          color: #8b64ef;
          margin-bottom: 10px;
        }

        .profile-bio {
          font-weight: 400;
          font-size: 15px;
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
