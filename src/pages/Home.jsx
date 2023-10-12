import React from 'react'
import Sidebar from '../components/Sidebar'
// import Chat from "../components/Chat"
import "../style.scss"
import ChatMes from '../components/ChatMes'
const Home = () => {
  return (
    <div className="home">
        <div className="container">
            <Sidebar />
            <ChatMes />
        </div>
    </div>
  )
}

export default Home