import React from "react";
import "./SetShow.css";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {setShow} from "../../../config/firebase";
function SetShow() {
  const [showDate, setShowDate] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [hostName, setHostName] = useState("");
  const [showName, setShowName] = useState("");
  const [seatPrice, setSeatPrice] = useState("");
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
  const handleAddShow = async (e) => {
    e.preventDefault();
    await setShow(date, slot, hostName, showName, Number(seatPrice))
      .then((val) => {
        if (val) {
          alert("Show added successfully");
        } else {
          alert("time slot unavailable , try different slot");
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert(err.message);
      });
    navigate(`/admin/SetShow`);
  };

  return (
    <div className="">
      <form
        className="form bg-gradient-to-r from-slate-900 to-neutral-900"
        onSubmit={(e) => handleAddShow(e)}
      >
        <h1 className="title bg-gradient-to-r from-slate-900 to-neutral-900">
          {" "}
          Enter the Show details to Add
        </h1>

        <h2 className="title bg-gradient-to-r from-slate-900 to-neutral-900">
          Enter Date
        </h2>
        <input
          className="input"
          required
          placeholder="show Name ?"
          value={showName}
          onChange={(e) => setShowName(e.target.value)}
        />
        <input
          type="date"
          className="input"
          required
          onChange={(e) => handleDateUpdate(e)}
        />

        <input
          className="input"
          required
          placeholder="Select a slot among [0-4]"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
        />

        <input
          className="input"
          required
          placeholder="Host Name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
        />
        <input
          className="input"
          required
          placeholder="set seat price in rupees..."
          value={seatPrice}
          onChange={(e) => setSeatPrice(e.target.value)}
        />

        <button className="buttonAdd _btnAdd" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
export default SetShow;
