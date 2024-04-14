import React, {useEffect, useState} from "react";
import {Form, Link} from "react-router-dom";
import {db} from "../../../config/firebase";
import "./EditExpenditure.css";
import {
    getDocs,
    collection,
    getDoc,
    doc,
    updateDoc,
    query,
    getCountFromServer,
    where,
} from "firebase/firestore";

// import Show from "./components/Show";
export default function EditExpenditure() {
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
    function countSeatsBooked(arr) {
        console.log(arr);
        return arr.reduce((count, binaryString) => {
            return count + binaryString.split('1').length - 1;
        }, 0);
    }
    const handleAmount = async (event, val) => {
        try {
            const inputValue = parseInt(event?.target?.previousSibling?.value, 10);
            console.log(typeof inputValue, inputValue);

            const q = query(showsRef, where("showname", "==", val.showname));
            const snapShot = await getDocs(q);

            const docSnapShot = snapShot.docs[0];
            const data = docSnapShot.data();

            let seatView = [...data.seats];

            let seatsBookedCnt = countSeatsBooked(seatView);
            const ref = doc(db, "createdshows", docSnapShot.id);
            console.log(seatsBookedCnt, data.seatprice);
            let income = seatsBookedCnt * (data.seatprice);
            await updateDoc(ref, {income, expenditure: inputValue});
            alert("Expenditure updated successfully");
        }
        catch (err) {
            console.log(err.message);
            alert(err.message);
        }
    }




    // const slots = [false, true, false, false, true];
    return (
        <div className="globalShows ">
            {sortedShows.map((val, valIndex) => (
                <div key={valIndex} className="eachShow font-mono flex flex-col md:flex-row md:items-center mb-4 bg-gradient-to-r from-slate-900 to-slate-900">
                    <div className="flex flex-col md:flex-row editParent w-full md:w-2/5 items-center justify-between">
                        <h2 className="editChild text-white text-lg font-bold mb-2">Title: {val.showname}</h2>
                        <div className="flex flex-col editChild text-white">
                            <h3 className="mb-1">Slot:</h3>
                            <p>{val.slotnumber}</p>
                        </div>
                        <h3 className="editChild text-white mb-2">Date: {val.date.slice(0, 4) + "/" + val.date.slice(4, 6) + "/" + val.date.slice(6, 8)}</h3>
                    </div>
                    <div className="w-full md:w-3/5 flex items-center justify-center mt-4 md:mt-0">
                        <input
                            type="text"
                            className="input text-black mr-2 w-2/3 md:w-1/2"
                            required
                            placeholder={val.expenditure ? `${val.expenditure}` : "Edit Expenditure"}
                        />
                        <button className="_btnExpenditure px-4 py-2 rounded-md" onClick={(e) => handleAmount(e, val)}>
                            Update
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
