import Landing from "../components/Landing";
import React from "react";
import Home from "./Home";

function SplashPage(){
    return(
        <main style={{margin : 0 ,backgroundColor: '#E8F5E9', padding:0}} className="splashpage" >
            <Landing onauth={<Home/>}/>
        </main>
        
    )
}

export default SplashPage;