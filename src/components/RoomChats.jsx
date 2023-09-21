import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { RoomContext } from "../context/RoomContext";

const RoomChats = () => {
  const [room, setRoom] = useState([]);
  const [error, setError] = useState(false);
  const { dispatch } = useContext(RoomContext);
  const { data } = useContext(RoomContext);
  const getAllRooms = async () => {
    const q = query(collection(db, "rooms"));
    try {
      const querySnapshot = await getDocs(q);
      const roomsArray = [];
      querySnapshot.forEach((doc) => {
        roomsArray.push(doc.data());
      });
      //console.log("room array", roomsArray);
      setRoom(roomsArray);
    } catch (error) {
      setError(true);
      //console.log(error, "error");
    }
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  //console.log("room--------", room);
  const handleSelect = async (u) => {
    dispatch({ type: "CHANGE_ROOM", payload: u });
    const RoomId = data.RoomId;
    //console.log(RoomId, "roomId");
    try {
      //console.log(RoomId, "check combinedid");
      const response = await getDoc(doc(db, "chats", RoomId));
      if (!response.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", RoomId), { messages: [] });
        //create user chats
        //console.log("currentuser id in search", currentUser.uid);
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [RoomId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [RoomId + ".date"]: serverTimestamp(),
        });
        //console.log("users id in search", user.uid);
        await updateDoc(doc(db, "userChats", user.uid), {
          [RoomId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [RoomId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      setError(false);
    }
  };
  return (
    <div className="">
      {room.map((rooms) => (
        <div
          className="userchat"
          key={rooms[0]}
          onClick={() => handleSelect(rooms)}
        >
          <img src={rooms.photoURL} alt="" />
          <ul style={{ listStyle: "none" }}>
            {" "}
            <li style={{ color: "white" }}>{rooms.room_name}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RoomChats;
