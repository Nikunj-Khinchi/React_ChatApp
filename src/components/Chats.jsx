import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
// import { getDownloadURL, getStorage, ref } from "firebase/storage";

const Chats = () => {
  // here we fetch the user chats from the firestore
  // at the beginning we set the chats as empty array
  const [chats, setChats] = useState([]);

  // here we get the current user from the context
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  // here we fetch data in realtime not only one time for that we will use firebase snapshot
  useEffect(() => {
    const getChats = async () => {
      const unsubscribe = onSnapshot(
        doc(db, "userChat", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => unsubscribe();
    };
    // console.log(chats);
    // here we call the function
    // for if the current user is not null then it will fetch the data
    currentUser.uid && getChats();

    // here we pass the current user id as a dependency so that whenever the current user id change it will fetch the data again from the firestore like a realtime database
  }, [currentUser.uid]);

  // the data comes in object format so we need to convert it into array format
  // console.log(Object.entries(chats));


  

  const handelSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };


  return (
    // here we map through the chats and show the chats
    <div className="chats">
      {/* here we will also sort our users based on latest messages */}
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          // using the unique key for each chat
          <div
            className="userChat"
            key={chat[0]}
            //  here we pass the user info to the dispatch function
            onClick={() => handelSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
