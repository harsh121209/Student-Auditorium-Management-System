import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import JsPDF from "jspdf";
import {v4 as uuid} from "uuid";
import {db} from "../../../config/firebase";
import {
    getDocs,
    collection,
    query,
    where,
    updateDoc,
    doc,
    addDoc,
} from "firebase/firestore";
import "./BookTicket.css";

const NUM_ROWS = 20;
const NUM_COLS = 20;

const BookTicket = () => {
    const [seats, setSeats] = useState(Array(NUM_ROWS).fill().map(() => Array(NUM_COLS).fill("available")));
    const [selectedSeats, setSelectedSeats] = useState(Array(NUM_ROWS).fill().map(() => Array(NUM_COLS).fill("available")));
    const [showName, setShowName] = useState("");
    const [oldSeats, setOldSeats] = useState(Array(NUM_ROWS).fill().map(() => Array(NUM_COLS).fill("available")));
    const [docId, setDocId] = useState("");
    const [showExists, setShowExists] = useState(false);
    const [seatPrice, setSeatPrice] = useState(0);
    const [ticketId, setTicketId] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        function create2DArray(arr1) {
            const numRows = arr1.length;
            const numCols = arr1[0].length;
            const arr2 = [];

            for (let i = 0; i < numRows; i++) {
                const row = [];
                for (let j = 0; j < numCols; j++) {
                    if (arr1[i][j] === '1') {
                        row.push('booked');
                    } else {
                        row.push('available');
                    }
                }
                arr2.push(row);
            }

            return arr2;
        }
        const fetchData = async () => {
            try {
                const showRef = collection(db, "createdshows");
                const q = query(showRef);
                console.log("logger");
                const querySnapshot = await getDocs(q);

                let data;
                querySnapshot.forEach((element) => {
                    let t = element.data().showname;
                    if (t.toLowerCase() == showName.toLowerCase()) {
                        data = element.data();
                        setDocId(element.id);
                    }
                });
                if (!data) {
                    setShowExists(false);
                    return;
                }

                console.log(data.seats);
                let a1 = create2DArray(data.seats);
                let a2 = create2DArray(data.seats);
                setSeats(a1);
                setOldSeats(a2);
                // why i am using two arrays a1 ,a2  just give a1 to both seats and oldSeats
                // a1 ,a2 are by reference if i gave a1 to both seats and oldSeats  , updation by seats results in updating oldSeats also and vice versa.
                // setSeats(data.seats.map((row) => row.split("")));
                // setTimeout(console.log(a1, a2, seats, oldSeats), 500);// setSeats is async i guess here so this console log gets executing before setSeats(arr);
                // so use time out func better debugging

                setSeatPrice(data.seatprice);
                setShowExists(true);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        };
        if (showName) {
            fetchData();
        }
    }, [showName]);


    const Print = (info) => {

        const doc = new JsPDF();
        const unique_id = uuid();
        // setTicketId(unique_id);

        console.log(ticketId);
        console.log(unique_id);

        const totalPrice = (info.length) * seatPrice;
        console.log(ticketId)
        doc.text(`Ticket Id : ${unique_id} `, 20, 5);
        doc.text("Selected Seats:", 10, 20);
        info.forEach((seat, index) => {
            const seatNumber = `${index + 1})Ticket   Row : ${seat[0]}  Column: ${seat[1]}`;
            doc.text(seatNumber, 10, 30 + index * 10);
        });
        doc.text(`BILL AMOUNT : ${totalPrice} rupees/only `, 30, 40 + (info.length + 1) * 10);
        doc.save(`ticket${unique_id}.pdf`);
        return unique_id;



    };
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const handleShowNameChange = (e) => {
        setShowName(e.target.value);
        setShowExists(true);
    };

    const handleSeatClick = (row, col) => {
        console.log(seats[row][col], oldSeats[row][col], row, col);

        if (oldSeats[row][col] === "available") {
            if (seats[row][col] === "booked") {
                const newSeats = [...seats];
                newSeats[row][col] = "available";
                setSeats(newSeats);
                const newSelectedSeats = [...selectedSeats];
                newSelectedSeats[row][col] = "available";
                setSelectedSeats(newSelectedSeats);
            }
            else if (seats[row][col] === "available") {
                const newSeats = [...seats];
                newSeats[row][col] = "booked";
                setSeats(newSeats);
                const newSelectedSeats = [...selectedSeats];
                newSelectedSeats[row][col] = "booked";
                setSelectedSeats(newSelectedSeats);
            }
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
            cursor: status === "available" ? "pointer" : "not-allowed",
        };
        return (
            <div key={`${row}_${col}`} style={seatStyle} onClick={() => handleSeatClick(row, col)}>
                {`${alphabet[row]}${col + 1}`}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selected_seats = [];
        const selectedSeatsFirebase = [];
        selectedSeats.forEach((row, rowIndex) => {
            row.forEach((seat, colIndex) => {
                if (seat === "booked") {
                    selected_seats.push([alphabet[rowIndex], colIndex + 1]);
                    selectedSeatsFirebase.push(`${alphabet[rowIndex]}${colIndex + 1}`);
                }
            });
        });
        if (selected_seats.length > 0) {
            console.log(selectedSeatsFirebase);
            console.log(selected_seats);
            ;
            updateSeatsInFirestore(selectedSeatsFirebase, Print(selected_seats));

            navigate("/salesPerson/BookTicket");
        }

    };
    function generateArr2(arr1) {
        const arr2 = [];
        for (let i = 0; i < arr1.length; i++) {
            let str = "";
            for (let j = 0; j < arr1[i].length; j++) {
                str += arr1[i][j] === "booked" ? "1" : "0";
            }
            arr2.push(str);
        }
        return arr2;
    }
    const updateSeatsInFirestore = async (selectedSeatsFirebase, ticketid) => {
        try {
            console.log(ticketId);
            const showRef = doc(db, "createdshows", docId);

            await updateDoc(showRef, {seats: generateArr2(seats)});

            const ticketRef = collection(db, "tickets");
            await addDoc(ticketRef, {ticketid, selectedseats: selectedSeatsFirebase, showname: showName, amount: (selectedSeatsFirebase.length) * seatPrice});
            const transactionRef = collection(db, "transactions");
            await addDoc(transactionRef, {ticketid, type: "booked", amount: (selectedSeatsFirebase.length) * seatPrice});
            alert("Tickets booked successfully");
            reIntialise();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    const reIntialise = () => {
        setOldSeats(seats);
        // setSeatPrice(0);
        // setShowExists(false);
        setSelectedSeats(Array(NUM_ROWS).fill().map(() => Array(NUM_COLS).fill("available")));
        // setTimeout(console.log(oldSeats), 500);
        setTicketId("");
    };

    return (<>
        <div className="bg-black">

            <form
                className="form form_BookTicket bg-gradient-to-r from-slate-900 to-neutral-900"
                onSubmit={(e) => e.preventDefault()}

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
                    onChange={(e) => handleShowNameChange(e)}
                />


            </form>
            {showExists && (<div className="text-white">
                <div className="text-white">--------------------------------Stage Side-------------------------</div>
                <div className="seats">

                    {seats.map((row, rowIndex) => (
                        <div key={rowIndex} style={{display: 'flex'}}>

                            {row.map((status, colIndex) => renderSeat(rowIndex, colIndex, status))}
                        </div>
                    ))}
                </div>

                {/* <button className="dashboard__btn _btnBookTicket" onClick={handleBookTicket}>
                    Book Tickets
                </button> */}
                <div className="btns">
                    <h2>  Seat Price : {seatPrice}</h2>
                    <button className="_btnBookTicket" onClick={handleSubmit}>
                        Book Tickets
                    </button>
                </div>
            </div>)}

        </div >


    </>
    );
};

export default BookTicket;
