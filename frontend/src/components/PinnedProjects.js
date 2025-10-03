import React, { useState, useEffect } from "react";
import ProjectPreview from "./ProjectPreview";

function PinnedProjects({ pinprojectIds }) { // Changed prop name to reflect it's IDs
    const [pinnedProjects, setPinnedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPinnedProjects = async () => {
            if (!pinprojectIds || pinprojectIds.length === 0) {
                setPinnedProjects([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {

                // Fetch each project individually or create a batch API if available
                // For simplicity, we'll fetch them one by one. A batch endpoint would be better.
                const fetchedProjects = [];
                for (const projectId of pinprojectIds) {
                    const response = await fetch(`/ap/project/${projectId}`, { // Note: your API is /ap/project/:projectId
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    const result = await response.json();
                    if (result.success && result.project) {
                        fetchedProjects.push(result.project);
                    } else {
                        console.warn(`Failed to fetch pinned project ${projectId}: ${result.message}`);
                    }
                }
                setPinnedProjects(fetchedProjects);
            } catch (err) {
                console.error('Error fetching pinned projects:', err);
                setError(err.message || 'Failed to fetch pinned projects.');
            } finally {
                setLoading(false);
            }
        };

        fetchPinnedProjects();
    }, [pinprojectIds]); // Re-run when the list of pinned project IDs changes

    if (loading) {
        return <div className="pinned">Loading pinned projects...</div>;
    }

    if (error) {
        return <div className="pinned" style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (pinnedProjects.length === 0) {
        return <div className="pinned">No pinned projects.</div>;
    }

    return (
        <div className="pinned">
            {pinnedProjects.map((pp, i) => (
                <ProjectPreview key={pp._id || i} project={pp} />
            ))}
        </div>
    );
}

export default PinnedProjects;