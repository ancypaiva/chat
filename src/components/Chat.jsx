import React, { useContext, useEffect, useState } from "react";
import "../pages/styles.css";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Message from "../img/Message1.png";


const Chat = () => {
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [pending, setPending] = useState(false);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const { currentUser ,profile} = useContext(AuthContext);
  console.log(currentUser, "current");
  const { data } = useContext(ChatContext);
  console.log("daata", data);
  useEffect(() => {
    if (currentUser.uid) {
      console.log(currentUser.uid, "userffffffffff");
      const unsub = onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
        console.log(doc, "doc");
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
  const handleAddFriend = async (id) => {
    console.log(id, "id");
    setPending(true);
    await updateDoc(doc(db, "users", id), {
      pendingFriends: arrayUnion(currentUser.uid),
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      sentFriendRequests: arrayUnion(id),
    });
  };
  console.log(pendingFriends, "pending friends");
  console.log(sentFriendRequests, "friend req");
  console.log(data.user.uid, "friend user");

  const handleAcceptFriend = async (id) => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      friendList: arrayUnion(id),
    });

    await updateDoc(doc(db, "users", id), {
      friendList: arrayUnion(currentUser.uid),
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      pendingFriends: pendingFriends.filter(
        (friendId) => friendId != id && friendId != currentUser.uid
      ),
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      sentFriendRequests: sentFriendRequests.filter(
        (friendId) => friendId != currentUser.uid
      ),
    });
    await updateDoc(doc(db, "users", id), {
      sentFriendRequests: sentFriendRequests.filter(
        (friendId) => friendId != currentUser.uid
      ),
    });
    setPending(false);
  };

  const handleDeclineFriend = async (id) => {
    await updateDoc(doc(db, "users", id), {
      pendingFriends: pendingFriends.filter(
        (friendId) => friendId != id && friendId != currentUser.uid
      ),
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      pendingFriends: pendingFriends.filter(
        (friendId) => friendId != id && friendId != currentUser.uid
      ),
    });
    await updateDoc(doc(db, "users", id), {
      sentFriendRequests: sentFriendRequests.filter(
        (friendId) => friendId != id && friendId != currentUser.uid
      ),
    });
  };
  console.log("profile----", profile);
  return (
    <div className="chat">
     {!profile ?  (data.chatId !== "null"  ? (
        <>
          <div className="chatInfo">
            <span style={{ color: "white" }}>{data.user?.displayName}</span>
            {sentFriendRequests &&
            sentFriendRequests.includes(data.user.uid) ? (
              <Button
                onClick={() => handleAddFriend(data.user.uid)}
                disabled={true}
              >
                Pending
              </Button>
            ) : (
              <div>
                {pendingFriends && pendingFriends.includes(data.user.uid) ? (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Button
                      style={{ marginRight: 20 }}
                      onClick={() => handleAcceptFriend(data.user.uid)}
                    >
                      <FontAwesomeIcon
                        style={{ fontSize: 16 }}
                        icon={faCheck}
                      />
                    </Button>
                    <Button onClick={() => handleDeclineFriend(data.user.uid)}>
                      <FontAwesomeIcon
                        style={{ fontSize: 20 }}
                        icon={faTimes}
                      />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => handleAddFriend(data.user.uid)}
                      disabled={pending}
                    >
                      {pending ? (
                        "Pending"
                      ) : friendList.includes(data.user.uid) ? (
                        "friends"
                      ) : (
                        <FontAwesomeIcon icon={faUserPlus} />
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        <div className="chatMessage">
          
            <img src={Message} alt=""/>
          
          
          <h1>Welcome,{currentUser.displayName}</h1>
          <p>Chat. Connect. Chatify.</p>
         
        </div>
      )) : (
        <div className="chatMessage">
          
            <img src={Message} alt=""/>
          
          
          <h1>Welcome,{currentUser.displayName}</h1>
          <p>Chat. Connect. Chatify.</p>
         
        </div>
      ) }
    </div>
  );
};

export default Chat;
