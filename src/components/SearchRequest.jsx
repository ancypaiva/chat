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

const SearchRequest = () => {
  const [username, setUsername] = useState("");
  const [pending, setPending] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  //console.log(data, "dta");
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
  const handleSearch = async () => {
    const q = query(collection(db, "users"));
    try {
      const querySnapshot = await getDocs(q);
      const allUsers = [];
      let friendList = [];
      const response = await getDoc(doc(db, "users", currentUser.uid));

      //console.log("response---", response.data());
      if (response?.data()?.friendList) {
        friendList = [currentUser.uid, ...response?.data()?.friendList];
      }

      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        if (
          userData.uid !== currentUser.uid &&
          !friendList.includes(userData.uid)
        ) {
          allUsers.push(userData);
        }
      });

      //console.log("response ----", matchingUsers);
      setUsers(allUsers); // Update the state with found users
    } catch (error) {
      setError(true);
      //console.log(error, "error");
    }
  };

  const filteredUsers = users.filter((user) =>
  user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
);
  useEffect(() => {
    handleSearch();
  }, [username, pending]);
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
      </div>
      {/* {error && <span>User not Found</span>} */}
      <div>
        <div className="userList">
          <div
            className="userListContainer"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {filteredUsers.map((user) => (
              <div
                key={user.uid}
                className="userchat"
                onClick={() => handleSelect(user)}
              >
                <img src={user.photoURL} alt="" />
                <span style={{ color: "black" }}>{user.displayName}</span>
                <div className="userChatInfo ">
                  <Button
                    style={{ backgroundColor: "#4e28a1" }}
                    onClick={() => handleAddFriend(user.uid)}
                    disabled={user?.pendingFriends?.includes(currentUser.uid)}
                  >
                    {user?.pendingFriends?.includes(currentUser.uid) ? (
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
    </div>
  );
};

export default SearchRequest;
