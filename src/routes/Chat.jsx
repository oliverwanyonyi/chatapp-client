import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatBody from "../components/ChatBody";
import ChatSidebar from "../components/ChatSidebar";
import { ChatAppState } from "../AppContext/AppProvider";
import axios from "axios";
import { notifyRoute } from "../api";
import Modal from "../components/Modal";

const Chat = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setNotifications, socket } =
    ChatAppState();
  const [showModal, setShowModal] = useState(false);

  const [modalChildren, setModalChildren] = useState();

  const getNotifs = async () => {
    const { data } = await axios.get(`${notifyRoute}?userId=${currentUser.id}`);
    setNotifications(data);
  };

  useEffect(() => {
    if (currentUser) {
      getNotifs();
    }
  }, [currentUser]);
  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("auth")));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.emit("join", {
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        bio: currentUser.bio,
        online: true,
      });
    }
  }, [currentUser]);
  return (
    <Container>
      <Modal
        setShowModal={setShowModal}
        showModal={showModal}
        type={modalChildren}
      />
      <ChatSidebar
        modalChildren={modalChildren}
        setModalChildren={setModalChildren}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      <ChatBody
        setModalChildren={setModalChildren}
        setShowModal={setShowModal}
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
