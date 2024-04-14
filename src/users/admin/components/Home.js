import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../config/firebase";
import "./Home.css";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  updateDoc,
  query,
  getCountFromServer,
} from "firebase/firestore";

import Show from "./Show";
export default function Home() {
  console.log("logger");
  const showsRef = collection(db, "shows");
  const [sortedShows, setSortedShows] = useState([]);
  let showsCollection = [];

  const getShows = async () => {
    showsCollection = [];
    const qu = query(showsRef);
    // const snapshot = await getCountFromServer(qu);
    // console.log("logger", snapshot.data().count);
    const content = await getDocs(showsRef);
    content.forEach((val) => {
      showsCollection.push(val.data());
    });
    showsCollection.sort((a, b) =>
      a.date > b.date ? 1 : b.date > a.date ? -1 : 0
    );

    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }

    let arr = [];
    let mymap = new Map();
    arr = showsCollection.filter((el) => {
      const val = mymap.get(el.date);
      if (val) {
        if (el.id < val) {
          mymap.delete(el.date);
          mymap.set(el.date, el.id);
          return true;
        } else {
          return false;
        }
      }
      mymap.set(el.date, el.id);
      return true;
    });
    console.log(arr);
    // for (let i = 0, j = 0; i < showsCollection.length; i++) {
    //   arr[i] = showsCollection[i];
    // }
    // showsCollection = arr;
    setSortedShows(arr);
    sortedShows.forEach((val) => {
      console.log(val.slots);
    });
    // console.log("logger");
  };

  useEffect(() => {
    getShows();
  }, []);

  // const slots = [false, true, false, false, true];
  return (
    <div className="shows  bg-gradient-to-r from-slate-900 to-slate-900">
      {sortedShows.map((val) => (
        <Show showData={val} />
      ))}
    </div>
  );
}
