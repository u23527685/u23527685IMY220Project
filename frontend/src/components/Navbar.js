import { Link } from "react-router-dom";
import React from "react";

function Navbar(){
    return(
        <nav>
            <Link to="/home" >Home</Link>
            <Link to="/profile">Profile</Link>
        </nav>
    )
}

export default Navbar;