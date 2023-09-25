import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home ";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import MainRoom from "./components/MainRoom";
import MainPage from "./components/MainPage";
import Header from "./components/Header";
import Profile from "./components/Profile";

function App() {
  function ProtectedRoute({ children }) {
    const { currentUser } = useContext(AuthContext);
    if (!currentUser) {
      return <Navigate to="/login" />;
    
    }
    return children;
  }
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                  <MainPage />
              }
            />
            <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="mainroom" element={<MainRoom />} />
            <Route path="header" element={<Header />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
