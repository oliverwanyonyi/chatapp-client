import { useState } from "react";
import styled from "styled-components";
import { ChatAppState } from "../AppContext/AppProvider";
import Group from "./Group";
import ProfileDetails from "./ProfileDetails";

const Modal = ({ showModal, setShowModal, type }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName,setGroupName] = useState('')
  const { groupId, setGroupId } = ChatAppState();
  const handleClick = () => {
    setShowModal(!showModal);
    if (groupId) {
      setGroupId(null);
      setGroupName('')
      setSelectedUsers([]);
    }
  };
  return (
    <Container className={showModal && "modal-active"}>
      <div
        className={`profile_edit__modal-overlay ${
          showModal && "overlay-active"
        }`}
        onClick={handleClick}
      ></div>
      <div className={`form-container ${showModal && "active"}`}>
        {type === "profile" ? (
          <ProfileDetails
            showModal={showModal}
            setShowModal={setShowModal}
            handleClick={handleClick}
          />
        ) : (
          <Group
            setShowModal={setShowModal}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            showModal={showModal}
            handleClick={handleClick}
            groupName={groupName}
            setGroupName={setGroupName}
          />
        )}
      </div>
    </Container>
  );
};
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  visibility: hidden;
  opacity: 0;

  &.modal-active {
    opacity: 1;
    visibility: visible;
  }
  .profile_edit__modal-overlay {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 3;
    visibility: hidden;
    opacity: 0;
    transition: 0.2s;
    &.overlay-active {
      opacity: 1;
      visibility: visible;
    }
  }

  .form-container {
    position: absolute;
    top: 0;
    left: 0;
    background: #ffffff;
    padding: 20px 15px;
    height: 100%;
    width: 35vw;
    transform: translateX(-100%);
    transition: 0.4s;
    z-index: 60;
    border-radius: 10px;
    transition-delay: 0.2s ease-in-out;
    opacity: 0;
    visibility: hidden;
    max-height: 100vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0.3rem;
      &-thumb {
        background: #8b64ef;
        border-radius: 0.5rem;
      }
    }
    &.active {
      transform: translateX(0);
      visibility: visible;
      opacity: 1;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 14px;
        color: #6c37f3;
      }
      margin-bottom: 20px;

      .fa-times {
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #8b64ef;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: none;
        transition: 0.7s;
        &:hover {
          background: #ececec;
        }
      }
    }
    @media (max-width: 1080px) {
      width: 85vw;
    }
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  .upload-zone {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    align-items: center;
    gap: 1rem;
    width: 100%;
    .upload-preview {
      width: 180px;
      height: 180px;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid #ececec;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .fa-camera {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        cursor: pointer;
        z-index: 2;
        color: #ffffff;
      }
      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.25);
      }
    }
    .file-upload-icon {
      i {
        color: #6c37f3;
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
  .form-group {
    margin-bottom: 20px;
    &.upload-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      label {
        background: #ececec;
        color: #6c37f3;
        padding: 10px 15px;
        border-radius: 10px;
        cursor: pointer;
      }
    }
    .avatar {
      width: 7rem;
      height: 7rem;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 10px;
      border: 3px solid #6c37f3;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .form-group label {
    display: block;
    margin-bottom: 20px;
    font-weight: 200;
    color: #292929;
    text-transform: capitalize;
  }

  .form-control {
    background: #ececec;
    width: 100%;
    padding: 0 20px;
    height: 50px;
    font-size: 15px;
    color: #292929;
    border-radius: 10px;
  }

  .submit-btn {
    color: #ffffff;
    cursor: pointer;
    background-color: #6c37f3;
    padding: 13px 20px;
    width: 50%;
    text-align: center;
    font-size: 15px;
    font-weight: 400;
    border-radius: 10px;
    &:disabled {
      cursor: not-allowed;
      background: #8b64ef;
    }
  }
`;

export default Modal;
