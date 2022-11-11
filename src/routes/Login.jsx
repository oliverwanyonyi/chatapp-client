import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { getErrorMessage } from "../utils/getErrorMessage";

const Login = () => {
  const [user, setUser] = useState({ emailOrName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setMessage, setShowMessage } = ChatAppState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(loginRoute, user);
      localStorage.setItem("auth", JSON.stringify(data.user));
      setMessage({
        type: "success",
        title: "Login Succesful",
        text: "Login successful redirecting...",
      });
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        setLoading(false);
        navigate("/");
      }, 5000);
    } catch (error) {
      setMessage({
        type: "error",
        title: "Login Failed",
        text: getErrorMessage(error),
      });
      setShowMessage(true);
      setLoading(false);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value.trim().toLowerCase() });
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("auth"));
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <FormContainer>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Login to continue </h3>

        <div className="form-group">
          <label htmlFor="emailOrName" className="form-label">
            Email or Username
          </label>
          <input
            type="text"
            name="emailOrName"
            className="form-control"
            id="email"
            value={user.email}
            onChange={handleChange}
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
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <Loader type="sm"/> : "Login"}
        </button>
        <span>
          Don't have an account <Link to="/register">Register</Link>
        </span>
      </form>
    </FormContainer>
  );
};

export default Login;
