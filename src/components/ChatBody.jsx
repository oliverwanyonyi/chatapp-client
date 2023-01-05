import React, { useState } from "react";
import styled from "styled-components";
import { ChatAppState } from "../AppContext/AppProvider";
import Profile from "./Profile";
import Room from "./Room";

const ChatBody = ({setModalChildren,setShowModal}) => {
  const [showProfile, setShowProfile] = useState(false);
  const { selectedChat } = ChatAppState();
  return (
    <Container className={selectedChat ? "visible" : ""}>
      <Room setShowProfile={setShowProfile} setShowModal={setShowModal} setModalChildren={setModalChildren} showProfile={showProfile} />
      <Profile showProfile={showProfile} setShowProfile={setShowProfile} />
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  width: 70%;
  overflow-x: hidden;
  height: 100%;

  @media (max-width: 768px) {
    width: 100%;
    display: none;
    &.visible {
      display: flex;
    }
  }
`;
export default ChatBody;
