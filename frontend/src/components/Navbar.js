import { NavLink  } from "react-router-dom";
import React from "react";
import logo from "../../public/assets/svg/logo.svg";
import "../../public/assets/css/navbar.css";
import profileimg from "../../public/assets/svg/default user.svg";

function Navbar({username}){
    return(
        <nav>
            <div id="logo">
                <img width={"100px"} src={logo}></img>
            </div>
            
            <div id="middle">
                <NavLink className={({ isActive }) => (isActive ? "isActive" : undefined)}  to="/home"><h2>Home</h2></NavLink>
                <NavLink className={({ isActive }) => (isActive ? "isActive" : undefined)} to={`/projects/${username}`}><h2>Projects</h2></NavLink>
                
            </div>
            
            <div id="profilelink">
                <NavLink className={({ isActive }) => (isActive ? "isActive" : undefined)} to="/profile">
                    <h2>{username}</h2>
                    <img height={"50px"} src={profileimg} ></img>
                </NavLink>
            </div>
            
        </nav>
    )
}

export default Navbar;