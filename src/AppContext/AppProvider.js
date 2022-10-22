import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { host } from "../api";
const AppContext = createContext();
const socket = io.connect(host);

const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [chats, setChats] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [typingStatus, setTypingStatus] = useState(null);
  const [typingId, setTypingId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [fetchChats, setFetchChats] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("talktoo-user")
      ? JSON.parse(localStorage.getItem("talktoo-user"))
      : null;
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        notifications,
        typingStatus,
        setTypingStatus,
        typingId,
        setTypingId,
        selectedChat,
        setSelectedChat,
        setNotifications,
        socket,
        setFetchChats,
        fetchChats,
        chats,
        setChats,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const ChatAppState = () => {
  return useContext(AppContext);
};
export default AppProvider;
