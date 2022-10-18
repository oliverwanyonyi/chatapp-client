import React, { useState } from 'react'
import styled from 'styled-components'
import Profile from './Profile'
import Room from './Room'

const ChatBody = ({selectedChat,setSelectedChat,currentUser,socket,chats}) => {
  const [showProfile,setShowProfile] = useState(false)
  return (
    <Container className={selectedChat? "visible":""}>
      <Room setShowProfile={setShowProfile} showProfile={showProfile} selectedChat={selectedChat} currentUser={currentUser} socket={socket} setSelectedChat={setSelectedChat}/>
      <Profile showProfile={showProfile} setShowProfile={setShowProfile} selectedChat={selectedChat}/>
    </Container>
  )
}
const Container = styled.div`
  display:flex;
width: 70%;
overflow-x: hidden;

@media(max-width:768px){
  width: 100%;
  display: none;
  &.visible{
    display: flex;
  }
}
`
export default ChatBody