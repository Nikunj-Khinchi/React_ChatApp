import React, { useContext, useEffect, useState } from 'react'
import MessageM from './MessageM'
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Messages = () => {

  const [messages, setMessages] = useState([]); 
  const {data} = useContext(ChatContext);

  useEffect(()=>{
    const unsubscribe = onSnapshot(doc(db,"chats", data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages);
    })

    return () => unsubscribe();
  }, [data.chatId])

  return (
    <div className='messages'>
      {messages.map((message) => (
        <MessageM key={message.id}  messages={message}/>
      ))}

    </div>
  )
}

export default Messages