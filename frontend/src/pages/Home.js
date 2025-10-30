import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import LocalFeed from "../components/LocalProjectFeed";
import GlobalFeed from "../components/GlobalProjectFeed";
import ProjectPreview from "../components/ProjectPreview";
import ProfilePreview from "../components/ProfilePreview";
import Filter from "../components/Filter";
import "../../public/assets/css/home.css"


// Wrapper to use hooks with class component
function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        return <Component {...props} location={location} navigate={navigate} />;
    }
    return ComponentWithRouterProp;
}

class Home extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            user: null,
            allProjects: [],
            localProjects: [],
            filter: false,
            local: true,
            global: false,
            isLoading: true,
            error: null,
            searchResults: null
        };
    }

    async componentDidMount() {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            console.warn("No userId found in sessionStorage. Redirecting...");
            this.props.navigate("/");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/user/${userId}`);
            const data = await response.json();

            if (!data.success || !data.user) {
                throw new Error("Failed to fetch user info");
            }

            // Save user to state and to session storage
            this.setState({ user: data.user }, () => {
                sessionStorage.setItem("user", JSON.stringify(data.user));
                this.fetchProjects();
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            this.props.navigate("/");
        }
    }

    fetchProjects = async () => {
        if (!this.state.user?._id) {
            this.props.navigate('/');
            return;
        }

        this.setState({ isLoading: true, error: null });
        
        try {
            const globalResponse = await fetch('http://localhost:3000/api/projects');
            const globalData = await globalResponse.json();
            
            if (!globalData.success) {
                throw new Error('Failed to load projects');
            }
            
            this.setState({ allProjects: globalData.projects || [] });

            const userProjectsResponse = await fetch(`http://localhost:3000/api/projects/${this.state.user._id}`);
            const userProjectsData = await userProjectsResponse.json();
            
            if (!userProjectsData.success) {
                throw new Error('Failed to load user projects');
            }

            const ownedProjects = userProjectsData.projects?.ownedProjects || [];
            const memberOfProjects = userProjectsData.projects?.memberOfProjects || [];

            const currentUserResponse = await fetch(`http://localhost:3000/api/user/${this.state.user._id}`);
            const currentUserData = await currentUserResponse.json();
            
            if (!currentUserData.success) {
                throw new Error('Failed to load user data');
            }

            const currentUser = currentUserData.user;
            const friendIds = currentUser.friends || [];
            const friendRequestsSentIds = currentUser.friendRequestsSent || [];
            
            const relevantUserIds = [...friendIds, ...friendRequestsSentIds];

            const friendsProjects = (globalData.projects || []).filter(project => 
                relevantUserIds.some(userId => {
                    const projectOwnerId = typeof project.owner === 'object' ? 
                        (project.owner.$oid || project.owner._id || project.owner.toString()) : 
                        project.owner;
                    const friendUserId = typeof userId === 'object' ? 
                        (userId.$oid || userId._id || userId.toString()) : 
                        userId;
                    return projectOwnerId.toString() === friendUserId.toString();
                })
            );

            const combinedLocalProjects = [
                ...ownedProjects,
                ...memberOfProjects,
                ...friendsProjects
            ];

            const uniqueLocalProjects = combinedLocalProjects.filter((project, index, self) => {
                const projectId = typeof project._id === 'object' ? 
                    (project._id.$oid || project._id.toString()) : 
                    project._id;
                return index === self.findIndex(p => {
                    const pId = typeof p._id === 'object' ? 
                        (p._id.$oid || p._id.toString()) : 
                        p._id;
                    return pId.toString() === projectId.toString();
                });
            });

            this.setState({ localProjects: uniqueLocalProjects });

        } catch (err) {
            console.error('Error fetching projects:', err);
            this.setState({ error: err.message || 'Network error. Please try again.' });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    onSearch = async (search) => {
    if (!search || search.trim().length < 2) {
        this.setState({ searchResults: null });
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(search)}`);
        const data = await response.json();

        if (data.success) {
            this.setState({ searchResults: data.results });
        } else {
            this.setState({ searchResults: null });
        }
    } catch (error) {
        console.error('Search error:', error);
        this.setState({ searchResults: null });
    }
};


    toggleLocal = () => {
        this.setState({ global: false, local: true });
    }

    toggleGlobal = () => {
        this.setState({ local: false, global: true });
    }

    toggleFilter = () => {
        this.setState(prevState => ({ filter: !prevState.filter }));
    }

    handleDownload = async (projectId) => {
        const { user } = this.state;

        if (!user?._id) {
            this.props.navigate("/");
            return;
        }

        try {
            // Get project files
            const filesResponse = await fetch(`http://localhost:3000/api/projects/${projectId}/files`);
            const filesData = await filesResponse.json();

            if (!filesData.success || !Array.isArray(filesData.files) || filesData.files.length === 0) {
                return;
            }

            // Download each file to user's computer
            for (const file of filesData.files) {
                const fileUrl = `http://localhost:3000${file.filePath}`;
                const fileName = file.fileName || 'file.txt';

                const response = await fetch(fileUrl);
                if (!response.ok) {
                    console.warn(`Failed to fetch file: ${fileUrl}`);
                    continue;
                }

                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            // Send activity to backend (track the download)
            const activityResponse = await fetch('http://localhost:3000/api/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: projectId,
                    userId: user._id,
                    type: 'download',
                    message: 'Project downloaded',
                    projectVersion: '1.0.0'
                })
            });

            const activityData = await activityResponse.json();
            if (activityData.success) {
                console.log('Download activity logged successfully');
            } else {
                console.error('Failed to log download activity:', activityData.message);
            }
        } catch (error) {
            console.error('Error during project download:', error);
        }
    };

    render() {
        const { user, allProjects, localProjects, filter, local, global, isLoading, error } = this.state;

        if (isLoading) {
            return (
                <main>
                    <h1>VEYO Home Page</h1>
                    <p>Loading projects...</p>
                </main>
            );
        }

        if (error) {
            return (
                <main>
                    <h1>VEYO Home Page</h1>
                    <p style={{ color: 'red' }}>{String(error)}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </main>
            );
        }

        return (
            <main>
                <h1>VEYO Home Page</h1>
                <div id="homeitems">
                    <div className="LocGlobchoose">
                        <h2 className={local ? "isActive" : "inactive"} onClick={this.toggleLocal}>Local</h2>
                        <h2>{" | "}</h2>
                        <h2 className={global ? "isActive" : "inactive"} onClick={this.toggleGlobal}>Global</h2>
                    </div>
                    <div id="searchfil">
                        <Search onsearch={this.onSearch} />
                        <button onClick={this.toggleFilter}>Filter</button>
                    </div>
                </div>
               
                <div id="out">
                    <div id="chosen-feed">
                        {local && <LocalFeed projects={localProjects} ondownload={this.handleDownload} user={user} />}
                        {global && <GlobalFeed projects={allProjects} ondownload={this.handleDownload} user={user} />}
                    </div>
                   
                    {filter && <Filter />}
                    {this.state.searchResults && (
                        <div className="search-results">
                            {/* USERS */}
                            {this.state.searchResults.users.length > 0 && (
                                <div>
                                    <h3>Users</h3>
                                    <ul>
                                        {this.state.searchResults.users.map((user,index) => (
                                            <ProfilePreview key={index} user={user} onAction={null}/>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* PROJECTS */}
                            {this.state.searchResults.projects.length > 0 && (
                                <div>
                                    <h3>Projects</h3>
                                    <ul>
                                        {this.state.searchResults.projects.map((project,index) => (
                                            //var projectId = typeof project._id === 'object' ? (project._id.$oid || project._id.toString()) : project._id;
                                            <ProjectPreview key={index} project={project} ondownload={null} user={user} />
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>
        );
    }
}

export default withRouter(Home);