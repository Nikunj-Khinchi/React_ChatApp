import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const MessageM = ({ messages }) => {
  // here we show the messages
  console.log(messages);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // now we use ref and useEffect to scroll the message to the bottom
  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
console.log(messages);

  return (
    <div
      ref={messageRef}
      className={`message ${messages.sender === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            messages.sender === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{messages.date}</span>
      </div>


      <div className="messageContent">
        <p>{messages.text}</p>
        {messages.image && <img src={messages.image} alt="" />}
        {messages.video && (
          <video controls>
            <source src={messages.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};
export default MessageM;

