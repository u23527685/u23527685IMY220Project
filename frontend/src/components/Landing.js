import React from "react";
import Login from "./Login";
import Singup from "./Signup";
import { useNavigate } from 'react-router-dom';
const { useRef, useState } = React;

const user={
    username:"Ben10",
    paswword:"benLook11#",
    email:"Ben10@gmail.com"
}

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
    function handleLogin(event){
        event.preventDefault();
        setlogin(false);
    }
    function handleSignup(event){
        event.preventDefault();
        setsignup(false);
        navigate('/home');
    }
    return(
        <main>
            <button onClick={toggleLogin} >Login</button>
            <button onClick={toggleSignup}>Signup</button>
            {login && (<Login onlogin={handleLogin} />)}
            {signup && (<Singup onsignup={handleSignup}/>)}
        </main>
    )
}

export default Landing;