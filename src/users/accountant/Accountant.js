import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate, Outlet} from "react-router-dom";
import firebase from "firebase/app";
import {auth, db, logout} from "../../config/firebase";
import {
  query,
  collection,
  getDocs,
  where,
  getCountFromServer,
} from "firebase/firestore";
import Navbar from "./components/Navbar";
import './Accountant.css';
function Accountant() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const accountRef = collection(db, "accountant");

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    const validate = async () => {
      let q = query(accountRef, where("email", "==", auth.currentUser.email));
      let snapShot = await getCountFromServer(q);
      if (snapShot.data().count == 0) {
        return navigate("/");
      }
    };
    if (user) {
      validate();
    }
  }, [user, loading]);

  return (
    <div className="dashboardAccountant">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default Accountant;
