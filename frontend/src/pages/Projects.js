// frontend/src/pages/Projects.js
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import ProjectsList from "../components/ProjectsList";
import AddProject from "../components/AddProject";
import "../../public/assets/css/projects.css";

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            add: false,
            ownedProjects: [],
            memberOfProjects: [],
            loading: true,
            error: null,
            redirectToLogin: false,
        };

        this.currentUserId = sessionStorage.getItem('userId');
    }

    componentDidMount() {
        if (!this.currentUserId) {
            this.setState({ redirectToLogin: true });
            return;
        }

        this.fetchUserProjects();
    }

    fetchUserProjects = async () => {
        this.setState({ loading: true, error: null });

        try {
            const response = await fetch(`/api/projects/${this.currentUserId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.success && result.projects) {
                this.setState({
                    ownedProjects: result.projects.ownedProjects || [],
                    memberOfProjects: result.projects.memberOfProjects || [],
                });
            } else {
                this.setState({ error: result.message || 'Failed to fetch user projects.' });
            }
        } catch (err) {
            console.error('Error fetching user projects:', err);
            this.setState({ error: err.message || 'Failed to connect to server.' });
        } finally {
            this.setState({ loading: false });
        }
    }

    handleAdd = () => this.setState({ add: true });
    cancelAdd = () => this.setState({ add: false });

    handleProjectAdded = (newProject) => {
        this.setState(prevState => ({
            ownedProjects: [...prevState.ownedProjects, newProject],
            add: false,
        }));
    }

    render() {
        const { add, ownedProjects, memberOfProjects, loading, error, redirectToLogin } = this.state;

        if (redirectToLogin) return <Navigate to="/login" replace={true} />;

        if (loading) return <div className="projects">Loading projects...</div>;
        if (error) return <div className="projects" style={{ color: 'red' }}>Error: {error}</div>;

        return (
            <div className="projects">
                <h1>My Projects</h1>
                <div className="list">
                    <button onClick={this.handleAdd}>Add Project</button>
                    {add && <AddProject onCancel={this.cancelAdd} onProjectAdded={this.handleProjectAdded} ownerId={this.currentUserId} />}
                    <ProjectsList ownedProjects={ownedProjects} memberOfProjects={memberOfProjects} />
                </div>
            </div>
        );
    }
}

export default Projects;
//u23527685 18