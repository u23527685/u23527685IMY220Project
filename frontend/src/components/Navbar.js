import { Link } from "react-router-dom";
import React from "react";

function Navbar({user,projects,otheruser}){
    return(
        <nav>
            <Link to="/home">Home</Link>
            <Link to="/profile"state={{user,projects,otheruser}}>Profile</Link>
        </nav>
    )
}

export default Navbar;