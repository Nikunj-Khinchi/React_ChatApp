import React, { useContext,  useState } from "react";
import imgS from "../image/imgS.png";
// use the firebase search query
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
// import { getDownloadURL, getStorage, ref } from "firebase/storage";

const Search = () => {
  // searh user
  const [username, setUsername] = useState("");
  // actual user
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  // in this we need to get the current user details from the context
  const { currentUser } = useContext(AuthContext);

  const searchUser = async () => {
    const search = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(search);
      // if there is a user and get the user data
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setUser(doc.data());
   
      });
      // if there is no user
      if(querySnapshot.size === 0){
        setError(true);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const handelkey = (e) => {
    setError(false);
    setUser();
    e.code === "Enter" && searchUser();
  };

  // console.log("print userrrrrrrrrr" , user);

  const handelSelect = async () => {
    // check whether the group(chats in firestore) is already exist or not, if not then create a new group

    // create a one combineid for both users
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      // create user chats
      const res = await getDoc(doc(db, "chats", combinedId));
      // check whether the chats is already exist or not if its not create one
      if(!res.exists()){
        // create a new chats collection
       await setDoc(doc(db, "chats", combinedId), { messages: [] });
   
        // now create a user chats

        // these our structure of user chats
        // userChats: {
        //   janesId:{
        //     combinedId:{
        //       userInfo{
        //         displayName , img , id 
        //       },
        //       lastMessage:"",
        //       date:""
        //     }
        //   }
        // }
        
        await updateDoc(doc(db, "userChat", currentUser.uid), { 
          // document contains nested objects, you can use "dot notation" to reference nested fields within the document for update operations.
            [combinedId+".userInfo"]:{
              uid:user.uid,
              displayName:user.displayName,
              photoURL:user.photoURL,
            },
            [combinedId+".date"]: serverTimestamp(),
        });


        // user chats for the other user

        await updateDoc(doc(db, "userChat", user.uid), { 
          [combinedId+".userInfo"]:{
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL,
          },
          [combinedId+".date"]: serverTimestamp(),
      });


      }
    

    } catch (error) {

    }

    setUser(null);
    setUsername("");
  };

  const handelSubmit = (e) => { 
    e.preventDefault();
   return searchUser();
  }

  // const [image, setImage] = useState(null);

  // useEffect(() => {
  //   const fetchImageURL = async () => {
  //     if (user && user.displayName) {
  //       try {
  //         const storage = getStorage();
  //         const starsRef = ref(storage, `${user.displayName}`);
  //         const url = await getDownloadURL(starsRef);
  //         setImage(url);
  //       } catch (error) {
  //         console.error("Error fetching image URL:", error);
  //       }
  //     }
  //   };
  //   fetchImageURL();
  // }, [user]);


  return (
    <div className="search">
      <form className="searchForm" onSubmit={handelSubmit}>
        {/* handelkey down for when we enter we're going to search for a user and if there is user we're going to set this setuser hook */}
        <div className="searchField">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handelkey}
          onChange={(e) => setUsername(e.target.value)
          }
          value={username}
        /> <br /><br />
        {/* <button>
        <img src={Slogo} width={18} alt="" />
        </button> */}
       <input type="submit" id="Ssearch" hidden/>
       <label htmlFor="Ssearch">
       <img src={imgS}  width={25} style={{}} alt="" />
       </label>
        </div>
       
      </form>
      {error && <span className="searchError">User not found!</span>}
      {/* if there is user we gonna return this  */}

      {/* when we click on the user we're going to add this user inside userchats also we're going to create here chats collection and its going to include all chats messages b/w two users */}
      {user  && (
        <div className="userChat" onClick={handelSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
