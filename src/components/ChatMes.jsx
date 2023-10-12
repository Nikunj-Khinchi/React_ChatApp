import React, { useContext } from "react";
import Cam from "../image/cam.png";
import Add from "../image/add.png";
import More from "../image/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const ChatMes = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      {data && <Input/>
      }
      
    </div>
  );
};

export default ChatMes;