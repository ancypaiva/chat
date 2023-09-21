import React, { useContext, useEffect, useState } from "react";
import "../pages/styles.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Form, Modal } from "react-bootstrap";
import AcceptRequest from "./AcceptRequest";
import { doc, onSnapshot } from "firebase/firestore";

const Navbar = () => {
  const { currentUser, setProfile } = useContext(AuthContext);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [sentFriendRequests,setSentFriendRequests] = useState([])
  const [friendList,setFriendList] = useState([])
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser.uid) {
      //console.log(currentUser.uid, "userffffffffff");
      const unsub = onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
        //console.log(doc.data()?.pendingFriends,"coooooooo")
        setCount(doc.data()?.pendingFriends?.length);
        if (doc.data().pendingFriends) {
          //console.log("docyyyyyyyy-------", doc.data().pendingFriends);
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
  }, [currentUser, count]);
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
  const profiles = () => {
    setProfile(true);
  };
  const logout = () => {
    signOut(auth);
    navigate("/login");
  };
  const onAcceptButtonClick = () => {};
  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <button
        onClick={handleShow}
        style={{
          color: "white",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          marginRight: "-93px",
        }}
      >
        <FontAwesomeIcon icon={faUser} />
        <div className="count">{count ? count : "0"}</div>
      </button>
      <Dropdown>
        <Dropdown.Toggle
          id="dropdown-basic"
          style={{
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            color: "transparent",
            padding: "0px",
          }}
        >
          <img
            style={{ cursor: "pointer" }}
            src={currentUser.photoURL}
            alt=""
          ></img>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText style={{ fontWeight: "bold" }}>
            {currentUser.displayName}
          </Dropdown.ItemText>
          <Dropdown.Item onClick={() => profiles()}>Profile</Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Friend Requests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <AcceptRequest />
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Navbar;
