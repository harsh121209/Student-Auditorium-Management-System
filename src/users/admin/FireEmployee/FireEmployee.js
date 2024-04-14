import React from "react";
import "./FireEmployee.css";
import { useState, useEffect } from "react";
import {
  registerEmployee,
  auth,
  getObj,
  logInWithEmailAndPassword,
  delete_user,
} from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function FireEmployee() {
  const [employeeType, setEmployeeType] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
  }, [loading]);
  const handleDelete = async (e) => {
    e.preventDefault();
    let employeePassword;
    console.log("came to line 22 fire employee");
    let adminMail = auth?.currentUser?.email;
    let Obj;
    await getObj(adminMail, "admin")
      .then((val) => {
        Obj = val;
        console.log(Obj, "came to line 28 fire employee");
      })
      .catch((err) => console.log(err));
    if (employeeType.toLowerCase() == "accountant") {
      console.log(employeeEmail, employeeType);
      await getObj(employeeEmail, "accountant")
        .then((val) => {
          console.log(val);
          employeePassword = val.password;
          console.log(employeePassword, " password");
        })
        .catch((err) => console.log(err));
    }
    if (employeeType.toLowerCase() == "salesperson") {
      await getObj(employeeEmail, "salesPerson")
        .then((val) => {
          console.log(val);
          employeePassword = val.password;
          console.log(employeePassword, " password");
        })
        .catch((err) => console.log(err));
    }
    console.log(employeeEmail, employeeType);
    await logInWithEmailAndPassword(employeeEmail, employeePassword);
    console.log(auth?.currentUser?.email, "user email going to delete");
    let userType;
    if (employeeType.toLowerCase() == "salesperson") {
      userType = "salesPerson";
    }
    if (employeeType.toLowerCase() == "accountant") {
      userType = "accountant";
    }
    await delete_user(userType, adminMail, Obj.password);
    navigate(`/admin/FireEmployee`);
  };

  return (
    <div className="">
      <form
        className="form bg-gradient-to-r from-slate-900 to-neutral-900"
        onSubmit={(e) => handleDelete(e, employeeEmail, employeeType)}
      >
        <h2 className="title_fire bg-gradient-to-r from-slate-900 to-neutral-900">
          {" "}
          Enter the employee details to Delete
        </h2>

        <input
          type="email"
          className="input"
          required
          placeholder="EmployeeEmail ?"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />

        <input
          type="text"
          required
          className="input"
          placeholder="Employee Type ?"
          value={employeeType}
          onChange={(e) => setEmployeeType(e.target.value)}
        />

        <button className="button _btnDelete" type="submit">
          Delete
        </button>
      </form>
    </div>
  );
}

export default FireEmployee;
