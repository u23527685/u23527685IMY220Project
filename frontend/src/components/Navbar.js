import { Link } from "react-router-dom";
import React from "react";

function Navbar(){
    return(
        <nav>
            <Link to="/home" >Home</Link>
        </nav>
    )
}

export default Navbar;