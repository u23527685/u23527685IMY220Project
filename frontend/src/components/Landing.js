import React from "react";
import Login from "./Login";
import Singup from "./Signup";
import { useNavigate } from 'react-router-dom';
import slogan from "../../public/assets/svg/slogan.svg"
import semicircle from "../../public/assets/svg/semicircle.svg"
import "../../public/assets/css/landing.css"
const { useRef, useState } = React;

function Landing(){
    const navigate = useNavigate();
    const [login, setlogin] = useState(false);
    const [signup, setsignup] = useState(false);
    function toggleLogin() {
        setsignup(false);
        setlogin(true);
    }
    function toggleSignup() {
        setsignup(true);
        setlogin(false);
    }
    function handleLogin(user) {
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home',{ state: { user } });
    }

    function untoggleLogin(){
        setlogin(false);
    }
    function untoggleSignup(){
        setsignup(false);
    }
    
    function handleSignup(user) {
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/profile',{ state: { user } });
    }
    return(
        <div id="landing">
            <img src={semicircle} alt="decoration" className="semicircle" />
      
            <div className="content">
                <img src={slogan} alt="Welcome to Veyo - Don't Git Lost Veyo It!" className="slogan" />
            </div>
            <button  onClick={toggleLogin} >Login</button>
            <button onClick={toggleSignup}>Signup</button>
            {login && (<Login oncancel={untoggleLogin} toggleSignup={toggleSignup} onlogin={handleLogin} />)}
            {signup && (<Singup oncancel={untoggleSignup} toggleLogin={toggleLogin} onsignup={handleSignup}/>)}
        </div>
    )
}

export default Landing;