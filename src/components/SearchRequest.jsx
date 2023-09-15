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

const Search = () => {
  const [username, setUsername] = useState("");
  const [pending, setPending] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
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
  const handleSearch = async () => {
    const q = query(collection(db, "users"));
    try {
      const querySnapshot = await getDocs(q);
      const allUsers = [];
      const response = await getDoc(doc(db, "users", currentUser.uid));


      const friendList = [currentUser.uid, ...response.data().friendList];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
      
        // Check if the user is not the current user and is not in the friendList
        if (userData.uid !== currentUser.uid && !friendList.includes(userData.uid)) {
          allUsers.push(userData);
        }
      });

      // The allUsers array now contains usernames not in friendList
      console.log(allUsers, "list");
      // Filter users based on the search term using regex
      const regex = new RegExp(searchTerm, "i"); // "i" for case-insensitive search
      const matchingUsers = allUsers.filter((user) =>
        regex.test(user.displayName)
      );

      console.log("response ----", matchingUsers);
      setUsers(matchingUsers); // Update the state with found users
    } catch (error) {
      setError(true);
      console.log(error, "error");
    }
  };

  //   const handleKey = (e) => {
  //     if (e.code === "Enter" || e.keyCode === 13) {
  //       handleSearch();
  //     }
  //   };
  useEffect(() => {
    handleSearch();
  }, [username]);
  const handleSelect = async (user) => {
    // Your existing logic for selecting and creating chats
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a friend"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button className={"button"} onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <span>User not Found</span>}
      <div className="userListContainer">
        <div className="userList">
          {users.map((user) => (
            <div
              key={user.uid}
              className="userchat"
              onClick={() => handleSelect(user)}
            >
              <img src={user.photoURL} alt="" />
                <span style={{ color: "black" }}>{user.displayName}</span>
              <div className="userChatInfo ">
                <Button
                // className="button"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
