import React, { useContext, useEffect, useState } from "react";
import "../pages/styles.css";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  // const handleSearch = async () => {
  //   let friendList = [];
  //   const q = query(
  //     collection(db, "users"),
  //     where("displayName", "==", username)
  //   );
  //   try {
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       const userData = doc.data();
  //       setUser(doc.data());
  //     });
  //   } catch (error) {
  //     setError(true);
  //     //console.log(error, "error");
  //   }
  // };
  //   const handleSearch = async () => {
  //     const q = query(collection(db, "users"));
  //     try {
  //       const querySnapshot = await getDocs(q);
  //       const allUsers = [];
  //       let friendList = [];
  //       const response = await getDoc(doc(db, "users", currentUser.uid));

  //       //console.log("response---", response.data());
  //       if(response?.data()?.friendList){

  //          friendList = [currentUser.uid, ...response?.data()?.friendList];
  //       }

  //       querySnapshot.forEach((doc) => {
  //         const userData = doc.data();
  //         setUser(doc.data())
  //         if (
  //           userData.uid !== currentUser.uid &&
  //           friendList.includes(userData.uid)
  //         ) {
  //           allUsers.push(userData);
  //         }
  //       });

  //       // The allUsers array now contains usernames not in friendList
  //       //console.log(allUsers, "list");
  //       // Filter users based on the search term using regex
  //       const regex = new RegExp(searchTerm, "i"); // "i" for case-insensitive search
  //       const matchingUsers = allUsers.filter((user) =>
  //         regex.test(user.displayName)
  //       );

  //       //console.log("response ----", matchingUsers);
  //       setUsers(matchingUsers); // Update the state with found users
  //       setError(false)
  //     } catch (error) {
  //       setError(true);
  //       //console.log(error, "error");
  //     }
  //   };
  // useEffect(()=>{
  //   handleSearch()
  // },[user,searchTerm])

  // const handleSelect = async () => {
  //   //check whether the group (chats in firestore) exists or not in firestore
  //   const combinedId =
  //     currentUser.uid > user.id
  //       ? currentUser.uid + user.uid
  //       : user.uid + currentUser.uid;
  //   try {
  //     //console.log(combinedId, "check combinedid");
  //     const response = await getDoc(doc(db, "chats", combinedId));
  //     if (!response.exists() ) {
  //       //create a chat in chats collection
  //       await setDoc(doc(db, "chats", combinedId), { messages: [] });
  //       //create user chats
  //       //console.log("currentuser id in search",currentUser.uid);
  //       await updateDoc(doc(db, "userChats", currentUser.uid), {
  //         [combinedId + ".userInfo"]: {
  //           uid: user.uid,
  //           displayName: user.displayName,
  //           photoURL: user.photoURL,
  //         },
  //         [combinedId + ".date"]: serverTimestamp(),
  //       });
  //       //console.log("users id in search",user.uid)
  //       await updateDoc(doc(db, "userChats", user.uid), {
  //         [combinedId + ".userInfo"]: {
  //           uid: currentUser.uid,
  //           displayName: currentUser.displayName,
  //           photoURL: currentUser.photoURL,
  //         },
  //         [combinedId + ".date"]: serverTimestamp(),
  //       });
  //     }
  //   } catch (error) {
  //     setError(false);
  //   }
  //   setUser(null);
  // };
  return (
    <div className="search">
      {error && <span>User not Found</span>}
      {user && (
        <div className="userchat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
