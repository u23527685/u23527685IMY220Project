import React, { useState, useEffect } from "react";
import ProjectPreview from "./ProjectPreview";

function UserProjectsView({ projectIds }) { // Changed prop name to reflect it's IDs
    const [userProjects, setUserProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProjects = async () => {
            if (!projectIds || projectIds.length === 0) {
                setUserProjects([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Fetch each project individually or create a batch API if available
                const fetchedProjects = [];
                for (const projectId of projectIds) {
                    const response = await fetch(`/ap/project/${projectId}`, { // Note: your API is /ap/project/:projectId
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const result = await response.json();
                    if (result.success && result.project) {
                        fetchedProjects.push(result.project);
                    } else {
                        console.warn(`Failed to fetch user project ${projectId}: ${result.message}`);
                    }
                }
                setUserProjects(fetchedProjects);
            } catch (err) {
                console.error('Error fetching user projects:', err);
                setError(err.message || 'Failed to fetch user projects.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProjects();
    }, [projectIds]); // Re-run when the list of project IDs changes

    if (loading) {
        return <div id="userProjectView">Loading projects...</div>;
    }

    if (error) {
        return <div id="userProjectView" style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (userProjects.length === 0) {
        return <div id="userProjectView">No projects to display.</div>;
    }

    return (
        <div id="userProjectView">
            {userProjects.map((up, i) => (
                <ProjectPreview key={up._id || i} project={up} />
            ))}
        </div>
    );
}

export default UserProjectsView;
