import React from "react";
import { useLocation } from "react-router-dom";
import ProjectPreview from "./ProjectPreview";

function Likes({likes}){
    const location = useLocation();
    const { projects } = location.state || [];
    var likedprojects = projects.filter(project =>
        likes.some(like =>
            like.name === project.name && like.owner === project.owner
        )
    );
    return(
        <div id="likedprojects" >
            {likedprojects.map((lp,i)=><ProjectPreview key={i} project={lp}/>)}
        </div>
    )

}

export default Likes;