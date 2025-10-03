// frontend/src/pages/Projects.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
// import Project from "../components/Project"; // Assuming this is for a single project view via Outlet
import ProjectsList from "../components/ProjectsList";
import AddProject from "../components/AddProject";
import "../../public/assets/css/projects.css";

function Projects() {
    const [add, setAdd] = useState(false); // Renamed for consistency
    const [ownedProjects, setOwnedProjects] = useState([]);
    const [memberOfProjects, setMemberOfProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { username } = useParams();

    const currentUserId = localStorage.getItem('userId'); 
    console.log(currentUserId);

    const fetchUserProjects = useCallback(async () => {
        if (!currentUserId) {
            setError('User ID not found. Please log in.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/projects/${currentUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();

            if (result.success && result.projects) {
                setOwnedProjects(result.projects.ownedProjects || []);
                setMemberOfProjects(result.projects.memberOfProjects || []);
            } else {
                setError(result.message || 'Failed to fetch user projects.');
            }
        } catch (err) {
            console.error('Error fetching user projects:', err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        fetchUserProjects();
    }, [fetchUserProjects]);

    const handleAdd = () => {
        setAdd(true);
    };

    const cancelAdd = () => {
        setAdd(false);
    };

    const handleProjectAdded = (newProject) => {
        // Assuming the new project is owned by the current user
        setOwnedProjects(prev => [...prev, newProject]);
        setAdd(false); // Close the add project form
    };

    if (loading) {
        return <div className="projects">Loading projects...</div>;
    }

    if (error) {
        return <div className="projects" style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="projects">
            <div className="list">
                <button onClick={handleAdd}>Add Project</button>
                {add && <AddProject onCancel={cancelAdd} onProjectAdded={handleProjectAdded} ownerId={currentUserId} />}
                <ProjectsList ownedProjects={ownedProjects} memberOfProjects={memberOfProjects} />
            </div>
            <Outlet />
        </div>
    );
}

export default Projects;

//u23527685 18