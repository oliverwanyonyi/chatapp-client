import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { ChatAppState } from '../AppContext/AppProvider'
import { getChatDetails } from '../utils/getChatDetails'
const Profile = ({showProfile,setShowProfile}) => {
    const {selectedChat,currentUser} = ChatAppState()
  return (
    <Container className={showProfile?"visible":""}>
       {selectedChat && <div className="profile-container">
            <div className="profile-img">
                <img src={getChatDetails(currentUser,selectedChat?.users).avatar} alt="" />
            </div>
            <h2 className="profile-name">{getChatDetails(currentUser,selectedChat?.users).username}</h2>
            <p>{getChatDetails(currentUser,selectedChat?.users).email}</p>
            <p className="profile-bio">{getChatDetails(currentUser,selectedChat?.users).bio}</p>
            <p className="date-joined">Joined {moment(getChatDetails(currentUser,selectedChat?.users)?.createdAt).fromNow()}</p>
            <button className="back" onClick={()=>setShowProfile(!showProfile)}>Go back</button>
        </div>}
    </Container>
  )
}
const Container = styled.div`
width: 0;
transition:200ms width ease-in-out;
opacity: 0;
visibility: hidden;
height:100vh;
display: flex;
align-items: center;
justify-content: center;
@media(max-width:768px){
    transform: translateY(-100%);
    transition:300ms transform ease-in-out;
} 
&.visible{
    width: 30%;
    visibility: visible;
    opacity: 1;
    @media(max-width:768px){
        width:100%;
        transform:translateY(0);
    } 
}
.profile-container{
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
   .profile-img{
    width:6rem;
    height:6rem;
    border-radius: 50%;
    overflow:hidden;
    margin-bottom: 20px;
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
   }
   .profile-name{
    color: #6c37f3;
    font-size: 17px;
    margin-bottom: 5px;
    text-transform: capitalize;
   }
   .profile-bio{
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: 400;
    margin-top:10px;
    
   }
   .date-joined{
    margin-bottom: 20px;
   }
   .back{
  display:flex;
  align-items:center;
  gap:7px; background:#6c37f3;
  color:#fff;
  padding:.5rem 1rem;
  font-weight:bold;
  cursor:pointer;
  border-radius:.2rem;
  transition:.5s ease-out;
  text-transform:capitalize;
  transition: 200ms ease-in-out;
  display:none;
  &:hover{
    background: #8b64ef;
  }
  @media(max-width:768px){ 
      display: flex;
  }
}
}
`

export default Profile