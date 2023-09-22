import {
  arrayRemove,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Swal from "sweetalert2";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { currentUser, pendingFriendCount,unfriending } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        //console.log(doc.data(), "dsfg");
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid, pendingFriendCount]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getDoc(doc(db, "users", currentUser.uid));
        //console.log(response, "ereer");
        const friendList = response?.data()?.friendList || [];

        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const allUsers = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          // Check if the user is not the current user and is in the friendList
          if (
            userData.uid !== currentUser.uid &&
            friendList.includes(userData.uid)
          ) {
            allUsers.push(userData);
          }
        });

        setUsers(allUsers);
      } catch (error) {
        console.error(error);
      }
    };

    currentUser.uid && fetchUsers();
  }, [currentUser.uid, pendingFriendCount,unfriending]);

  // Filter users based on searchTerm
  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSelect = (user) => {
      dispatch({ type: "CHANGE_USER", payload: user });
      setSearchTerm("");
      console.log(user.photoURL,'photo');
  };
  return (
    <div className="chats">
      <div className="search">
        <div className="searchForm">
          <input
            type="text"
            placeholder="Find a friend"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="userList">
        {filteredUsers.length === 0 ? (
          <p style={{ color: "white" }}>No records found</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="userchat"
              onClick={() => handleSelect(user)}
            >
              <img src={user.photoURL} alt="" />
              <span style={{ color: "white" }}>{user.displayName}</span>
              <span style={{ color: "black" }}>{user.lastMessage}</span>
              {/* <button
                onClick={() => handleUnfriend(user.uid)}
                className="button"
                style={{ marginLeft: "auto" }}
              >
                Unfriend
              </button> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chats;
