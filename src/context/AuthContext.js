import { createContext, useEffect } from "react";
import { useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";


export const AuthContext = createContext();

// its like we represent the components that we are gonna wrap with this provider
export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

      // Function to handle automatic logout
      const handleAutoLogout = () => {
        // Clear localStorage and log out
        localStorage.removeItem('currentUser');
        signOut(auth);
    };
 
    // we check wheather we have user or not using firebase auth
    useEffect(() =>{
    // const unsub =  onAuthStateChanged(auth, (user) => {
    //     setCurrentUser(user);
    //     console.log(user);
        
        const unsub =  onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        // console.log(user);

         // Set a timeout for 3 (in milliseconds)
         const timeout = setTimeout(handleAutoLogout, 3 * 60 * 60 * 1000); //  hours
         // Save the timeout ID in localStorage
         localStorage.setItem('autoLogoutTimeout', timeout);


        });
        
        return () => {
            const timeout = localStorage.getItem('autoLogoutTimeout');
            clearTimeout(timeout); // Clear the timeout if the component unmounts
            unsub(); // Unsubscribe from onAuthStateChanged
        };

  
        
    },[]);


    // in this case the childern will be our application and we can send anything here value and we're gonna send the current user,  component that we wrap with this auth context provider will be able to reach the current user
    return(
    <AuthContext.Provider value={{currentUser}}>
        {children}
        </AuthContext.Provider>
    );
};
// in this we're creating a authentication provider and we are gonna create our user there and we will be able to use that user inside every component in our application