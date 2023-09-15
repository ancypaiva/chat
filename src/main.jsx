import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ChatContextProvider } from './context/ChatContext.jsx';
import { RoomContextProvider } from './context/RoomContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
<AuthContextProvider>
<ChatContextProvider>
  <RoomContextProvider>
  <React.StrictMode>
    <App/>

  </React.StrictMode>
  </RoomContextProvider>
</ChatContextProvider>
</AuthContextProvider>
)
