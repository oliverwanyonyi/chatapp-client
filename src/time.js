function getCurrentTime(){
    const date = new Date()

    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString()
    console.log(hours.length)
    hours.length <=1 ? hours = `0${hours}`:hours = hours 
    minutes.length <=1 ? minutes = `0${minutes}`:minutes = minutes

    let time;
    
    
    hours  >= 12 ? time=`${hours}:${minutes} pm`:time=`${hours}:${minutes} am`
    return time
}