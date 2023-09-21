import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { RoomContext } from "../context/RoomContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const RoomMessage = (message) => {
  //console.log("message", message);
  const [details, setDetails] = useState("");
  // const [messageTime, setMessageTime] = useState("Just Now");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(RoomContext);
  const ref = useRef();
  //console.log("data.user.photoURL", message);
  //console.log("currentUser.photoURL", currentUser.photoURL);
  const jsDate = message.message.date.toDate();
  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
    const getDetails = async () => {
      try {
        const response = await getDoc(
          doc(db, "users", message.message.senderId)
        );
        if (response.exists()) {
          const documentData = response.data();
          setDetails(documentData);
        } else {
          //console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
    getDetails();
  }, [message]);
  return (
    <>
      <div
        ref={ref}
        className={`message ${
          message.message.senderId === currentUser.uid && "owner"
        }`}
      >
        <div className="messageInfo">
          <span style={{ color: "black" }}>{details.displayName}</span>
          <img
            src={
              message.message.senderId === currentUser.uid
                ? currentUser.photoURL
                : details.photoURL
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

export default RoomMessage;
