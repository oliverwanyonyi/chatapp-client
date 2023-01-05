export const handleFileUpload = async(e,setLoadingUpload,setAvatarPreview,setAvatar,setMessage,setShowMessage)=>{
  console.log(e)  
  const file = e.target.files[0];

    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/webp"
    ) {
      setAvatarPreview(URL.createObjectURL(file));
      let formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tiktalk-app");
      formData.append("cloud_name", "wanyonyi");
    
      try {
        setLoadingUpload(true);
        const res = await fetch("https://api.cloudinary.com/v1_1/wanyonyi/upload", {
          body: formData,
          method: "POST",
        });
        const data = await res.json();   
        
        setAvatar(data.url)
        setShowMessage(true)
        setMessage({type:"success",title:"Upload Successful",text:"file uploaded successfully"});
        setTimeout(()=>{
          setShowMessage(false)
        },5000)
        setLoadingUpload(false);
      } catch (error) {
        setLoadingUpload(false);
        setShowMessage(true)
        setMessage({type:"error",title:"Upload Error",text:"network error failed to upload image"});
        setTimeout(()=>{
          setShowMessage(false)
        },5000)
      }
    } else {
      setShowMessage(true)
      setMessage({type:"error",title:"Upload Error",text:"The file you are trying to upload is not an image"});
      setTimeout(()=>{
        setShowMessage(false)
      },5000)
    }
}