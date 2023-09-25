// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, Navigate, Redirect } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const AuthGuard = ({ route, element }) => {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const { currentUser } = useContext(AuthContext);
//   console.log(currentUser, "curre");
// //   useEffect(() => {
// //     // Check if the user is authenticated
// //     if (currentUser?.uid) {
// //      return element
// //     } else {
// //       if (route == "login") {
// //         return element
// //       }
// //       return <Navigate to="/login" />
// //     }
// //   }, [currentUser]);

// //   if (!isAuthenticated) {
// //     console.log("3");
// //     // User is authenticated, render the protected routes or components
// //     return <Navigate to="/login" />
// // } else {
// //       return element;
// //   }
// };

// export default AuthGuard;
