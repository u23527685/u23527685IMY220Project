import React from "react";
const { useRef, useState } = React;
import ProjectPreview from "./ProjectPreview";
import "../../public/assets/css/projectfeed.css";

function LocalFeed({projects,user,ondownload,onlike,onunlike}){
    const followedUsernames = user?.following?.map(followUser => followUser.username) || [];
    const followedProjects = projects.filter(project => 
        followedUsernames && followedUsernames.includes(project.owner)
    );
    return(
        <div className="feed" >
            {followedProjects.map((project,i)=>{
                return <ProjectPreview key={i} project={project} ondownload={ondownload} onlike={onlike} onunlike={onunlike} />
            })}
            
        </div>
    )
}

export default LocalFeed;

//u23527685 18 