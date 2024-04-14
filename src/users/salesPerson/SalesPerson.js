import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate, Outlet} from "react-router-dom";

import {auth, db, logout} from "../../config/firebase";
import {
  query,
  collection,
  getDocs,
  where,
  getCountFromServer,
} from "firebase/firestore";
import Navbar from "./components/Navbar";
function SalesPerson() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const salesRef = collection(db, "salesPerson");

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    const validate = async () => {
      let q = query(salesRef, where("email", "==", auth.currentUser.email));
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
    <div className="dashboard bg-white-600">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default SalesPerson;
