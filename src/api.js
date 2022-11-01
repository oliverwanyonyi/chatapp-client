const host = "https://talktooapi.herokuapp.com";
// const host = "http://localhost:5000"
const registerRoute = `${host}/api/users/register`;
const loginRoute = `${host}/api/users/login`;
const profileRoute = `${host}/api/users`;

const getUsersRoute = `${host}/api/users`;
const createChatRoute = `${host}/api/chat/create`;
const getChatsRoute = `${host}/api/chat`;

const messageRoute = `${host}/api/message`;
const notifyRoute = `${host}/api/users/notify`
export {
  registerRoute,
  loginRoute,
  getUsersRoute,
  messageRoute,
  profileRoute,
  getChatsRoute,
  createChatRoute,notifyRoute,
  host,
};
