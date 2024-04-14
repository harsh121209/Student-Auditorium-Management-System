import React, {useEffect, useState} from "react";
import {Form, Link} from "react-router-dom";
import {db} from "../../../config/firebase";
import "./YearlyExpenditureSheet.css";
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
export default function YearlyExpenditureSheet() {
    const showsRef = collection(db, "createdshows");
    const [sortedShows, setSortedShows] = useState([]);
    const [yearlySheet, setYearlySheet] = useState([{}]);
    let showsCollection = [];


    function yearlySheetfunc(arr1) {
        const yearMap = {};
        for (let i = 0; i < arr1.length; i++) {
            const {date, income, expenditure} = arr1[i];
            const year = date.slice(0, 4);
            if (!yearMap[year]) {
                yearMap[year] = {year, totalincome: 0, totalexpenditure: 0};
            }
            yearMap[year].totalincome += income;
            yearMap[year].totalexpenditure += expenditure;
        }
        return Object.values(yearMap);
    }
    const getShows = async () => {
        showsCollection = [];
        const qu = query(showsRef);

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
        arr = showsCollection.filter(onlyUnique);
        setYearlySheet(yearlySheetfunc(arr));



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

    // const slots = [false, true, false, false, true];
    return (
        <div className="sheet ">
            {yearlySheet.map((val, valIndex) => (
                <div key={valIndex} className="eachRowInSheet bg-gradient-to-r from-slate-900 to-slate-900">
                    <div className="editParent">
                        <h1 className="eachChildInRow text-white text-lg font-bold">Year : {val.year}</h1>
                        <h2 className="eachChildInRow text-white text-lg font-bold">Expenditure : {val.totalexpenditure}</h2>
                        <h2 className="eachChildInRow text-white text-lg font-bold">Income : {val.totalincome}</h2>
                        {val.totalincome - val.totalexpenditure >= 0 && (<h2 className="text-white">Profit :{val.totalincome - val.totalexpenditure}  </h2>)}
                        {val.totalexpenditure - val.totalincome > 0 && (<h2 className="text-white">Loss :{val.totalexpenditure - val.totalincome} </h2>)}
                    </div>

                </div>
            ))}
        </div>
    );
}
