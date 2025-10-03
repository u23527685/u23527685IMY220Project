import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import LocalFeed from "../components/LocalProjectFeed";
import GlobalFeed from "../components/GlobalProjectFeed";
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
        
        let user = null;
        try {
            if (props.location.state?.user) {
                user = props.location.state.user;
            } else {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    user = JSON.parse(storedUser);
                }
            }
            localStorage.setItem("userId",user._id);
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
        
        this.state = {
            user: user,
            allProjects: [],
            localProjects: [],
            filter: false,
            local: true,
            global: false,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchProjects();
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

    onSearch = (search) => {
        console.log('Search term:', search);
    }

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
        if (!this.state.user?._id) {
            alert('Please login to download projects');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: projectId,
                    userId: this.state.user._id,
                    type: 'download',
                    message: 'Project downloaded',
                    projectVersion: '1.0.0'
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('Download tracked successfully');
                alert('Download started!');
            } else {
                console.error('Failed to track download:', data.message);
            }
        } catch (error) {
            console.error('Error tracking download:', error);
        }
    }

    render() {
        const { user, allProjects, localProjects, filter, local, global, isLoading, error } = this.state;

        if (isLoading) {
            return (
                <main>
                    <h1>Home Page</h1>
                    <p>Loading projects...</p>
                </main>
            );
        }

        if (error) {
            return (
                <main>
                    <h1>Home Page</h1>
                    <p style={{ color: 'red' }}>{String(error)}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </main>
            );
        }

        return (
            <main>
                <h1>Home Page</h1>
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
                </div>
            </main>
        );
    }
}

export default withRouter(Home);