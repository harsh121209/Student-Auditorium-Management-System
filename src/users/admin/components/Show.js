import React from "react";
import "./Show.css";
export default function Show({showData}) {
  // console.log(showData);
  // const slots = showData.slots;
  const slots = showData.slots;

  let bgcolors = [],
    colors = [],
    status = [];
  // console.log(slots, "logger");
  for (let i = 0; i < 5; i++) {
    if (slots[i] == false) {
      bgcolors[i] = "navajowhite";
      colors[i] = "black";
      status[i] = "free";
    }
    if (slots[i] == true) {
      bgcolors[i] = "black";
      colors[i] = "white";
      status[i] = "booked";
    }
  }
  return (
    <div className="global">
      <div className="date bg-gradient-to-r from-slate-900 to-slate-900">
        {/* {console.log(showData.date)} */}
        {showData.date.slice(0, 4)}/{showData.date.slice(4, 6)}/
        {showData.date.slice(6, 8)}
      </div>
      <div className="slots bg-gradient-to-r from-slate-900 to-slate-900">
        <div
          className="slot "
          style={{backgroundColor: bgcolors[0], color: colors[0]}}
        >
          {status[0]}
        </div>
        <div
          className="slot"
          style={{backgroundColor: bgcolors[1], color: colors[1]}}
        >
          {status[1]}
        </div>
        <div
          className="slot"
          style={{backgroundColor: bgcolors[2], color: colors[2]}}
        >
          {status[2]}
        </div>
        <div
          className="slot"
          style={{backgroundColor: bgcolors[3], color: colors[3]}}
        >
          {status[3]}
        </div>
        <div
          className="slot"
          style={{backgroundColor: bgcolors[4], color: colors[4]}}
        >
          {status[4]}
        </div>
      </div>
    </div>
  );
}
