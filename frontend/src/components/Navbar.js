import { NavLink  } from "react-router-dom";
import React from "react";
import logo from "../../public/assets/svg/logo.svg";
import "../../public/assets/css/navbar.css";
import profileimg from "../../public/assets/svg/default user.svg";

function Navbar({user,projects,otheruser,users}){
    return(
        <nav>
            <div id="logo">
                <img width={"100px"} src={logo}></img>
            </div>
            
            <div id="middle">
                <NavLink className={({ isActive }) => (isActive ? "isActive" : undefined)} state={{user,projects,otheruser,users}} to="/home"><h2>Home</h2></NavLink>
                <NavLink className={({ isActive }) => (isActive ? "isActive" : undefined)} to={`/projects/${user.username}`}state={{projects,users}}><h2>Projects</h2></NavLink>
                
            </div>
            
            <div id="profilelink">
                <NavLink className={({ isActive }) => (isActive ? "isActive" : undefined)} to="/profile"state={{user,projects,otheruser,users}}>
                    <h2>Ben10</h2>
                    <img height={"50px"} src={profileimg} ></img>
                </NavLink>
            </div>
            
        </nav>
    )
}

export default Navbar;