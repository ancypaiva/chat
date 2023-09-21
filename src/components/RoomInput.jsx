import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import { AuthContext } from "../context/AuthContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { RoomContext } from "../context/RoomContext";

const RoomInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  // const [error,setError] = useState(false)
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(RoomContext);
  //console.log("data----",data);
  const handleSend = async () => {
    if (image) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        (error) => {
          setError(true);
          //console.log(error, "error");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.RoomId), {
              messages: arrayUnion({
                id: uuid(),
                senderId: currentUser.uid,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            });
          });
        }
      );
    } else if (text !== "") {
      const text1 = text;
      setText("");
      //console.log("chat id in input", data.RoomId);
      await updateDoc(doc(db, "chats", data.RoomId), {
        messages: arrayUnion({
          id: uuid(),
          text: text1,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      //console.log();
      await updateDoc(doc(db, "rooms", currentUser.uid), {
        [data.RoomId + ".lastMessage"]: {
          text: text1,
        },
        [data.RoomId + ".date"]: serverTimestamp(),
      });
      //console.log(data, "doc");
      //console.log(data.room.uid, data.RoomId, text, "check");
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.RoomId + ".lastMessage"]: {
          text: text1,
        },
        [data.RoomId + ".date"]: serverTimestamp(),
      });
    }
    setText("");
    setImage(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

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

export default RoomInput;
