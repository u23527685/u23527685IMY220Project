import React from "react";
import "../../public/assets/css/signup.css"

function Singup({onsignup}){
    return(
        <div id="SigninOverlay">
                <form id="SignupForm" >
                <label>Email:</label>
                <input type="email" name="email" />
                <label>Username:</label>
                <input type="text" name="username" />
                <label>Password:</label>
                <input type="password" name="password" />
                <input name="login" onClick={onsignup} type="submit" value="Signup"/>
                <p className="otherlink" ><strong>Login?</strong></p>
            </form>
        </div>  
    )
}

export default Singup;