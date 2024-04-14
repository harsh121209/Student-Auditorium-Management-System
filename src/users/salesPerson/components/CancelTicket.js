import React from "react";
import './CancelTicket.css'
import {useState, useEffect} from "react";
import {db} from "../../../config/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
function CancelTicket() {
  const reIntialise = () => {
    setSelectedSeats([[0, 1]]);
    setTicketExists(false);
    setAmount(0);
    setShowName("");
    setSeats([]);
    setDocShowId("");


  };
  const [ticketId, setTicketId] = useState("");
  const [selectedSeatsInd, setSelectedSeatsInd] = useState([[0, 1], [0, 2]]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketExist, setTicketExists] = useState(false);
  const [amount, setAmount] = useState(0);
  const [showName, setShowName] = useState("");
  const [seats, setSeats] = useState([]);
  const [docShowId, setDocShowId] = useState("");
  const [docTicketId, setDocTicketId] = useState("");
  const ticketRef = collection(db, "tickets");
  const transactionRef = collection(db, "transactions");
  const createdShowsRef = collection(db, "createdshows");
  useEffect(() => {
    function createSeatArray(seatArray) {
      const numRows = seatArray.length;
      const seatArray2d = new Array(numRows);

      for (let i = 0; i < numRows; i++) {
        const row = seatArray[i][0];
        const col = parseInt(seatArray[i].slice(1));
        seatArray2d[i] = [row.charCodeAt(0) - 65, col - 1];
      }

      return seatArray2d;
    }
    const fetchData = async () => {
      try {
        // get selected seats, showname using ticket id.
        const q = query(ticketRef, where("ticketid", "==", ticketId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setTicketExists(false);

          return;

        }
        const docSnapShot = querySnapshot.docs[0];
        const data = docSnapShot.data();
        setDocTicketId(docSnapShot.id);
        setSelectedSeats(data.selectedseats);
        setSelectedSeatsInd(createSeatArray(data.selectedseats));
        setShowName(data.showname);
        setAmount(data.amount);
        setTicketExists(true);

      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };
    if (ticketId) {
      fetchData();
    }
  }, [ticketId]);

  function getChangedSeatView(oldSeatView) {

    for (let i = 0; i < selectedSeatsInd.length; i++) {
      const row = selectedSeatsInd[i][0];
      const col = selectedSeatsInd[i][1];
      oldSeatView[row] = oldSeatView[row].substring(0, col) + '0' + oldSeatView[row].substring(col + 1);
    }
    return oldSeatView;
  }
  const handleSubmit = async () => {
    try {//1) update seats in that show.
      // 2) get ticket doc id (done already in useEffect).
      //  3) get Show id (done in this function)
      const q = query(createdShowsRef, where("showname", "==", showName));
      const snapShot = await getDocs(q);
      if (snapShot.empty) {
        alert(`${showName} does not exist , coding error`);
        return;
      }
      const docSnapShot = snapShot.docs[0];
      const data = docSnapShot.data();
      // setSeats(data1.seats);
      let oldSeatView = [...data.seats];
      // setDocShowId(docSnapShot.id);
      // setSeats();
      const ref1 = doc(db, "tickets", docTicketId);
      const ref2 = doc(db, "createdshows", docSnapShot.id);
      await deleteDoc(ref1);
      await updateDoc(ref2, {seats: getChangedSeatView(oldSeatView)});



      await addDoc(transactionRef, {ticketid: ticketId, type: "cancelled", amount});
      alert("Tickets deleted successfully , sadly no refunds");
      reIntialise();
    }
    catch (err) {
      console.log(err.message);
      alert(err.message);
    }
  }

  return <div>
    <form
      className="form form_BookTicket bg-gradient-to-r from-slate-900 to-neutral-900"
      onSubmit={(e) => e.preventDefault()}

    >
      <h1 className="title bg-gradient-to-r from-slate-900 to-neutral-900">
        {" "}
        Enter the Ticket id for cancellation.
      </h1>

      <input
        className="input"
        required
        placeholder="Ticket id ?"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
      />
      {ticketExist && (<button className="_btnCancelTicket" onClick={handleSubmit}>
        Cancel Ticket
      </button>)
      }

    </form>
    {ticketExist && (<div className="ticket">
      <h1>Show Name : {showName}</h1>
      <h2>Booked Seats</h2>
      <h2 className="seatNumbers">
        {selectedSeats.map((val, valIndex) =>
          (<div key={valIndex} className="seatNumber">{val}</div>)
        )}
      </h2>
      <h2>Amount Paid : {amount}</h2>

    </div>)}
  </div>;
}

export default CancelTicket;
