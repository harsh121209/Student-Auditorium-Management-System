import React from "react";
import "./SetShow.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteShow } from "../../../config/firebase";
function DeleteShow() {
  const [showDate, setShowDate] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const navigate = useNavigate();
  const handleDateUpdate = async (e) => {
    const dateValue = e.target.value;
    let str = dateValue;
    setDate(str.slice(0, 4) + str.slice(5, 7) + str.slice(8, 10));
    console.log(str.slice(0, 4), str.slice(5, 7), str.slice(8, 10));
    console.log(date);
    // setYear(str.slice(0, 4));//year
    // setMonth(str.slice(5, 7));//month
    // setDay(str.slice(8, 10));//day
    // console.log("dateValue", dateValue);
    setShowDate(dateValue); // state variable updated here
  };
  const handleDeleteShow = async (e) => {
    e.preventDefault();
    await deleteShow(date, slot)
      .then((val) => {
        if (val) {
          alert("Show deleted successfully");
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert(err.message, "show deletion Unsuccessful");
      });
    navigate(`/admin/DeleteShow`);
  };

  return (
    <div className="">
      <form
        className="form bg-gradient-to-r from-slate-900 to-neutral-900"
        onSubmit={(e) => handleDeleteShow(e)}
      >
        <h1 className="title bg-gradient-to-r from-slate-900 to-neutral-900">
          Enter the Show details to Add
        </h1>

        <h2 className="title bg-gradient-to-r from-slate-900 to-neutral-900">
          Enter Date
        </h2>
        <input
          type="date"
          className="input"
          required
          onChange={(e) => handleDateUpdate(e)}
        />

        <input
          className="input"
          required
          placeholder="Select a slot among [0-4] to free"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
        />

        <button className="buttonDelete _btnDelete" type="submit">
          Delete
        </button>
      </form>
    </div>
  );
}
export default DeleteShow;
