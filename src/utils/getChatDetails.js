export const getChatDetails= (currentUser,users)=>{
  if(currentUser?.id === users[0]._id){
    return users[1]
  }else{
    return users[0]
  }
}