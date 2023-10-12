import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";


export const ChatContext = createContext();

// its like we represent the components that we are gonna wrap with this provider
export const ChatContextProvider = ({ children }) => {

  // current user info using context
  const { currentUser } = useContext(AuthContext);

  //   here we use the reducer we're gonna need this user info. and also the combined id to fetch this chats

  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
            default:
               return state;
    }
  };

  const [state, dispatch] = useReducer( chatReducer , INITIAL_STATE );

  return (
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// in this we're creating a authentication provider and we are gonna create our user there and we will be able to use that user inside every component in our application
