import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatBody from "../components/ChatBody";
import ChatSidebar from "../components/ChatSidebar";
import { ChatAppState } from "../AppContext/AppProvider";
import axios from "axios";
import { notifyRoute } from "../api";

const Chat = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setNotifications, socket } =
    ChatAppState();

  const getNotifs = async () => {
    const { data } = await axios.get(`${notifyRoute}?userId=${currentUser.id}`);
    console.log(data);
    setNotifications(data);
  };

  useEffect(() => {
    if (currentUser) {
      getNotifs();
    }
  }, [currentUser]);
  useEffect(() => {
    if (!localStorage.getItem("talktoo-user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("talktoo-user")));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.emit("join", {
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        bio: currentUser.bio,
        email: currentUser.email,
        online: true,
        createdAt: currentUser.createdAt,
      });
    }
  }, [currentUser]);
  return (
    <Container>
      <ChatSidebar />
      
      <ChatBody />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100vw;
  max-height: 100vh;
  background: #ffffff;
`;
export default Chat;
