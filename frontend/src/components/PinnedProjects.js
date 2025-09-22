import React from "react";
import { useLocation } from 'react-router-dom';
import ProjectPreview from "./ProjectPreview";

function PinnedProjects({pinprojects}){
    const location = useLocation();
    const { projects } = location.state || [];
    var pinnedprojects = projects.filter(project =>
        pinprojects.some(pp =>
            pp.name === project.name && pp.owner === project.owner
        )
    );
    return(
        <div className="pinned" >
                {pinnedprojects.map((pp,i)=><ProjectPreview key={i} project={pp}/>)}
        </div>
    )
}

export default PinnedProjects;

//u23527685 18