import React from "react";

function Singup({onsignup}){
    return(
        <form id="SignupForm" >
            <label>Email:</label>
            <input type="email" name="email" />
            <label>Username:</label>
            <input type="text" name="username" />
            <label>Password:</label>
            <input type="password" name="password" />
            <input name="login" onClick={onsignup} type="submit" value="Login"/>
        </form>
    )
}

export default Singup;