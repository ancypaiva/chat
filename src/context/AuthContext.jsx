import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [profile, setProfile] = useState(false);
  const [pendingFriendCount, setPendingFriendCount] = useState(false);
  const [unfriending, setUnfriending] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      //console.log("user in context",user);
    });

    return () => {
      unsub();
    };
  }, []);

  const updateCurrentUser = (data) => {
    setCurrentUser({
      ...currentUser,
      ...data,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        setProfile,
        updateCurrentUser,
        pendingFriendCount,
        setPendingFriendCount,unfriending, setUnfriending
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
