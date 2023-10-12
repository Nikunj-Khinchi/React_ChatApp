import React, { useState } from "react";
import "../style.scss";
import { useNavigate , Link } from "react-router-dom";
// signin using firebase auth
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [error, setError] = useState(false);

  // now we use the naviagte hooks
  const navigate = useNavigate();

  // create a function to handle the submit
  const handelSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email, " ", password);
    try {

    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          navigate("/");
        })
        .catch((error) => {
          setError(true);
        });
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">React Chat</span>
        <span className="title">Login</span>
        <form action="" onSubmit={handelSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
        {error && <span className="errorMessage">Invalid email and password</span>}
          <button>Sign In</button>
        </form>
        <p style={{fontSize: '0.9rem'}}>
        Need an account?  <Link to="/register"><span style={{color: "blue" , letterSpacing:'1.2px' } }>Register</span></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
