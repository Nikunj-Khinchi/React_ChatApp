import React, { useContext, useState } from "react";
import Img from "../image/img.png";
// import video from "../image/video.png"
import Attach from "../image/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {  arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// encrypt the text

const Input = () => {
  // here we use useState for text and image
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [video , setVideo] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  
  // const [time , setTime] = useState();
  let time = currentHour + ":" + currentMinute;
  // setTime(times);

  const handelSend = async () => {
    // if image is not null then we will send image

    if (image) {
      // here we create a storage reference for the image
      const storageRef = ref(storage, uuid());
      // here we upload the image to the storage
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;

            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          // setError(true);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            // now here we also send the text too with the image

            // updates element in the array field using the arrayUnion() function
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                // here we need to add unqiue id for each message so we install uuid package and use it here
                id: uuid(),
                text ,
                sender: currentUser.uid,
                date: time,
                // here we add the image url
                image: downloadURL,
              }),
            });
          });
        }
      );

    }
    // try for videos
    else if(video){

       // Similar to how you handle images, you'll need to upload the video here.
       const storageRef = ref(storage, uuid());
       const uploadTask = uploadBytesResumable(storageRef, video);

       uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;

            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          // setError(true);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("Video File available at", downloadURL);
            // now here we also send the text too with the image
            // updates element in the array field using the arrayUnion() function
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                // here we need to add unqiue id for each message so we install uuid package and use it here
                id: uuid(),
                text ,
                sender: currentUser.uid,
                date: time,
                // here we add the video url
                video: downloadURL,
              }),
            });
          });
        }
      );
    }
      // else we send only text    
    else {
    
      // updates element in the array field using the arrayUnion() function
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          // here we need to add unqiue id for each message so we install uuid package and use it here
          id: uuid(),
          text ,
          sender: currentUser.uid,
          date: time,
        }),
      });
    }

    // now we will update the userChat collection so we get the last message and the date of the message
    await updateDoc(doc(db, "userChat", currentUser.uid), { 
      // here we use the dot notation to update the nested object
      [data.chatId+".lastMessage"]: {text}, 
      [data.chatId+".date"]: serverTimestamp(),

    }); 

    await updateDoc(doc(db, "userChat", data.user.uid), { 
      // here we use the dot notation to update the nested object
      [data.chatId+".lastMessage"]: {text}, 
      [data.chatId+".date"]: serverTimestamp(),

    }); 


    // after sending the message we set the text and image as empty
    setText('');  
    setImage(null);
    setVideo(null);

  };

  const view = data.user?.displayName;
  const handelkey = (e) => {
   
    e.code === "Enter" && handelSend();
 
  };


  return (

  <div className="input">

   {view &&  <div className="inner">
      <input
        type="text"
        
        placeholder="Type something..."
        onKeyDown={handelkey}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input type="file" name="" style={{display:"none"}}
        id="Vfile"
        accept=".mp4"
        onChange={(e)=> setVideo(e.target.files[0])}
        />
        <label htmlFor="Vfile">
        <img src={Attach} alt=""/>
        </label>

        <input
          type="file"
          name=""
          style={{ display: "none" }}
          id="file"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => setImage(e.target.files[0])}
          
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handelSend}>Send</button>
      </div>
    </div>}
  </div>

 
  );
};

export default Input;
