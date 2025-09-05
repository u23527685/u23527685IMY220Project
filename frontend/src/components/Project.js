import React from "react";
import ProjectCheckInOut from "./ProjectCheckinout";
import ProjectDiscussion from "./ProjectDiscussion";
import ProjectFiles from "./ProjectFiles";
import ProjectMembers from "./ProjectMemebers";
import ProjectStatusFeed from "./ProjectStatusFeed";
import ProjectDetails from "./ProjectDetails";
import { useLocation } from "react-router-dom";
import "../../public/assets/css/projectinfo.css";


function Project(){
    const location=useLocation();
    const {project}=location.state || {};
    return (
        <div id="projinfo">
            <h1>Project System</h1>
            <ProjectDetails project={project} />
            <ProjectStatusFeed feed={project.feed} />
            <ProjectFiles files={project.files} />
            <ProjectMembers owner={project.owner} members={project.members} />
            <ProjectDiscussion discussion={project.discussion} />
            <ProjectCheckInOut />
        </div>
    )
}

export default Project;