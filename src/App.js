import "./App.css";
import {  Routes, Route } from "react-router-dom";
import Chat from "./routes/Chat";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Message from "./components/Message";
import NotFound from "./routes/NotFound";
function App() {
  return (
    <>
      <Message />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat />} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </>
  );
}



export default App;
