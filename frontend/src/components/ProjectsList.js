// frontend/src/components/ProjectsList.js
import React from "react";
import ProjectPreview from "./ProjectPreview";
import "../../public/assets/css/projectlist.css";

function ProjectsList({ ownedProjects, memberOfProjects, username }) { // Updated prop names
    return (
        <div className="projects-list-container"> {/* Added a container for overall styling */}
            <div id="Owned">
                <h3>Owned Projects</h3>
                {ownedProjects.length > 0 ? (
                    <div className="project-grid"> {/* Added a grid for layout */}
                        {ownedProjects.map((project) => (
                            <ProjectPreview
                                username={username} // This username is likely for display/routing purposes
                                project={project}
                                key={project._id} // Use project._id as key for stability
                                yours={true} // Indicates the current user owns this project
                            />
                        ))}
                    </div>
                ) : (
                    <p>No owned projects.</p>
                )}
            </div>

            <div id="member">
                <h3>Member Of Projects</h3>
                {memberOfProjects.length > 0 ? (
                    <div className="project-grid"> {/* Added a grid for layout */}
                        {memberOfProjects.map((project) => (
                            <ProjectPreview
                                username={username} // This username is likely for display/routing purposes
                                project={project}
                                key={project._id} // Use project._id as key for stability
                                yours={false} // Indicates the current user is a member, not owner
                            />
                        ))}
                    </div>
                ) : (
                    <p>No projects as a member.</p>
                )}
            </div>
        </div>
    );
}

export default ProjectsList;

//u23527685 18