import React, { useState } from "react";
import "./styles.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    // Authenticate the user, or create a new account using email and password
    setLoading(true);
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
        // console.log(name, email, password);
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            // console.log("user >>> ", user);
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setEmail("");
            setpassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log("errorcode >>>", errorCode);
            // console.log("errorMsg >>>", errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Both Passwords do not match!");
        setLoading(false);
      }
    } else {
      toast.error("All Fields are mandatory!");
      setLoading(false);
    }
  }

  function loginWithEmail() {
    // console.log(email);
    // console.log(password);
    setLoading(true);

    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged in");
          // console.log("logged in user >>>", user);
          setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
          // console.log("couldnt sign in because of the error ", errorCode);
        });
    } else {
      toast.error("Enter Email and Password!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    // Make sure you only create a doc if the user's uid is not present already.
    // create a doc
    setLoading(true);

    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("doc created!");
        setLoading(false);
      } catch (error) {
        // console.log(error);
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {  
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          // console.log(token);
          const user = result.user;
          // console.log(user);
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          setLoading(false)
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.errror(errorMessage);
          // console.log(errorCode);
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // console.log(email, credential);
          setLoading(false);
          // ...
        });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <>
          <div className="signup-wrapper">
            <h2 className="title">
              Login on <span style={{ color: "var(--theme)" }}>Financely.</span>
            </h2>
            <form>
              <Input
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"jode@example.com"}
              />
              <Input
                type="password"
                label={"Password"}
                state={password}
                setState={setpassword}
                placeholder={"Example123"}
              />

              <Button
                disabled={loading}
                text={loading ? "Loading..." : "Login using Email and Password"}
                onClick={loginWithEmail}
              />
              <p className="or-text">OR</p>
              <Button
                text={loading ? "Loading..." : "Login using Google"}
                blue={true}
                disabled={loading}
                onClick={googleAuth}
              />
              <p className="form-text" onClick={() => setLoginForm(!loginForm)}>
                Don't Have an Account? SignUp Here.
              </p>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="signup-wrapper">
            <h2 className="title">
              Sign Up on{" "}
              <span style={{ color: "var(--theme)" }}>Financely.</span>
            </h2>
            <form>
              <Input
                label={"Full Name"}
                state={name}
                setState={setName}
                placeholder={"Join De."}
              />
              <Input
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"jode@example.com"}
              />
              <Input
                type="password"
                label={"Password"}
                state={password}
                setState={setpassword}
                placeholder={"Example123"}
              />
              <Input
                type="password"
                label={"confirmPassword"}
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder={"Example123"}
              />

              <Button
                disabled={loading}
                text={
                  loading ? "Loading..." : "Signup using Email and Password"
                }
                onClick={signupWithEmail}
              />
              <p className="or-text">OR</p>
              <Button
                text={loading ? "Loading..." : "Signup using Google"}
                blue={true}
                disabled={loading}
                onClick={googleAuth}
              />
              <p className="form-text" onClick={() => setLoginForm(!loginForm)}>
                Have an Account Already? Login Here.
              </p>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default SignUpSignIn;
