import React from "react";
import { useLocation } from 'react-router-dom';
import ProjectPreview from "./ProjectPreview";

function UserProjectsView({projectnames}){
    const location = useLocation();
    const { projects } = location.state || [];
    var userprojects = projects.filter(project =>
        projectnames.some(pn =>
            pn.name === project.name && pn.owner === project.owner
        )
    );
    return(
        <div id="userProjectView" >
            {userprojects.map((up,i)=><ProjectPreview key={i} project={up}/>)}
        </div>
    )
}

export default UserProjectsView;

//u23527685 18