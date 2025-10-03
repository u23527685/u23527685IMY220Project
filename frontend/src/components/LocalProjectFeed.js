import React from "react";
const { useRef, useState } = React;
import ProjectPreview from "./ProjectPreview";
import "../../public/assets/css/projectfeed.css";

function LocalFeed({ projects, ondownload, user }) {
    if (!projects || projects.length === 0) {
        return (
            <div className="feed">
                <p>No projects yet. Create your first project or add friends to see their projects!</p>
            </div>
        );
    }

    return (
        <div className="feed">
            {projects.map((project, index) => {
                const projectId = typeof project._id === 'object' ? 
                    (project._id.$oid || project._id.toString()) : 
                    project._id;
                return (
                    <ProjectPreview 
                        key={projectId || `project-${index}`}
                        project={project} 
                        ondownload={ondownload}
                        user={user}
                    />
                );
            })}
        </div>
    );
}

export default LocalFeed;

//u23527685 18 