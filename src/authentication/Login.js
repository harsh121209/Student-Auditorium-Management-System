import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
  db,
} from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import {
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [userTyp, setUserTyp] = useState("");
  const adminRef = collection(db, "admin");
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user && userTyp !== "") navigate(`/${userTyp}`);
    const func = async () => {
      if (user) {
        let email = auth?.currentUser?.email;
        let q = query(adminRef, where("email", "==", email));
        let snap = await getCountFromServer(q);
        if (snap.data().count == 0) {
          return;
        }
        navigate(`/admin`);
      }
    };
    func();
  }, [user, loading, userTyp]);

  const login = async (email, password) => {
    await logInWithEmailAndPassword(email, password)
      .then((val) => {
        setUserTyp(val);
        console.log(val, "Line 31");
      })
      .catch((err) => {
        console.log(err.message);
        alert(err.message);
      });
  };

  return (
    <div className="login p-4 bg-gray-950">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button
          className="login__btn login__admin"
          onClick={() => login(email, password)}
        >
          Login
        </button>

        <div className="text-white">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-white _register_btn hover:text-blue-800 visited:text-purple-600"
          >
            Register
          </Link>{" "}
          now.
        </div>
      </div>
    </div>
  );
}

export default Login;
