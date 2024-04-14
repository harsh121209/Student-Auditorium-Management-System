import React from "react";
import {Link} from "react-router-dom";
import {logout} from "../../../config/firebase";
import "./Navbar.css";
const Navbar = () => {
    return (
        <div className="bg-black">
            <div className="flex justify-between w-full p-4">
                <h1 className="text-center text-2xl text-white font-bold">
                    Accountant Page
                </h1>
                <div className="flex gap-3 ">
          /*{" "}
<Link to="">
<button className="p-2 _btn">Edit Expenditure</button>
</Link>


<Link to="/">
<button className="_btnAccountant" onClick={logout}>
Logout
</button>
</Link>
</div>
</div>
</div>
);
};

export default Navbar;
