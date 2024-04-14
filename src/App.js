import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import Reset from "./authentication/Reset";

import AdminPage from "./users/admin/AdminPage";
import SalesPerson from "./users/salesPerson/SalesPerson";
import Accountant from "./users/accountant/Accountant";
import AddEmployee from "./users/admin/AddEmployee/AddEmployee";
import FireEmployee from "./users/admin/FireEmployee/FireEmployee";
import SetShow from "./users/admin/shows/SetShow";
import DeleteShow from "./users/admin/shows/DeleteShow";
import Home from "./users/admin/components/Home";
import "./App.css";
import HomeSales from "./users/salesPerson/components/HomeSales";
import BookTicket from "./users/salesPerson/components/BookTicket";
import CancelTicket from "./users/salesPerson/components/CancelTicket";
import EditExpenditure from "./users/accountant/components/EditExpenditure";
import YearlyExpenditureSheet from "./users/admin/components/YearlyExpenditureSheet";
function App() {
  return (
    <div className="app font-mono h-screen bg-black">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="admin" element={<AdminPage />}>
            <Route index element={<Home />} />
            <Route path="AddEmployee" element={<AddEmployee />} />
            <Route path="FireEmployee" element={<FireEmployee />} />
            <Route path="SetShow" element={<SetShow />} />
            <Route path="DeleteShow" element={<DeleteShow />} />
            <Route path="YearlyExpenditureSheet" element={<YearlyExpenditureSheet />}></Route>

          </Route>
          <Route path="salesPerson" element={<SalesPerson />}>
            <Route index element={<HomeSales />}></Route>
            <Route path="BookTicket" element={<BookTicket />}></Route>
            <Route path="CancelTicket" element={<CancelTicket />}></Route>
          </Route>
          <Route path="accountant" element={<Accountant />} >
            <Route index element={<EditExpenditure />}></Route>

          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
