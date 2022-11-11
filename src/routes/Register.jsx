import FormContainer from "../components/FormContainer";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { registerRoute } from "../api";
import { handleFileUpload } from "../utils/fileUpload";
import { ChatAppState } from "../AppContext/AppProvider";
import { getErrorMessage } from "../utils/getErrorMessage";
import Loader from "../components/Loader";
const Register = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setMessage, setShowMessage } = ChatAppState();

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  },[]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let newUser = {};

      if (avatar) {
        newUser = { ...user, avatar: avatar };
      } else {
        newUser = user;
      }
      const { data } = await axios.post(registerRoute, newUser);
    
      localStorage.setItem("auth", JSON.stringify(data.user));
      setMessage({
        type: "success",
        title: "Registration Succesful",
        text: "registration successful redirecting...",
      });
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        setLoading(false);
        navigate('/')
      }, 5000);
    } catch (error) {
      setMessage({
        type: "error",
        title: "Registration Failed",
        text: getErrorMessage(error),
      });
      setShowMessage(true);
      setLoading(false);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value.trim().toLowerCase() });
  };
  return (
    <FormContainer>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Join TalkToo</h3>
        <div className="form-group upload-group">
          {avatarPreview && (
            <div className="avatar">
              <img src={avatarPreview} alt="" />
            </div>
          )}
          <label className="upload-btn" htmlFor="avatar" >
            upload profile+
          </label>
          <input
            type="file"
            name="avatar"
            style={{ display: "none" }}
            disabled={avatar?true:false}
            id="avatar"
            onChange={handleUploadFile}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="form-control"
            id="username"
            value={user.username}
            onChange={handleChange}
            disabled={loadingImageUpload}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="email"
            required
            value={user.email}
            onChange={handleChange}
            disabled={loadingImageUpload}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            id="password"
            value={user.password}
            minLength={8}
            disabled={loadingImageUpload}
          />
        </div>
        <div className="btn-container">
          <button type="submit" disabled={loadingImageUpload || loading}>
            {loadingImageUpload
              ? <Loader type="sm"/>
              : loading
              ? <Loader type="sm"/>
              : "Register"}
          </button>
        </div>
        <span>
          Already have an account <Link to="/login">Login</Link>
        </span>
      </form>
    </FormContainer>
  );
};

export default Register;
