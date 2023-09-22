import React, { useContext, useEffect, useState } from "react";
import "../pages/styles.css";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { Button } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const AcceptRequest = () => {
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [username, setUsername] = useState("");
  const [pendingFriends, setPendingFriends] = useState([]);
  const [pending, setPending] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const { currentUser, setPendingFriendCount,setCombinedUid } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  //console.log(data, "dta");
  useEffect(() => {
    if (currentUser.uid) {
      // //console.log(currentUser.uid, "userffffffffff");
      const unsub = onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
        // //console.log(doc, "doc");
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
    //console.log(id, "id");
    setPending(true);
    await updateDoc(doc(db, "users", id), {
      pendingFriends: arrayUnion(currentUser.uid),
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      sentFriendRequests: arrayUnion(id),
    });
    setPending(false);
  };

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
    setPendingFriendCount((prevCount) => prevCount + 1);
  };

  const handleSelect = async (user) => {
    //console.log("handleselect", user);
    const q = query(collection(db, "users"));
    try {
      const querySnapshot = await getDocs(q);
      const allUsers = [];
      let pendingFriends = [];
      const response = await getDoc(doc(db, "users", currentUser.uid));
      if (response?.data()?.pendingFriends) {
        pendingFriends = [currentUser.uid, ...response?.data()?.pendingFriends];
      }

      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        // Check if the user is not the current user and is not in the pendingFriends
        if (
          userData.uid !== currentUser.uid &&
          pendingFriends.includes(userData.uid)
        ) {
          allUsers.push(userData);
        }
      });

      // The allUsers array now contains usernames not in friendList
      //console.log(allUsers, "list");

      //console.log("response ----", allUsers);
      setUsers(allUsers); // Update the state with found users
    } catch (error) {
      setError(true);
      //console.log(error, "error");
    }
  };
  useEffect(() => {
    handleSelect();
  }, [username, pending]);
  //console.log("userssss-----", users);
  const handleChat = async (user) => {
    //console.log("handlechat", user);
    //check whether the group (chats in firestore) exists or not in firestore
    //console.log(user.uid, "useruid");
    //console.log(currentUser.uid, user.uid, "current & user");
    const combinedId =
      currentUser.uid > user.id
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
        setCombinedUid()
    try {
      console.log(combinedId, "check combinedid");
      const response = await getDoc(doc(db, "chats", combinedId));
      if (!response.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //create user chats
        console.log("currentuser id in search", currentUser.uid);
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("users id in search", user.uid);
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      setPendingFriendCount(true);
    } catch (error) {
      console.log(error,'errr');
      setError(false);
    }
  };
  return (
    <div className="search">
      {error && <span>User not Found</span>}
      <div className="userListContainer">
        <div className="userList">
          {users.map((user) => (
            <div
              key={user.uid}
              className="userchat"
              onClick={() => handleSelect(user) && handleChat(user)}
            >
              <img src={user.photoURL} alt="" />
              <span style={{ color: "black" }}>{user.displayName}</span>
              <div className="userChatInfo ">
                {pendingFriends && pendingFriends.includes(user.uid) ? (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Button
                      style={{ marginRight: 20, backgroundColor: "#4e28a1" }}
                      onClick={() => handleAcceptFriend(user.uid)}
                    >
                      <FontAwesomeIcon
                        style={{ fontSize: 16 }}
                        icon={faCheck}
                      />
                    </Button>
                    <Button
                      style={{ backgroundColor: "#4e28a1" }}
                      onClick={() => handleDeclineFriend(user.uid)}
                    >
                      <FontAwesomeIcon
                        style={{ fontSize: 20 }}
                        icon={faTimes}
                      />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      style={{ backgroundColor: "#4e28a1" }}
                      disabled={pending}
                    >
                      {pending ? (
                        "Pending"
                      ) : friendList.includes(user.uid) ? (
                        "friends"
                      ) : (
                        <div>Removed</div>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AcceptRequest;
