import React from "react";
import Login from "./Login";
import Singup from "./Signup";
import { useNavigate } from 'react-router-dom';
const { useRef, useState } = React;

const user={
    username:"Ben10",
    paswword:"benLook11#",
    email:"Ben10@gmail.com",
    company:"D1Demo Holdings",
    owned_projects:[],
    contributed_ptojects:[{
        name:"Grim town",
        owner:"Dan Grimm"
    }
    ],
    following:[
        {username:"DanGrimm"}
    ],
    followers:[
        {username:"DanGrimm"}
    ]
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
        <div id="landing">
            <button onClick={toggleLogin} >Login</button>
            <button onClick={toggleSignup}>Signup</button>
            {login && (<Login onlogin={handleLogin} />)}
            {signup && (<Singup onsignup={handleSignup}/>)}
        </div>
    )
}

export default Landing;