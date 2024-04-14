import React, {useEffect, useState} from "react";
import {Form, Link} from "react-router-dom";
import {db} from "../../../config/firebase";
import "./HomeSales.css";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  updateDoc,
  query,
  getCountFromServer,
} from "firebase/firestore";

// import Show from "./components/Show";
import "./ShowSales.css";
import ShowSales from "./ShowSales";
export default function HomeSales() {
  console.log("logger");
  console.log("logger");
  const showsRef = collection(db, "createdshows");
  const [sortedShows, setSortedShows] = useState([]);
  let showsCollection = [];

  const getShows = async () => {
    console.log("logger");
    showsCollection = [];
    const qu = query(showsRef);
    const snapshot = await getCountFromServer(qu);
    console.log("logger", snapshot.data().count);
    console.log("logger");
    const content = await getDocs(showsRef);
    console.log("logger");
    content.forEach((val) => {
      showsCollection.push(val.data());
    });
    console.log("logger");
    showsCollection.sort((a, b) =>
      a.date > b.date ? 1 : b.date > a.date ? -1 : 0
    );
    console.log("logger");

    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }

    let arr = [];
    arr = showsCollection.filter(onlyUnique);
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
      {sortedShows.map((val, valIndex) => (
        <ShowSales key={valIndex} showData={val} />
      ))}
    </div>
  );
}
