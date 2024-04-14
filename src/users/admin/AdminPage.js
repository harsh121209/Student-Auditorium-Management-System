import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Outlet } from "react-router-dom";
import firebase from "firebase/app";
import { auth, db, logout } from "../../config/firebase";
import {
  query,
  collection,
  getDocs,
  where,
  getCountFromServer,
} from "firebase/firestore";
import Navbar from "./components/Navbar";
import "./AdminPage.css";
function AdminPage() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const adminRef = collection(db, "admin");
  // const fetchUserName = async () => {
  //   try {
  //     const q = query(adminRef, where("uid", "==", user?.uid));
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();

  //     setName(data.username);
  //   } catch (err) {
  //     console.error(err);
  //     alert("An error occured while fetching user data Line admin");
  //   }
  // };

  useEffect(() => {
    if (loading) return;

    if (!user) {
      return navigate("/");
    }
    const validate = async () => {
      let q = query(adminRef, where("email", "==", auth.currentUser.email));
      let snapShot = await getCountFromServer(q);
      if (snapShot.data().count == 0) {
        return navigate("/");
      }
    };
    if (user) {
      validate();
    }
  }, [user, loading]);

  console.log(user, "Admin page line 33");
  return (
    <div className="dashboardAdmin">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default AdminPage;
