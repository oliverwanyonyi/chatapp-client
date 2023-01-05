const host = "https://talktooapi.up.railway.app";
// const host = "http://localhost:5000";
const registerRoute = `${host}/api/users/register`;
const loginRoute = `${host}/api/users/login`;
const profileRoute = `${host}/api/users`;

const getUsersRoute = `${host}/api/users`;
const createChatRoute = `${host}/api/chat/create`;
const getChatsRoute = `${host}/api/chat`;

const messageRoute = `${host}/api/message`;
const notifyRoute = `${host}/api/users/notify`;
const createGroupRoute = `${host}/api/chat/group/create`;
const updateGroupRoute = `${host}/api/chat/group/update`;
const removeUserRoute = `${host}/api/chat/group/remove`;
const leaveGroup = `${host}/api/chat/group/leave`;

export {
  registerRoute,
  loginRoute,
  getUsersRoute,
  messageRoute,
  profileRoute,
  getChatsRoute,
  createChatRoute,
  notifyRoute,
  createGroupRoute,
  updateGroupRoute,removeUserRoute,leaveGroup,
  host,
};
