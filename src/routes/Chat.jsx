
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import io from "socket.io-client";
import ChatBody from "../components/ChatBody";
import ChatSidebar from "../components/ChatSidebar";
import { host } from "../api";
const socket = io.connect(host);

const Chat = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [selectedChat, setSelectedChat] = useState();

  useEffect(() => {
    if (!localStorage.getItem("tiktalk-user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("tiktalk-user")));
    }
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      socket.emit("join", {
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        bio:currentUser.bio,
        email:currentUser.email,
        online: true,
        createdAt:currentUser.createdAt
      });
    }
  }, [currentUser]);

  return (
    <Container>
      <ChatSidebar
        currentUser={currentUser}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
        setCurrentUser={setCurrentUser}
        socket={socket}
      />
      <ChatBody
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        currentUser={currentUser}
        socket={socket}
      />
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
