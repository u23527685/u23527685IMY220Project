import { Link } from "react-router-dom";
import React from "react";

function Navbar({user,projects,otheruser,users}){
    return(
        <nav>
            <Link to="/home">Home</Link>
            <Link to="/profile"state={{user,projects,otheruser,users}}>Profile</Link>
        </nav>
    )
}

export default Navbar;