import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { profileRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import { handleFileUpload } from "../utils/fileUpload";
import { getErrorMessage } from "../utils/getErrorMessage";

const Modal = ({ showModal, setShowModal }) => {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingImageUpload, setLoadingImageUpload] = useState();
  const navigate = useNavigate() 
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const { currentUser, setCurrentUser, setMessage, setShowMessage } =
    ChatAppState();
  const changeHandler = (e) => {
    setBio(e.target.value);
  };
  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio);
      setAvatarPreview(currentUser.avatar);
    }
  }, [currentUser]);

  const handleUploadFile = (e) => {
    handleFileUpload(
      e,
      setLoadingImageUpload,
      setAvatarPreview,
      setAvatar,
      setMessage,
      setShowMessage
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.put(
        `${profileRoute}/${currentUser.id}`,

        { bio, avatar: avatar },
        config
      );
      const user = JSON.parse(localStorage.getItem("talktoo-user"));
      user.bio = data.user.bio;
      user.avatar = data.user.avatar;
      localStorage.setItem("talktoo-user", JSON.stringify(user));
      setCurrentUser({
        ...currentUser,
        bio: data.user.bio,
        avatar: data.user.avatar,
      });
      setMessage({
        type: "success",
        title: "Update Profile Successful",
        text: "profile update successful",
      });
      setShowMessage(true);

      setTimeout(() => {
        navigate("/");
        setShowMessage(false);
      setLoading(false);
      setShowModal(false);

      }, 2500);
    } catch (error) {
      setLoading(false);
      setMessage({
        type: "error",
        title: "Profile Update Error",
        text: getErrorMessage(error),
      });
      setShowMessage(true);
      setLoading(false);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  }
  return (
    <Container>
      <div
        className="profile_edit__modal-overlay"
        onClick={() => setShowModal(!showModal)}
      ></div>
      <div className="profile_edit__modal-container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group upload-group">
            {avatarPreview && (
              <div className="avatar">
                <img src={avatarPreview} alt="" />
              </div>
            )}
            <label className="upload-btn" htmlFor="avatar">
              update profile image+
            </label>
            <input
              type="file"
              name="avatar"
              style={{ display: "none" }}
              id="avatar"
              onChange={handleUploadFile}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">About</label>
            <input
              type="text"
              id="bio"
              name="bio"
              placeholder="Hi there iam using tiktalk!"
              className="form-control"
              value={bio}
              onChange={changeHandler}
            />
          </div>

          <button
            className="submit-btn"
            disabled={loading || loadingImageUpload}
          >
            {loading
              ? "Updating"
              : loadingImageUpload
              ? "Uploading image please wait"
              : "Update profile"}
          </button>
        </form>
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
  z-index: 8;
  visibility: visible;
  opacity: 1;

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
  }
  .profile_edit__modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    padding: 20px 15px;
    height: min-content;
    width: 40vw;
    @media (max-width: 768px) {
      width: 85vw;
    }
    z-index: 6;
    border-radius: 10px;
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
