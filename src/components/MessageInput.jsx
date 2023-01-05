import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { messageRoute, notifyRoute } from "../api";
import { ChatAppState } from "../AppContext/AppProvider";
import { getChatDetails } from "../utils/getChatDetails";

const MessageInput = ({
  selectedChat,
  setSelectedChat,
  currentUser,
  messages,
  setMessages,
  socket,
  setChats,
}) => {
  const [message, setMessage] = useState("");
  const [memberStatus, setMemberStatus] = useState();
  const { chats, setMessage:setInfo, setShowMessage } = ChatAppState();
  const focusRef = useRef();

  function stoppedTyping() {
    socket.emit("typing-stopped", {
      to: selectedChat.isGroup
        ? selectedChat.users.map((u) => u._id)
        : getChatDetails(currentUser, selectedChat?.users)._id,
      chatId: selectedChat?._id,
      from: currentUser.id,
      groupTyping: selectedChat.isGroup ? true : false,
    });
  }

  const saveNotif = async (notif) => {
    await axios.post(`${notifyRoute}`, { notif });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (message.length > 0) {
      const { data } = await axios.post(`${messageRoute}/send`, {
        message,
        from: currentUser.id,
        chatId: selectedChat?._id,
      });

      saveNotif({
        chatId: selectedChat._id,
        text: `new unread message from ${currentUser.username}`,
        count: 1,
        to: selectedChat.isGroup
          ? selectedChat.users
              .filter((u) => u._id !== currentUser.id)
              .map((u) => u._id)
          : [getChatDetails(currentUser, selectedChat?.users)._id],
      });

      setMessages([
        ...messages,
        {
          fromSelf: true,
          message: message,
          from: currentUser.id,
          updatedAt: data.updatedAt,
        },
      ]);
      const chatToUpdate = chats.find((c) => c._id === selectedChat._id);
      setChats((prev) => [
        {
          ...chatToUpdate,
          lastMessage: { text: data.message, updatedAt: data.updatedAt },
        },
        ...prev.filter((chat) => chat._id !== selectedChat._id),
      ]);

      socket.emit("message-sent", {
        message,
        fromSelf: true,
        to: selectedChat.isGroup
          ? [...selectedChat.users.map((u) => u._id)]
          : getChatDetails(currentUser, selectedChat.users)._id,
        chatId: selectedChat._id,
        chat: {
          ...chatToUpdate,
          lastMessage: { text: data.message, updatedAt: data.updatedAt },
        },
        sender: currentUser.id,
        updatedAt: data.updatedAt,
        groupMessage: selectedChat.isGroup ? true : false,
      });
      setMessage("");
      stoppedTyping();
    }
  };
  const handleTyping = (e) => {
    if (e.target.keyCode !== 13) {
      socket.emit("typing", {
        text: selectedChat.isGroup
          ? `${currentUser.username} is typing...`
          : "typing...",
        chatId: selectedChat?._id,
        to: selectedChat.isGroup
          ? selectedChat.users.map((u) => u._id)
          : getChatDetails(currentUser, selectedChat?.users)._id,
        groupTyping: selectedChat.isGroup ? true : false,
        from: currentUser.id,
      });
    }
  };

  useEffect(() => {
    socket.on("removed", (data) => {
      setMemberStatus(`${data.admin} removed you`);
      setSelectedChat(data.chat);
    });
    socket.on("someone-left", (data) => {
      setSelectedChat(data.chat);
      setInfo({
        type: "info",
        text: `${data.text}`,
      });
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    });
  }, [socket]);
  useEffect(() => {
    focusRef.current?.focus();
  }, [selectedChat]);

  return (
    <Container>
      <form onSubmit={submitHandler}>
        {selectedChat.isGroup &&
        !selectedChat.users.map((u) => u._id).includes(currentUser.id) ? (
          <div className="disabled">
            <p>{memberStatus || "You left"}</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={handleTyping}
              onBlur={() => stoppedTyping()}
              ref={focusRef}
              placeholder="Write Something"
            />
            <button>Send</button>
          </>
        )}
      </form>
    </Container>
  );
};
const Container = styled.div`
  height: 10vh;
  width: 95%;
  margin: 0 auto;
  form {
    width: 100%;
    height: 80%;
    display: block;
    position: relative;
    .disabled {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      background: #fff;
      border: 2px solid #8b64ef;
      border-radius: 30px;
      cursor: not-allowed;
    }
    p {
      color: #f14242 !important;
      text-align: center;
      padding-top: 10px;
    }
    input {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      border: 2px solid #8b64ef;
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
