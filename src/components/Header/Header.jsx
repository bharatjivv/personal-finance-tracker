/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from '../../assets/userImg.svg';

const Header = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  function logoutFn() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged out successfully");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  // console.log('userdefined check', user);

  return (
    <div className="navbar">
      <p className="logo">Financely.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            style={{ borderRadius: "50%", height: "2rem", width:"2rem", border:"2px solid white" }}
          />
          <p className="logo link" onClick={logoutFn}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
