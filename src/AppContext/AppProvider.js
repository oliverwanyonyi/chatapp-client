import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { host } from "../api";
const AppContext = createContext();
const socket = io.connect(host);

const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [typingStatus, setTypingStatus] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [fetchChats, setFetchChats] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [groupId,setGroupId]  = useState()
  const [message, setMessage] = useState({
    type: "",
    title: "",
    text: "",
  });
  useEffect(() => {
    const user = localStorage.getItem("auth")
      ? JSON.parse(localStorage.getItem("auth"))
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
        setTypingStatus,
        typingStatus,
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
        message,
        setMessage,
        setShowMessage,
        showMessage,
        groupId,
        setGroupId
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
