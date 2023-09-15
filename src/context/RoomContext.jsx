import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const RoomContext = createContext();

export const RoomContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    RoomId: "null",
    room: {},
  };

  const RoomReducer = (state, action) => {
    console.log("action payload", action.payload);
    switch (action.type) {
      case "CHANGE_ROOM":
        return {
          room: action.payload,
          RoomId: action.payload.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(RoomReducer, INITIAL_STATE);

  return (
    <RoomContext.Provider value={{ data: state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};
