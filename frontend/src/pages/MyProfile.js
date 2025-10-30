// frontend/src/pages/MyProfile.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import PinnedProjects from "../components/PinnedProjects";
import FriendRequests from "../components/FriendRequests";
import UserFriends from "../components/UserFriends";
import ProfileImage from "../components/ProfileImage";

import ptofileimage from "../../public/assets/svg/default user.svg";
import "../../public/assets/css/profile.css";

function MyProfile() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null); // State to hold the fetched user data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tab states
    const [activeTab, setActiveTab] = useState('details');

    // Add near top of MyProfile.js, below imports
    const pinProject = async (userId, projectId) => {
    try {
        const response = await fetch(`/api/users/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({userId:userId,projectId:projectId})
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        fetch(userId);
        return true;
    } catch (error) {
        console.error("Error pinning project:", error);
        return false;
    }
    };

    const saveProject = async (userId, projectId) => {
    try {
        const response = await fetch(`/api/users/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({userId:userId,projectId:projectId})
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        fetchUserData(userId);
        return true;
    } catch (error) {
        console.error("Error saving project:", error);
        return false;
    }
    };


    // Function to fetch user data from the API
    const fetchUserData = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            if (!userId) {
                throw new Error('User ID is missing.');
            }

            const response = await fetch(`/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (result.success) {
                setUser(result.user);
            } else {
                setError(result.message || 'Failed to fetch user data.');
                setUser(null); // Clear user data on error
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message || 'Failed to connect to server.');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to fetch user data on component mount or if initialUserFromState changes
    useEffect(() => {
        const userIdToFetch = sessionStorage.getItem("userId");

        if (userIdToFetch) {
            fetchUserData(userIdToFetch);
        } else {
            setError('User ID not found. Please log in.');
            setLoading(false);
        }
    }, [sessionStorage.getItem("userId"), fetchUserData]); // Re-run if initial user ID changes

    // Callback for when EditProfile saves changes
    const handleProfileSave = useCallback(async (updatedFormData) => {
        if (user?._id) {
            await fetchUserData(user._id);
        }
    }, [user?._id, fetchUserData]);

    const handleFriendAction = useCallback(async () => {
        if (user?._id) {
            await fetchUserData(user._id);
        }
    }, [user?._id, fetchUserData]);

    const gotohom = () => {
        navigate('/home');
    };

    if (loading) {
        return <div id="profile">Loading profile...</div>;
    }

    if (error) {
        return <div id="profile" style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!user) {
        return <div id="profile">No user data available. Please log in.</div>;
    }

    // Prepare project names for UserProjectsView
    const userProjectNames = user ? [
        ...(user.ownedProjects || []),
        ...(user.memberOfProjects || [])
    ] : [];

    // Prepare pinned projects for PinnedProjects
    const pinnedProjectNames = user?.pinnedProjects || [];

    const savedProjects= user?.savedProjects || [];

    const handleLogout=()=>{
        sessionStorage.clear();
        navigate("/");
    }


    return (
        <div id="profile">
            <h1>VEYO My Profile</h1>
            <div id="profileallpages">
                <div id="profileheader">
                    <div id="profileimagename">
                        <ProfileImage userId={user._id} />
                        <div id="username">{user.username}</div>
                    </div>
                    <p id="followersspan">
                        <span
                            onClick={() => setActiveTab('friends')}
                            className={activeTab === 'friends' ? "isActive" : "inactive"}
                        >
                            {(user.friends || []).length} friends
                        </span>
                    </p>
                </div>
                <h3>Pinned Projects</h3>
                <PinnedProjects pinprojectIds={pinnedProjectNames} />

                <div className="tabs">
                    <h5 onClick={() => setActiveTab('details')} className={activeTab === 'details' ? "isActive" : "inactive"}>Details</h5>
                    <p>{" | "}</p>
                    <h5 onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? "isActive" : "inactive"}>Projects</h5>
                    <p>{" | "}</p>
                    <h5 onClick={() => setActiveTab('savedProjects')} className={activeTab === 'savedProjects' ? "isActive" : "inactive"}>Saved Projects</h5>
                    <p>{" | "}</p>
                    <h5 onClick={() => setActiveTab('friendRequests')} className={activeTab === 'friendRequests' ? "isActive" : "inactive"}>Friend Requests</h5>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <div id="info">
                {activeTab === 'details' && <ProfileText user={user} onedit={handleProfileSave} />}
                {activeTab === 'friends' && (<UserFriends userId={user._id} friendsList={user.friends} onFriendRemoved={handleFriendAction} isProjectContext={false}/>)}
                {activeTab === 'projects' && <UserProjectsView user={user} projectIds={userProjectNames} pin={pinProject} save={saveProject} />}
                {activeTab === 'savedProjects' && <UserProjectsView user={user} pin={pinProject} save={saveProject} projectIds={savedProjects} />}
                {activeTab === 'friendRequests' && <FriendRequests user={user} fetchUserData={fetchUserData} />} {/* New component */}
            </div>
        </div>
    );
}

export default MyProfile;