import React from "react";
import ProjectCheckInOut from "./ProjectCheckinout";
import ProjectDiscussion from "./ProjectDiscussion";
import ProjectFiles from "./ProjectFiles";
import ProjectMembers from "./ProjectMemebers";
import ProjectStatusFeed from "./ProjectStatusFeed";
import ProjectDetails from "./ProjectDetails";
import { useLocation } from "react-router-dom";
import "../../public/assets/css/projectinfo.css";

function Project() {
    const location = useLocation();
    const { project } = location.state || {};
    return (
        <div id="projinfo">
        <h1>Project System</h1>

        <div className="project-section">
            <ProjectDetails project={project} />
        </div>

        <div className="project-section">
            <ProjectStatusFeed feed={project.feed} />
        </div>

        <div className="project-section">
            <ProjectFiles files={project.files} />
        </div>

        <div className="project-section">
            <ProjectMembers owner={project.owner} members={project.members} />
        </div>

        <div className="project-section">
            <ProjectDiscussion discussion={project.discussion} />
        </div>

        <div className="project-section">
            <ProjectCheckInOut />
        </div>
        </div>
    );
}

export default Project;

//u23527685 18
