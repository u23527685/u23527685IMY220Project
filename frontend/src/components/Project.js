// frontend/src/components/Project.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProjectCheckInOut from "./ProjectCheckinout"; // Assuming this component is self-contained
import ProjectDiscussion from "./ProjectDiscussion";
import ProjectFiles from "./ProjectFiles";
import ProjectStatusFeed from "./ProjectStatusFeed";
import ProjectDetails from "./ProjectDetails";
import ProjectMembers from './ProjectMemebers.js';
import "../../public/assets/css/projectinfo.css";

function Project() {
    const { projectId } = useParams(); // Get projectId from URL params
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserId = localStorage.getItem('userId'); // Get the logged-in user's ID

    const fetchProjectData = useCallback(async () => {
        if (!projectId) {
            setError('Project ID is missing.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {

            const response = await fetch(`/ap/project/${projectId}`, { // Your API endpoint
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            if (result.success && result.project) {
                setProject(result.project);
            } else {
                setError(result.message || 'Failed to fetch project data.');
                setProject(null);
            }
        } catch (err) {
            console.error('Error fetching project data:', err);
            setError(err.message || 'Failed to connect to server.');
            setProject(null);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    if (loading) {
        return <div id="projinfo">Loading project...</div>;
    }

    if (error) {
        return <div id="projinfo" style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!project) {
        return <div id="projinfo">Project not found.</div>;
    }

    const isOwner = project.owner === currentUserId; // Check if current user is the project owner

    return (
        <div id="projinfo">
            <h1>Project System</h1>

            <div className="project-section">
                <ProjectDetails project={project} isOwner={isOwner} onProjectUpdated={fetchProjectData} />
            </div>

            <div className="project-section">
                <ProjectStatusFeed projectId={project._id} activityFeedIds={project.activityFeed} />
            </div>

            <div className="project-section">
                <ProjectFiles files={project.files} />
            </div>

            <div className="project-section">
                <ProjectMembers
                    ownerId={project.owner}
                    memberIds={project.members}
                    isOwner={isOwner}
                    onMembersUpdated={fetchProjectData} // Callback to refetch project data
                />
            </div>

            <div className="project-section">
                <ProjectDiscussion
                    projectId={project._id}
                    discussionIds={project.discussionBoard}
                    currentUserId={currentUserId}
                />
            </div>

            <div className="project-section">
                <ProjectCheckInOut /> {/* Assuming this component is self-contained */}
            </div>
        </div>
    );
}

export default Project;
