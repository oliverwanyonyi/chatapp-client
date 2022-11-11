import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { profileRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import { handleFileUpload } from "../utils/fileUpload";
import { getErrorMessage } from "../utils/getErrorMessage";
import Loader from "./Loader";

const ProfileDetails = ({ setShowModal, handleClick }) => {
  const [user, setUser] = useState({ username: "", bio: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [loadingImageUpload, setLoadingImageUpload] = useState();
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const { currentUser, setCurrentUser, setMessage, setShowMessage } =
    ChatAppState();
  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (currentUser) {
      setUser({
        
        username: currentUser.username,
        email: currentUser.email,
        bio: currentUser.bio,
      });
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
    if (!user.username || !user.email || !user.bio) {
      setMessage({
        type: "error",
        title: "Profile Update Failed",
        text: "All fields are required",
      });
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const { data } = await axios.put(
          `${profileRoute}/${currentUser.id}`,

          { ...user, avatar: avatar },
          config
        );
        console.log(data)
        const auth = JSON.parse(localStorage.getItem("auth"));
        auth.bio = data.user.bio;
        auth.avatar = data.user.avatar;
        localStorage.setItem("auth", JSON.stringify(auth));
        setCurrentUser({
          ...currentUser,
          bio: data.user.bio,
          avatar: data.user.avatar,
          email: data.user.email,
          username: data.user.username,
        });
        setMessage({
          type: "success",
          title: "Update Profile Successful",
          text: "profile update successful",
        });
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          setShowModal(false);
        }, 5000);
        setLoading(false);
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
  }

  return (
    <div>
      <div className="header">
        <div className="title">Update profile Info</div>
        <span className="fas fa-times" onClick={handleClick}></span>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="upload-zone">
          <div className="upload-preview" title="upload profile image here">
            <label htmlFor="file" className="file-upload-icon">
              <i className="fas fa-camera"></i>
            </label>
            <input
              type="file"
              name=""
              id="file"
              onChange={handleUploadFile}
              style={{ display: "none" }}
            />
            {avatarPreview && <img src={avatarPreview} alt="" className="" />}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Hi there iam using talktoo!"
            className="form-control"
            value={user.username}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email Address"
            className="form-control"
            value={user.email}
            onChange={changeHandler}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">About</label>
          <input
            type="text"
            id="bio"
            name="bio"
            placeholder="Hi there iam using talktoo!"
            className="form-control"
            value={user.bio}
            onChange={changeHandler}
          />
        </div>

        <button className="submit-btn" disabled={loading || loadingImageUpload}>
          {loading ? (
            <Loader type="sm" />
          ) : loadingImageUpload ? (
            <Loader type="sm" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};



export default ProfileDetails;
