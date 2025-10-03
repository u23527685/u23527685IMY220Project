import React from "react";
import Login from "./Login";
import Singup from "./Signup";
import { useNavigate } from 'react-router-dom';
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
    
    function handleSignup(user) {
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/profile',{ state: { user } });
    }
    return(
        <div id="landing">
            <button  onClick={toggleLogin} >Login</button>
            <button onClick={toggleSignup}>Signup</button>
            {login && (<Login toggleSignup={toggleSignup} onlogin={handleLogin} />)}
            {signup && (<Singup toggleLogin={toggleLogin} onsignup={handleSignup}/>)}
        </div>
    )
}

export default Landing;