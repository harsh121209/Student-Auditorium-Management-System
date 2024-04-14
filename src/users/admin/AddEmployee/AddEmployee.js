import React from "react";
import "./AddEmployee.css";
import { useState, useEffect } from "react";
import { registerEmployee, auth } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
function AddEmployee() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
  }, [loading]);
  const handleAdd = async (e) => {
    e.preventDefault();
    await registerEmployee(
      employeeName,
      employeeEmail,
      employeePassword,
      employeeType
    );
    navigate(`/admin/AddEmployee`);
  };
  return (
    <div className="">
      <form
        className="form bg-gradient-to-r from-slate-900 to-neutral-900"
        onSubmit={(e) => handleAdd(e)}
      >
        <h2 className="title bg-gradient-to-r from-slate-900 to-neutral-900">
          Enter the employee details to Add
        </h2>

        <input
          type="text"
          className="input"
          required
          placeholder="EmployeeName"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <input
          type="email"
          className="input"
          required
          placeholder="EmployeeEmail"
          value={employeeEmail}
          onChange={(e) => setEmployeeEmail(e.target.value)}
        />
        <input
          type="password"
          required
          className="input"
          placeholder="set EmployeePassword"
          value={employeePassword}
          onChange={(e) => setEmployeePassword(e.target.value)}
        />
        <input
          type="text"
          required
          className="input"
          placeholder="set Employee Type"
          value={employeeType}
          onChange={(e) => setEmployeeType(e.target.value)}
        />

        <button className="buttonAdd _btnAdd" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
