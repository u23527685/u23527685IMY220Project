import React from "react";
import "../../public/assets/css/login.css"

function Login({onlogin}){
    return(
        <div id="LoginOverlay">
                <form id="LoginForm" >
                <label>Username:</label>
                <input type="text" name="username" />
                <label>Password:</label>
                <input type="password" name="password" />
                <input name="login" onClick={onlogin} type="submit" value="Login"/>
                <p className="otherlink" ><strong>Signup?</strong></p>
            </form>
        </div>
    )
}

export default Login;