import React from "react";
import Login from "./Login";
import Singup from "./Signup";
const { useRef, useState } = React;

const user={
    username:"Ben10",
    paswword:"benLook11#",
    email:"Ben10@gmail.com"
}

function Landing(){
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