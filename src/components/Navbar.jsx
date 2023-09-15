import React, { useContext } from "react";
import "../pages/styles.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, profile, setProfile } = useContext(AuthContext);
  // console.log(currentUser, "currentuser");
  // console.log(currentUser.photoURL, "currentuser");
  // console.log(currentUser.displayName, "currentuser");
  const navigate = useNavigate();
  const profiles = () => {
    // navigate('/profile')
    setProfile(true);
  };
  // console.log("profile", profile);
  const logout = () => {
    signOut(auth);
    navigate("/login");
  };
  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <div className="user">
        <img
          onClick={() => profiles()}
          style={{ cursor: "pointer" }}
          src={currentUser.photoURL}
          alt=""
        ></img>
        <span style={{ color: "white" }}>{currentUser.displayName}</span>
        <button
          className="button"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
