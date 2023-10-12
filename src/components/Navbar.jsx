import React, { useContext, useState, useEffect } from "react";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { getDownloadURL, getStorage, ref } from "firebase/storage";


const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImageURL = async () => {
      if (currentUser && currentUser.displayName) {
        try {
          const storage = getStorage();
          const starsRef = ref(storage, `${currentUser.displayName}`);
          const url = await getDownloadURL(starsRef);
          setImage(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };
    fetchImageURL();
  }, [currentUser]);

  const handelLogout = () => {
    localStorage.removeItem("currentUser");
    clearTimeout(localStorage.getItem("autoLogoutTimeout"));
    signOut(auth);
  };

//  if the user dont have the image then we will show the first letter of the user name
const displayName = currentUser?.displayName;
const upperCaseName = displayName?.toUpperCase();
const firstLetter = upperCaseName?.charAt(0);
   
  return (
    <div className="navbar">
      <span className="logo">Pvt. Chat</span>
      <div className="user">
        <div className="details" >
          {image ? <img src={image} alt=""  /> : <div className="letter">{firstLetter}</div>}
          <span>{currentUser?.displayName}</span>
        </div>
        <button onClick={handelLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
