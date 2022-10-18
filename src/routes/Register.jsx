import FormContainer from "../components/FormContainer";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { registerRoute } from "../api";
import { handleFileUpload } from "../utils/fileUpload";
const Register = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
const [avatar,setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("tiktalk-user")) {
      navigate("/");
    }
  });

  const handleUploadFile = (e) =>{
    handleFileUpload(e,setLoadingImageUpload,setAvatarPreview,setAvatar)
  }
  // const handleUploadFile = async (e) => {
  //   const file = e.target.files[0];

  //   if (
  //     file.type === "image/jpeg" ||
  //     file.type === "image/jpg" ||
  //     file.type === "image/png" ||
  //     file.type === "image/webp"
  //   ) {
  //     setAvatarPreview(URL.createObjectURL(file));
  //     let formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", "tiktalk-app");
  //     formData.append("cloud_name", "wanyonyi");
      

  //     try {
  //       setLoadingImageUpload(true);
  //       const res = await fetch("https://api.cloudinary.com/v1_1/wanyonyi/upload", {
  //         body: formData,
  //         method: "POST",
  //       });
  //       const data = await res.json();   
        
  //       setAvatar(data.url)
  //       setLoadingImageUpload(false);
  //     } catch (error) {
  //       setLoadingImageUpload(false);
  //       console.log(error.message);
  //     }
  //   } else {
  //     alert("Ther file you are trying to upload is not an image");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(avatar){
      try {
        setLoading(true);
        const { data } = await axios.post(registerRoute, {...user, avatar:avatar});
        setLoading(false);
        if (data.success) {
          console.log(data.user);
          localStorage.setItem("tiktalk-user", JSON.stringify(data.user));
          navigate("/");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        console.log(error);
      }
    }else{
      alert("please upload an image")
    }

    
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value.trim().toLowerCase() });
  };
  return (
    <FormContainer>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Join TikTalk</h3>
        <div className="form-group upload-group">
          {avatarPreview && (
            <div className="avatar">
              <img src={avatarPreview} alt="" />
            </div>
          )}
          <label className="upload-btn" htmlFor="avatar">
            upload profile+
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
            {loadingImageUpload?"Image uploading please wait": loading ? "Signing you up" : "Register"}
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
