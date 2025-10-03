// frontend/src/components/ProjectDetails.js
import React, { useState, useEffect } from 'react';
import Hashtag from './Hashtag'; // Assuming Hashtag component exists
import EditProjectForm from './EditProject';
import "../../public/assets/css/projectdetails.css";

function ProjectDetails({ project, isOwner, onProjectUpdated }) { 
    const [editing, setEditing] = useState(false);
    const [projectType, setProjectType] = useState('Loading...');

    // Fetch project type name
    useEffect(() => {
        const fetchTypeName = async () => {
            if (project?.type) {
                try {
                    const response = await fetch(`/api/types/${project.type}`); 
                    const result = await response.json();
                    if (result.success && result.types && result.types.length > 0) {
                        setProjectType(result.types[0].name);
                    } else {
                        setProjectType('Unknown Type');
                    }
                } catch (err) {
                    console.error('Error fetching project type:', err);
                    setProjectType('Error');
                }
            }
        };
        fetchTypeName();
    }, [project?.type]);

    if (!project) {
        return <section>Loading project details...</section>;
    }

    return (
        <section>
            {!editing ? (
                <>
                    <h1>{project.name}</h1>
                    <p>{project.description}</p>
                    <p>Type: {projectType}</p>
                    <div>
                        {project.hashtags && project.hashtags.map((tag) => (
                            <Hashtag key={tag} tag={tag} onClick={() => { /* search handler */ }} />
                        ))}
                    </div>
                    {isOwner && (
                        <button onClick={() => setEditing(true)}>Edit Project</button>
                    )}
                </>
            ) : (
                <EditProjectForm
                    project={project}
                    onSave={() => {
                        setEditing(false);
                        onProjectUpdated(); // Notify parent to refetch
                    }}
                    onCancel={() => setEditing(false)}
                />
            )}
        </section>
    );
}

export default ProjectDetails;