import React from "react";
import "./ShowSales.css";
function ShowSales({ showData }) {
  let date = "";
  date =
    showData.date.slice(0, 4) +
    "/" +
    showData.date.slice(4, 6) +
    "/" +
    showData.date.slice(6, 8);

  const showName = showData.showname;
  const slot = showData.slotnumber;

  return (
    <div class="show-container bg-teal-700 font-mono">
      <div>
        <h2>Title : {showName}</h2>
      </div>
      <div>
        <h3>Date : {date}</h3>
      </div>
      <div>
        <h3>Slot</h3>
        <p>{slot}</p>
      </div>
    </div>
  );
}

export default ShowSales;
