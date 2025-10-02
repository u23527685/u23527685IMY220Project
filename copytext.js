import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Try to get user from location.state first, then from localStorage
    const [user, setUser] = useState(() => {
        if (location.state?.user) {
            return location.state.user;
        }
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const [allProjects, setAllProjects] = useState([]);
    const [localProjects, setLocalProjects] = useState([]);
    const [filter, setFilter] = useState(false);
    const [local, setLocal] = useState(true);
    const [global, setGlobal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user?._id) {
                navigate('/');
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const globalResponse = await fetch('http://localhost:3000/api/projects');
                const globalData = await globalResponse.json();
                
                if (!globalData.success) {
                    throw new Error('Failed to load projects');
                }
                
                setAllProjects(globalData.projects || []);

                const userProjectsResponse = await fetch(`http://localhost:3000/api/projects/${user._id}`);
                const userProjectsData = await userProjectsResponse.json();
                
                if (!userProjectsData.success) {
                    throw new Error('Failed to load user projects');
                }

                const ownedProjects = userProjectsData.projects?.ownedProjects || [];
                const memberOfProjects = userProjectsData.projects?.memberOfProjects || [];

                const currentUserResponse = await fetch(`http://localhost:3000/api/user/${user._id}`);
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

                setLocalProjects(uniqueLocalProjects);

            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message || 'Network error. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [user, navigate]);

    const onSearch = (search) => {
        console.log(search);
    };

    const toggleLocal = () => {
        setGlobal(false);
        setLocal(true);
    };

    const toggleGlobal = () => {
        setLocal(false);
        setGlobal(true);
    };

    const toggleFilter = () => {
        setFilter(!filter);
    };

    const handleDownload = async (projectId) => {
        if (!user?._id) {
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
                    userId: user._id,
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
    };

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
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </main>
        );
    }

    return (
        <main>
            <h1>Home Page</h1>
            <div id="homeitems">
                <div className="LocGlobchoose">
                    <h2 className={local ? "isActive" : "inactive"} onClick={toggleLocal}>Local</h2>
                    <h2>{" | "}</h2>
                    <h2 className={global ? "isActive" : "inactive"} onClick={toggleGlobal}>Global</h2>
                </div>
                <div id="searchfil">
                    <Search onsearch={onSearch} />
                    <button onClick={toggleFilter}>Filter</button>
                </div>
            </div>
           
            <div id="out">
                <div id="chosen feed">
                    {local && <LocalFeed projects={localProjects} ondownload={handleDownload} user={user} />}
                    {global && <GlobalFeed projects={allProjects} ondownload={handleDownload} user={user} />}
                </div>
               
                {filter && <Filter />}
            </div>
        </main>
    );
}

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

function GlobalFeed({ projects, ondownload, user }) {
    if (!projects || projects.length === 0) {
        return (
            <div className="feed">
                <p>No projects available.</p>
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

function ProjectPreview({ project, ondownload, user }) {
    const navigate = useNavigate();
    const [ownerUsername, setOwnerUsername] = useState('Loading...');

    useEffect(() => {
        const fetchOwner = async () => {
            if (project?.owner) {
                try {
                    const ownerId = typeof project.owner === 'object' ? 
                        (project.owner.$oid || project.owner._id || JSON.stringify(project.owner)) : 
                        project.owner;
                    
                    const response = await fetch(`http://localhost:3000/api/user/${ownerId}`);
                    const data = await response.json();
                    
                    if (data.success && data.user) {
                        setOwnerUsername(data.user.username || 'Unknown');
                    } else {
                        setOwnerUsername('Unknown');
                    }
                } catch (error) {
                    console.error('Error fetching owner:', error);
                    setOwnerUsername('Unknown');
                }
            }
        };

        fetchOwner();
    }, [project]);

    const download = () => {
        const projectId = typeof project._id === 'object' ? 
            (project._id.$oid || project._id.toString()) : 
            project._id;
        if (projectId && ondownload) {
            ondownload(projectId);
        }
    };

    const toproject = () => {
        const ownerId = typeof project.owner === 'object' ? 
            (project.owner.$oid || project.owner._id || project.owner.toString()) : 
            project.owner;
        const projectName = project.name || 'unnamed';
        navigate(`/project/${projectName}/${ownerId}`, { state: { project, user } });
    };

    return (
        <div className="projectprev">
            <div className="usernameshow">
                <div className="userName">{String(ownerUsername)}</div>
            </div>
            <div className="projectinf">
                <p onClick={toproject} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    {String(project.name || 'Unnamed Project')}
                </p>
                <p>{String(project.description || '')}</p>
                <div>
                    {Array.isArray(project.hashtags) && project.hashtags.map((tag, i) => (
                        <span key={i} style={{ marginRight: '8px', color: '#007bff' }}>
                            #{String(tag)}
                        </span>
                    ))}
                </div>
                <div style={{ marginTop: '8px' }}>
                    {ondownload && <button onClick={download}>Download</button>}
                    <span style={{ marginLeft: '12px' }}>
                        {Array.isArray(project.activityFeed) ? project.activityFeed.length : 0} Activities
                    </span>
                </div>
            </div>
        </div>
    );
}

function Search({ onsearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onsearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
            />
            <button type="submit">Search</button>
        </form>
    );
}

function Filter() {
    return (
        <div className="filter">
            <h3>Filters</h3>
            <p>Filter options coming soon...</p>
        </div>
    );
}

export { Home, LocalFeed, GlobalFeed, ProjectPreview, Search, Filter };