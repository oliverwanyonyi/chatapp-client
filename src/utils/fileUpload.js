export const handleFileUpload = async(e,setLoadingUpload,setAvatarPreview,setAvatar)=>{
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
        setLoadingUpload(false);
      } catch (error) {
        setLoadingUpload(false);
        console.log(error.message);
      }
    } else {
      alert("Ther file you are trying to upload is not an image");
    }
}