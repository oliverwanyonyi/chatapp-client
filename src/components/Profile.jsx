import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
const Profile = ({showProfile,setShowProfile,selectedChat}) => {
  return (
    <Container className={showProfile?"visible":""}>
        <div className="profile-container">
            <div className="profile-img">
                <img src={selectedChat?.avatar} alt="" />
            </div>
            <h2 className="profile-name">{selectedChat?.username}</h2>
            <p>{selectedChat?.email}</p>
            <p className="profile-bio">{selectedChat?.bio}</p>
            <p className="date-joined">Joined {moment(selectedChat?.createdAt).fromNow()}</p>
            <button className="back" onClick={()=>setShowProfile(!showProfile)}>Go back</button>
        </div>
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