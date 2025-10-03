// frontend/src/pages/MyProfile.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import PinnedProjects from "../components/PinnedProjects";
import FriendRequests from "../components/FriendRequests";
import UserFriends from "../components/UserFriends";

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
        const userIdToFetch = localStorage.getItem("userId");

        if (userIdToFetch) {
            fetchUserData(userIdToFetch);
        } else {
            setError('User ID not found. Please log in.');
            setLoading(false);
        }
    }, [localStorage.getItem("userId"), fetchUserData]); // Re-run if initial user ID changes

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


    return (
        <div id="profile">
            <div id="profileallpages">
                <div id="profileheader">
                    <div id="profileimagename">
                        <img width={"200px"} src={ptofileimage} alt="Profile" />
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
                <div onClick={gotohom}>Home Icon</div>
                <h3>Pinned Projects</h3>
                <PinnedProjects pinprojectIds={pinnedProjectNames} />

                <div className="tabs">
                    <h4 onClick={() => setActiveTab('details')} className={activeTab === 'details' ? "isActive" : "inactive"}>Details</h4>
                    <p>{" | "}</p>
                    <h4 onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? "isActive" : "inactive"}>Projects</h4>
                    <p>{" | "}</p>
                    <h4 onClick={() => setActiveTab('friendRequests')} className={activeTab === 'friendRequests' ? "isActive" : "inactive"}>Friend Requests</h4>
                </div>
            </div>
            <div id="info">
                {activeTab === 'details' && <ProfileText user={user} onedit={handleProfileSave} />}
                {activeTab === 'friends' && (<UserFriends userId={user._id} friendsList={user.friends} onFriendRemoved={handleFriendAction} isProjectContext={false}/>)}
                {activeTab === 'projects' && <UserProjectsView projectIds={userProjectNames} />}
                {activeTab === 'friendRequests' && <FriendRequests user={user} fetchUserData={fetchUserData} />} {/* New component */}
            </div>
        </div>
    );
}

export default MyProfile;