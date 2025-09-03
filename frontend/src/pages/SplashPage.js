import Landing from "../components/Landing";
import React from "react";
import Home from "./Home";

function SplashPage(){
    return(
        <div>
            <Landing onauth={<Home/>}/>
        </div>
        
    )
}

export default SplashPage;