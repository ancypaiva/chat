import React, { useContext, useEffect, useState } from "react";
import "../pages/styles.css";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Modal } from "react-bootstrap";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { updateEmail, updateProfile } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import SearchRequest from "./SearchRequest";

const Sidebar = () => {
  const { currentUser, profile, setProfile, updateCurrentUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [error, setError] = useState(false);
  const { loading, setLoading } = useState(false);
  const [displayName, setDisplayName] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState(currentUser.email);
  const [selectedImage, setSelectedImage] = useState(null);
  //console.log(email, displayName);
  const handleClose = () => setShow(false);
  const handleCloseRequest = () => setShowRequest(false);
  const handleUpdate = async () => {
    // await updateEmail(auth.currentUser, email);
    const user = await updateDoc(doc(db, "users", currentUser.uid), {
      displayName: displayName,
      // email,
    });
    updateCurrentUser({...currentUser, displayName });
    setName(displayName);
    setDisplayName(displayName);
    setShow(false);
  };

  useEffect(()=>{
    const result = async()=>{

      const response = await getDoc(doc(db, "users", currentUser.uid));
      console.log(response.data(), 'res');
      const res = response.data();
      console.log(res, 'result');
      setName(response.data().displayName);
      setDisplayName(response.data().displayName);
    }
    result();
  },[name, currentUser.uid])
  const handleShow = () => setShow(true);
  const handleRequest = () => setShowRequest(true);
  const handleRoom = () => {
    navigate("/mainroom");
  };
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  console.log(name, 'displ');
  const handleImageUpload = async () => {
    console.log(selectedImage, 'select');
    if (selectedImage) {
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, selectedImage).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          console.log(downloadURL, 'downl img');
          try {
            //Update profile
            await updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            });
            await updateDoc(doc(db,'users',currentUser.uid),{
              photoURL: downloadURL,
            });
            setSelectedImage(null);
          } catch (error) {
            //console.log(error);
            setError(true);
          }
        });
      });
    }
  };

  //console.log(profile, "profile in sidebar");
  //console.log(selectedImage, "image");
  return (
    <div className="sidebar">
      {profile ? (
        <>
          {" "}
          <div className="profile">
            <div className="navbar">
              <button
                style={{
                  display: "block",
                  backgroundColor: "#4e28a1",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0 5px",
                  color: "white",
                }}
                onClick={(e) => setProfile(false)}
              >
                back
              </button>
              <h2 style={{ color: "white" }}>Profile</h2>
            </div>
            <div style={{ color: "white", padding: "30px" }}>
              <div style={{ position: "relative" }}>
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Image"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      margin: "0 auto",
                      marginBottom: "15px",
                      display: "block",
                    }}
                  />
                ) : (
                  <img
                    style={{
                      cursor: "pointer",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      margin: "0 auto",
                      marginBottom: "15px",
                      display: "block",
                    }}
                    src={currentUser.photoURL}
                    alt=""
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: "50px",
                    background: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
              {selectedImage && (
                <button onClick={handleImageUpload} className="button">
                  Upload Image
                </button>
              )}
              <p style={{ color: "#e1d3ff" }}>Your name</p>
              <h3>{name}</h3>
              <p style={{ color: "#e1d3ff" }}>Your email</p>
              <h6>{currentUser.email}</h6>
              <Button
                className="button"
                onClick={handleShow}
                style={{ marginTop: "2rem" }}
              >
                Edit Profile
              </Button>
            </div>
          </div>{" "}
        </>
      ) : (
        <>
          <Navbar />
          <Search />
          <Chats />
          <div className="sidebar-footer">
            <div
              className="fauser"
              onClick={handleRequest}
            >
              <FontAwesomeIcon icon={faUserFriends} />
            </div>
            <button
              style={{
                width: "100%",
                backgroundColor: "#4e28a1",
                color: "white",
                padding: "10px 0",
              }}
              onClick={handleRoom}
            >
              Public Rooms
            </button>
          </div>
        </>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setDisplayName(e.target.value);
                }}
                placeholder="name"
                value={displayName}
                autoFocus
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                placeholder="email"
                autoFocus
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRequest} onHide={handleCloseRequest}>
        <Modal.Header closeButton>
          <Modal.Title>Find Friends</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <SearchRequest />
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Sidebar;
