import React from "react";
const { useRef, useState } = React;
import ProjectPreview from "./ProjectPreview";
import "../../public/assets/css/projectfeed.css";

function GlobalFeed({projects,ondownload,onlike,onunlike}){
    return(
        <div className="feed" >
            {projects.map((project,i)=>{
                return <ProjectPreview key={i} project={project} ondownload={ondownload} onlike={onlike} onunlike={onunlike} />
            })}
            
        </div>
    )
}

export default GlobalFeed;