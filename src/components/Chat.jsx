import React, { useContext, useEffect, useState } from "react";
import "../pages/styles.css";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayRemove, arrayUnion, deleteField, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Message from "../img/Message1.png";
import Swal from "sweetalert2";


const Chat = () => {
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [pending, setPending] = useState(false);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const { currentUser, profile,setUnfriending,unfriending } = useContext(AuthContext);
  //console.log(currentUser, "current");
  const { data } = useContext(ChatContext);
  //console.log("daata", data);
  useEffect(() => {
    if (currentUser.uid) {
      //console.log(currentUser.uid, "userffffffffff");
      const unsub = onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
        //console.log(doc, "doc");
        if (doc.data().pendingFriends) {
          setPendingFriends(doc.data().pendingFriends);
        }
        if (doc.data().friendList) {
          setFriendList(doc.data().friendList);
        }
      });
      return () => {
        unsub();
      };
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser.uid) {
      const unsub = onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
        if (doc.data().sentFriendRequests) {
          setSentFriendRequests(doc.data().sentFriendRequests);
        }
      });
      return () => {
        unsub();
      };
    }
  }, [currentUser]);
  // const handleAddFriend = async (id) => {
  //   //console.log(id, "id");
  //   setPending(true);
  //   await updateDoc(doc(db, "users", id), {
  //     pendingFriends: arrayUnion(currentUser.uid),
  //   });
  //   await updateDoc(doc(db, "users", currentUser.uid), {
  //     sentFriendRequests: arrayUnion(id),
  //   });
  // };
  // //console.log(pendingFriends, "pending friends");
  // //console.log(sentFriendRequests, "friend req");
  // //console.log(data.user.uid, "friend user");

  // const handleAcceptFriend = async (id) => {
  //   await updateDoc(doc(db, "users", currentUser.uid), {
  //     friendList: arrayUnion(id),
  //   });

  //   await updateDoc(doc(db, "users", id), {
  //     friendList: arrayUnion(currentUser.uid),
  //   });
  //   await updateDoc(doc(db, "users", currentUser.uid), {
  //     pendingFriends: pendingFriends.filter(
  //       (friendId) => friendId != id && friendId != currentUser.uid
  //     ),
  //   });
  //   await updateDoc(doc(db, "users", currentUser.uid), {
  //     sentFriendRequests: sentFriendRequests.filter(
  //       (friendId) => friendId != currentUser.uid
  //     ),
  //   });
  //   await updateDoc(doc(db, "users", id), {
  //     sentFriendRequests: sentFriendRequests.filter(
  //       (friendId) => friendId != currentUser.uid
  //     ),
  //   });
  //   setPending(false);
  // };

  // const handleDeclineFriend = async (id) => {
  //   await updateDoc(doc(db, "users", id), {
  //     pendingFriends: pendingFriends.filter(
  //       (friendId) => friendId != id && friendId != currentUser.uid
  //     ),
  //   });
  //   await updateDoc(doc(db, "users", currentUser.uid), {
  //     pendingFriends: pendingFriends.filter(
  //       (friendId) => friendId != id && friendId != currentUser.uid
  //     ),
  //   });
  //   await updateDoc(doc(db, "users", id), {
  //     sentFriendRequests: sentFriendRequests.filter(
  //       (friendId) => friendId != id && friendId != currentUser.uid
  //     ),
  //   });
  // };
  const handleUnfriend = async (friendUid) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateDoc(doc(db, "users", currentUser.uid), {
            friendList: arrayRemove(friendUid),
          });
          await updateDoc(doc(db, "users", friendUid), {
            friendList: arrayRemove(currentUser.uid),
          });
          // await updateDoc(doc(db, "chats", combinedId), {
          //   [combinedId]: deleteField(),
          // });
          setUnfriending(true)
        }
      });
    } catch (error) {
      console.error("Error unfriending user:", error);
    }
  };
  return (
    <div className="chat">
      {
         !unfriending ? (
      !profile ? (
        data.chatId !== "null" ? (
          <>
            <div className="chatInfo">
              <span style={{ color: "white" }}>{data.user?.displayName}</span>
              <button
                onClick={() => handleUnfriend(data.user.uid)}
                className="buttonUnfriend"
                style={{ marginLeft: "auto" }}
              >
                Unfriend
              </button>
            </div>
            <Messages />
            <Input />
          </>
        ) : (
          <div className="chatMessage">
            <img src={Message} alt="" />

            <h1>Welcome,{currentUser.displayName}</h1>
            <p>Chat. Connect. Chatify.</p>
          </div>
        )
      ) : (
        <div className="chatMessage">
          <img src={Message} alt="" />

          <h1>Welcome,{currentUser.displayName}</h1>
          <p>Chat. Connect. Chatify.</p>
        </div>
      )
       ) 
      : (
        <div className="chatMessage">
          <img src={Message} alt="" />

          <h1>Welcome,{currentUser.displayName}</h1>
          <p>Chat. Connect. Chatify.</p>
        </div>
      )
      }
    </div>
  );
};

export default Chat;
