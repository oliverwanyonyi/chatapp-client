export default function getMessageTimeStamp(dateString) {
  const dateObj = new Date(dateString);

  let hours = dateObj.getHours().toString();
  let minutes = dateObj.getMinutes().toString();
  let date = dateObj.getDate();
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth();

  let time;

  console.log(hours.length);
  hours.length <= 1 ? (hours = `0${hours}`) : (hours = hours);
  minutes.length <= 1 ? (minutes = `0${minutes}`) : (minutes = minutes);

  hours >= 12
    ? (time = `${hours}:${minutes} pm`)
    : (time = `${hours}:${minutes} am`);

  let fulldate = "";
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let today = new Date().getDate()
 if(today - date === 0){
    fulldate=`Today at ${time}`
 }else if(today - date === 1){
    fulldate = `Yesterday at ${time}`
 }else if(today -  date === 2){
    fulldate = `${weekdays[dateObj.getDay()]} at ${time}`
 }else if(today - date === 3){
    fulldate = `${weekdays[dateObj.getDay()]} at ${time}`
 }else if(today - date === 4){
    fulldate = `${weekdays[dateObj.getDay()]} at ${time}`
 }
 else{
    fulldate = `${month}/${date}/${year}`
 }
  return fulldate;
}

