import React, { useContext, useEffect, useState } from "react";

import Img from "../img/img.png";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [image, setImage] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  //console.log("data in input", data);
  //console.log("current user in input", currentUser);  
  const handleSend = async () => {
    const response = await getDoc(doc(db, "users", currentUser.uid));
    if (response.data()?.friendList?.includes(data.user.uid)) {
    
      if (image) {
        const storageRef = ref(storage, uuid());

        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          (error) => {
            setError(true);
            //console.log(error, "error");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId),
                {
                  messages: arrayUnion({
                    id: uuid(),
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    image: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } else if (text !== "") {
        const text1= text;
        setText('');
        console.log("chat id in input", data.chatId);
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text:text1,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text:text1,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
        //console.log(data, "doc");
        //console.log(data.user.uid, data.chatId, text, "check");
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text:text1,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
      }
      setText("");
      setImage(null);
    }
  };
  return (
    <div className="input">
      {!isValid ? (
        <input
          type="text"
          placeholder="Type Something"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      ) : (
        <span></span>
      )}

      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
