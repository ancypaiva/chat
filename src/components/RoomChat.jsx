import React, { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import RoomMessages from "./RoomMessages";
import RoomInput from "./RoomInput";
import Message from "../img/Message1.png";
import { AuthContext } from "../context/AuthContext";

const RoomChat = () => {
  const { data } = useContext(RoomContext);
  const {currentUser,profile} = useContext(AuthContext)
  console.log(data, "roomchat");
  return (
    <div className="chat">
     {!profile ? (data.RoomId!== "null" ? (
        <><div className="chatInfo">
          <span style={{ color: 'white' }}>{data.room?.room_name}</span>
        </div><RoomMessages /><RoomInput /></>):(
          <div className="chatMessage">
          
            <img src={Message} alt=""/>
          
          
          <h1>Welcome,{currentUser.displayName}</h1>
          <p>Chat. Connect. Chatify.</p>
         
        </div>
        )
      ): (
          <div className="chatMessage">
          
            <img src={Message} alt=""/>
          
          
          <h1>Welcome,{currentUser.displayName}</h1>
          <p>Chat. Connect. Chatify.</p>
         
        </div>
        ) }
    </div>
  );
};
export default RoomChat;
