import React from "react";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
// import JsPDF from "jspdf";
import JsPDF from "JsPDF"
import "./BookTicket.css";
import {v4 as uuid} from 'uuid';
import {db} from "../../../config/firebase";
import {
    getDocs,
    collection,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    getCountFromServer,
} from "firebase/firestore";
function BookTicket() {
    const [seats, setSeats] = useState([[]]);
    const [choices, setChoices] = useState([[]]);
    const [hid, setHid] = useState(true);
    const [showName, setShowName] = useState("");
    const [grid, setGrid] = useState([""]);
    const [docId, setDocId] = useState("");
    const navigate = useNavigate();
    const showRef = collection(db, "createdshows");
    let seatMap = [];



    const getChoices = () => {
        let tempChoices = [];
        console.log(seats);  /// javascript suckssssssssssssss
        for (let i = 0; i < 20; i++) {

            tempChoices.push([]);
            for (let j = 0; j < 20; j++) {
                if (seats[i][j] == "available")
                    tempChoices[i].push(1);
                if (seats[i][j] == "booked")
                    tempChoices[i].push(0);
            }

        }
        console.log(tempChoices.length);

        setChoices(tempChoices)
        // if (setChoices(tempChoices)) {
        //     console.log(tempChoices, choices);
        // }
        // else
        //     console.log(tempChoices, choices);
    }

    const Print = (info) => {
        const doc = new JsPDF();
        let unique_id = uuid();
        console.log(unique_id);
        doc.text(`Ticket Id : ${unique_id} `, 20, 5);
        doc.text('Selected Seats:', 10, 20);
        info.forEach((seat, index) => {
            const seatNumber = `${index + 1})Ticket   Row : ${seat[0]}  Column: ${seat[1]}`;
            doc.text(seatNumber, 10, 30 + (index * 10));
        });
        doc.save(`ticket${unique_id}.pdf`);
    };


    const reIntialise = () => {
        setGrid([""]);
        setChoices([[]]);
        setHid(true);
        setSeats([[]]);
        setDocId("");
    }
    const handleClick = async (e) => {
        e.preventDefault();
        reIntialise();
        try {
            const qu = query(showRef);
            const snapshot = await getCountFromServer(qu);

            const content = await getDocs(qu);

            content.forEach((element) => {
                let t = element.data().showname;
                if (t.toLowerCase() == showName.toLowerCase()) {
                    setGrid(element.data().seats);
                    console.log(element.data().seats);
                    setDocId(element.id);

                }
            });

            console.log(grid, grid.length);
            if (snapshot.data().count != 0) {
                setHid(false);
                for (let i = 0; i < 20; i++) {
                    let t = [];
                    let str = grid[i];
                    // console.log(str);
                    for (let c of str) {
                        if (c == '0') {
                            t.push("available");
                            // console.log("came here");
                        } else t.push("booked");
                    }
                    seatMap.push(t);
                }
                console.log(seatMap);
                setSeats(seatMap)
                if (setSeats(seatMap)) {
                    //nth
                    console.log(seats);
                    getChoices();
                    console.log(choices);
                }
                else {
                    console.log(seats);
                    getChoices();
                    console.log(choices);
                }
                // getChoices();

                console.log(seats);

            } else {
                setHid(true);
            }
        }
        catch (err) {
            console.log(err.message);
            alert(err.message);
        }
    };



    const handleSeatClick = (row, col) => {
        console.log(row, col, "logger");
        console.log(choices.length);
        console.log(choices[row][col]);
        console.log(choices);
        // console.log(choices[row][col]);
        if (seats[row][col] === "available") {
            const updatedSeats = [...seats];
            updatedSeats[row][col] = "booked";
            setSeats(updatedSeats);

        } else if (choices[row][col] == 1) {
            console.log(row, col);
            const updatedSeats = [...seats];
            updatedSeats[row][col] = "available";
            setSeats(updatedSeats);
        }

    };

    const renderSeat = (row, col, status) => {
        const seatStyle = {
            width: "40px",
            height: "40px",
            margin: "2px",
            backgroundColor: status === "available" ? "white" : "black",
            border: "1px dotted whitesmoke",
            color: status === "available" ? "black" : "white",
            cursor: status === "available" ? "pointer" : "default",
        };

        return (
            <div key={`${row}-${col}`} style={seatStyle} onClick={() => handleSeatClick(row, col)}>
                {alphabet[row]}{alphabet[col]}
            </div>
        );
    };
    const handleShowName = (name) => {
        setShowName(name);
        setHid(true);

    }
    // const myTimeout = ;

    const handleBookTicket = () => {

        //    let new

        let seats_booked = [];
        let seatsAfterBooking = [];
        console.log(seatsAfterBooking);
        console.log(docId);
        console.log(grid);
        console.log(choices, seats);
        for (let i = 0; i < 20; i++) {
            let str = "";
            for (let j = 0; j < 20; j++) {

                if (choices[i][j] == 1 && seats[i][j] == "booked") {
                    seats_booked.push(alphabet[i] + alphabet[j]);
                    str = str + '1';

                }
                else
                    str = str + (grid[i][j]);
            }

            seatsAfterBooking.push(str);
        }
        Print(seats_booked);
        setGrid(seatsAfterBooking);
        console.log(seats_booked);
        console.log(seatsAfterBooking, grid, choices);

        console.log("logger");
        const updateSeats = async () => {
            try {
                const update_seats = doc(db, "createdshows", docId);
                await updateDoc(update_seats, {

                    seats: grid,
                    showname: "avengersDEBug",
                });
                alert("Tickets Booked Successfully");
            }
            catch (err) {
                console.log(err.message);
                alert(err.message);
            }
        }
        updateSeats();
        reIntialise();
        setShowName("");


    }
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];

    return (
        <>
            <div className="BookTicket">
                <form
                    className="form form_BookTicket bg-gradient-to-r from-slate-900 to-neutral-900"
                    onSubmit={(e) => handleClick(e)}
                >
                    <h1 className="title bg-gradient-to-r from-slate-900 to-neutral-900">
                        {" "}
                        Enter the Show name to Book
                    </h1>

                    <input
                        className="input"
                        required
                        placeholder="show Name ?"
                        value={showName}
                        onChange={(e) => handleShowName(e.target.value)}
                    />

                    <button className="buttonAdd _btnAdd" type="submit">
                        Check
                    </button>
                </form>
                <div className="m-10">
                    {!hid && (<div className="text-white">
                        <div className="text-white">--------------------------------Stage Side-------------------------</div>
                        <div>

                            {seats.map((row, rowIndex) => (
                                <div key={rowIndex} style={{display: 'flex'}}>

                                    {row.map((status, colIndex) => renderSeat(rowIndex, colIndex, status))}
                                </div>
                            ))}
                        </div>

                        <button className="dashboard__btn _btnBookTicket" onClick={handleBookTicket}>
                            Book Tickets
                        </button>
                    </div>)}
                </div>

            </div>
        </>
    );
}
export default BookTicket;
