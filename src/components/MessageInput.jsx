import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { messageRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import { getChatDetails } from "../utils/getChatDetails";

const MessageInput = ({
  selectedChat,
  currentUser,
  messages,
  setMessages,
  socket,
}) => {
  const [message, setMessage] = useState("");
  const {fetchChats,setFetchChats} = ChatAppState()
  const focusRef = useRef();

  function stoppedTyping() {
    socket.emit("typing-stopped", { to: getChatDetails(currentUser,selectedChat?.users)._id,chatId:selectedChat?._id });
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    if (message.length > 0) {
      const { data } = await axios.post(`${messageRoute}/send`, {
        message,
        from: currentUser.id,
        chatId:selectedChat?._id
      });
      console.log(data);

      setMessages([
        ...messages,
        {
          fromSelf: true,
          message: message,
          from: currentUser.id,
          createdAt: data.createdAt,
        },
      ]);
      setMessage("");
      setFetchChats(!fetchChats)
      socket.emit("message-sent", {
        message,
        fromSelf: true,
        to: getChatDetails(currentUser,selectedChat.users)._id,
        from: currentUser.id,
        chatId:selectedChat._id,
        createdAt: data.createdAt,
      });

      stoppedTyping();
    } 
  };
  const handleTyping = (e) => {
    if (e.target.keyCode !== 13) {
      socket.emit("typing", {
        text: `${currentUser.username} is typing. . .`,
        chatId: selectedChat?._id,
         to: getChatDetails(currentUser,selectedChat?.users)._id,
      });
    }
  };
  useEffect(() => {
    focusRef.current?.focus();
  },[]);
  return (
    <Container>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={handleTyping}
         onBlur={()=>stoppedTyping()}
          ref={focusRef}
          placeholder="Write Something"
        />
        <button>Send</button>
      </form>
    </Container>
  );
};
const Container = styled.div`
  height: 10vh;

  form {
    width: 100%;
    height: 80%;
    display: block;
    position: relative;
    input {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      border: 2px solid #8b64ef;
      border-radius: 5px;
      transition: 100ms ease-in;
      font-size: 16px;
      border-radius: 30px;
      &:focus {
        outline: 2px solid #6c37f3;
      }
    }
    button {
      position: absolute;
      right: 2%;
      padding: 10px 20px;
      color: #ffffff;
      background: #8b64ef;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 20px;
      cursor: pointer;
      transition: 259ms ease-in;

      &:hover {
        background: #6c37f3;
      }
    }
  }
`;
export default MessageInput;
