import React from "react";

function Login({onlogin}){
    return(
        <form id="LoginForm" >
            <label>Username:</label>
            <input type="text" name="username" />
            <label>Password:</label>
            <input type="password" name="password" />
            <input name="login" onClick={onlogin} type="submit" value="Login"/>
        </form>
    )
}

export default Login;