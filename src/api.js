const host = "https://tiktalk.herokuapp.com";
const registerRoute = `${host}/api/users/register`
const loginRoute = `${host}/api/users/login`
const profileRoute = `${host}/api/users`

const getUsersRoute = `${host}/api/users`
const messageRoute = `${host}/api/message`

export {registerRoute,loginRoute,getUsersRoute,messageRoute,profileRoute,host}