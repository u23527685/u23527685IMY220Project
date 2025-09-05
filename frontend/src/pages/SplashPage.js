import Landing from "../components/Landing";
import React from "react";
import Home from "./Home";

function SplashPage(){
    return(
        <main className="splashpage" >
            <Landing onauth={<Home/>}/>
        </main>
        
    )
}

export default SplashPage;