import React from "react";
import "../style.scss";
import addAvatar from "../image/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { useState } from "react";

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

// firebase storage
import {
  // getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// for the naviagte hooks
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  // create a error state
  const [error, setError] = useState(false);

  // upload image details
  const [uploadbar, setUploadBar] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  // same email and display name error
  const [registerError, setRegisterError] = useState(false);
  // now we use the naviagte hooks
  const navigate = useNavigate();

  // create a function to handle the submit
  const handelSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    console.log(displayName, " ", email, " ", password, " ", file);

    // Check if email or displayName is already registered
    const emailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const displayNameQuery = query(
      collection(db, "users"),
      where("displayName", "==", displayName)
    );

    const [emailSnapshot, displayNameSnapshot] = await Promise.all([
      getDocs(emailQuery),
      getDocs(displayNameQuery),
    ]);

    if (!emailSnapshot.empty && !displayNameSnapshot.empty) {
      setRegisterError(true);
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // upload img to firebase storage

      // const storage = getStorage();

      // here we use the display name as the name of the file like displayname.jpg
      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadBar(true);
          setUploadProgress(Math.floor(progress)); // Update the upload progress state
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;

            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          setError(true);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);

            // here we update the profile with the display name and the photo url that we get from the storage
            await updateProfile(response.user, {
              displayName,
              photoURL: downloadURL,
            });

            // add the user to the firestore database
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: response.user.photoURL,
            });

            // create a new collection for the user chat
            await setDoc(doc(db, "userChat", response.user.uid), {});

            // navigate to the home page
            navigate("/");
          });
        }
      );
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Private Chat</span>
        <span className="title">Register</span>
        <form action="" onSubmit={handelSubmit}>
          <input type="text" placeholder="user name" required/>
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="password" />
          <input hidden type="file" id="file" accept=".jpg , .jpeg , .png"  />
          <label htmlFor="file">
            <img src={addAvatar}  alt="" />
            <span>Add an avatar</span>
          </label>
          {uploadbar && (
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {uploadProgress}%
              </div>
            </div>
          )}
          <button>Sign Up</button>
          {/* set the error handling */}
          {registerError && (
            <span className="errorMessage" style={{ fontSize: "0.89rem" }}>
              Email or display name is already registered
            </span>
          )}
          {error && <span className="errorMessage">Something went wrong</span>}
        </form>
        <p style={{fontSize: '0.9rem'}}>
          Already have an account?  <Link to="/login"><span style={{color: "blue", letterSpacing:'1.2px'}}>Login</span></Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
