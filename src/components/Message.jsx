import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import moment from "moment";

const Message = (message) => {
  //console.log("message", message);
  // const [messageTime, setMessageTime] = useState("Just Now");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  //console.log("data.user.photoURL", message);
  //console.log("currentUser.photoURL", currentUser.photoURL);
  const jsDate = message.message.date.toDate();
  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
    // setMessageTime(moment().format('hh:mm A'));
  }, [message]);
  return (
    <>
      {/* <h1>{message.message.text}</h1> */}
      <div
        ref={ref}
        className={`message ${
          message.message.senderId === currentUser.uid && "owner"
        }`}
      >
        <div className="messageInfo">
          <img
            src={
              message.message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.user.photoURL
            }
            alt=""
          />
          <span>{moment(jsDate).format("hh:mm A")}</span>
        </div>
        <div className="messageContent">
        {message.message.text && <p>{message.message.text}</p>}

          {message.message.image && <img src={message.message.image} alt="" />}
        </div>
      </div>
    </>
  );
};

export default Message;
