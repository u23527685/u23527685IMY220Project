// frontend/src/pages/OtherProfile.js
import React, { useState, useEffect, useCallback } from "react";
import PinnedProjects from "../components/PinnedProjects";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import { useNavigate,useParams  } from "react-router-dom"; // useParams is no longer needed
import "../../public/assets/css/otherprofile.css";
import ptofileimage from "../../public/assets/svg/default user.svg";

// OtherProfile now accepts id via parameter
function OtherProfile() {
    const navigate = useNavigate();
     const { userId: otherUserId } = useParams();

    const [user, setUser] = useState(null); // The profile being viewed
    const [currentUser, setCurrentUser] = useState(null); // The logged-in user
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendRequestStatus, setFriendRequestStatus] = useState('none'); // 'none', 'sent', 'received', 'friends'

    const [details, setDetails] = useState(true);
    const [projectstab, setProjectsTab] = useState(false);

    const loggedInUserId = localStorage.getItem('userId'); // Get the ID of the currently logged-in user

    // Fetch the profile user's data using the provided otherUserId prop
    const fetchProfileUser = useCallback(async () => {
        if (!otherUserId) {
            setError('Other user ID is missing.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {

            const response = await fetch(`/api/user/${otherUserId}`, { // Using the /api/user/:userid endpoint
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            if (result.success && result.user) {
                setUser(result.user);
            } else {
                setError(result.message || 'Failed to fetch user data.');
                setUser(null);
            }
        } catch (err) {
            console.error('Error fetching profile user data:', err);
            setError(err.message || 'Failed to connect to server.');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [otherUserId]); // Dependency on otherUserId prop

    // Fetch the currently logged-in user's data (needed for friend status)
    const fetchCurrentUser = useCallback(async () => {
        if (!loggedInUserId) {
            setCurrentUser(null);
            return;
        }
        try {
            const response = await fetch(`/api/user/${loggedInUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.success && result.user) {
                setCurrentUser(result.user);
            } else {
                console.error('Failed to fetch current user data:', result.message);
                setCurrentUser(null);
            }
        } catch (err) {
            console.error('Error fetching current user data:', err);
            setCurrentUser(null);
        }
    }, [loggedInUserId]);

    // Effect to fetch both users and determine friend status
    useEffect(() => {
        fetchProfileUser();
        fetchCurrentUser();
    }, [fetchProfileUser, fetchCurrentUser]);

    // Determine friend request status whenever user or currentUser changes
    useEffect(() => {
        if (user && currentUser) {
            if (currentUser.friends?.includes(user._id)) {
                setFriendRequestStatus('friends');
            } else if (currentUser.friendRequestsSent?.includes(user._id)) {
                setFriendRequestStatus('sent');
            } else if (currentUser.friendRequestsReceived?.includes(user._id)) {
                setFriendRequestStatus('received');
            } else {
                setFriendRequestStatus('none');
            }
        } else {
            setFriendRequestStatus('none');
        }
    }, [user, currentUser]);

    const handleFriendAction = async (actionType) => {
        if (!loggedInUserId || !user?._id) {
            setError('User IDs missing for friend action.');
            return;
        }

        let endpoint = '';
        let body = {};

        switch (actionType) {
            case 'send':
                endpoint = '/api/friends/request';
                body = { senderId: loggedInUserId, receiverId: user._id };
                break;
            case 'accept':
                endpoint = '/api/friends/accept';
                body = { senderId: user._id, receiverId: loggedInUserId };
                break;
            case 'decline':
                endpoint = '/api/friends/decline';
                body = { senderId: user._id, receiverId: loggedInUserId };
                break;
            case 'cancel': // Current user cancels their sent request
                endpoint = '/api/friends/decline';
                body = { senderId: loggedInUserId, receiverId: user._id };
                break;
            case 'remove':
                endpoint = '/api/friends/remove';
                body = { userId: loggedInUserId, friendId: user._id };
                break;
            default:
                setError('Invalid friend action.');
                return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const result = await response.json();

            if (result.success) {
                // Refetch both users to update their friend status
                await fetchProfileUser();
                await fetchCurrentUser();
            } else {
                setError(result.message || `Failed to ${actionType} friend request.`);
            }
        } catch (err) {
            console.error(`Error ${actionType} friend request:`, err);
            setError('Failed to connect to server.');
        }
    };

    const userProjectIds = user ? [
        ...(user.ownedProjects || []),
        ...(user.memberOfProjects || [])
    ] : [];

    const pinnedProjectIds = user?.pinnedProjects || [];

    const toggleDetails = () => {
        setProjectsTab(false);
        setDetails(true);
    };
    const toggleProjects = () => {
        setDetails(false);
        setProjectsTab(true);
    };
    const gotohome = () => navigate('/home');

    if (loading) {
        return <div id="otherprofile">Loading profile...</div>;
    }

    if (error) {
        return <div id="otherprofile" style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!user) {
        return <div id="otherprofile">User not found.</div>;
    }

    const isCurrentUserProfile = loggedInUserId === user._id;

    return (
        <div id="otherprofile">
            <h1>VEYO Profile</h1>
            <div id="otherprofile-sidebar">
                <div id="otherprofile-header">
                    <div id="otherprofile-image-name">
                        <img width="200px" src={ptofileimage} alt="User Profile" />
                        <div id="otherprofile-username">{user.username}</div>
                    </div>
                    <p id="otherprofile-followers">
                        <span>{(user.friends || []).length} friends</span>
                    </p>
                    {!isCurrentUserProfile && (
                        <div className="friend-action-buttons">
                            {friendRequestStatus === 'none' && (
                                <button onClick={() => handleFriendAction('send')}>Send Friend Request</button>
                            )}
                            {friendRequestStatus === 'sent' && (
                                <button onClick={() => handleFriendAction('cancel')}>Cancel Request</button>
                            )}
                            {friendRequestStatus === 'received' && (
                                <>
                                    <button onClick={() => handleFriendAction('accept')}>Accept Request</button>
                                    <button onClick={() => handleFriendAction('decline')}>Decline Request</button>
                                </>
                            )}
                            {friendRequestStatus === 'friends' && (
                                <button onClick={() => handleFriendAction('remove')}>Remove Friend</button>
                            )}
                        </div>
                    )}
                </div>

                <div className="otherprofile-home-icon" onClick={gotohome}>Home Icon</div>

                <h3>Pinned Projects</h3>
                <PinnedProjects pinprojectIds={pinnedProjectIds} />

                <div className="otherprofile-tabs">
                    <h4 onClick={toggleDetails} className={details ? "isActive" : "inactive"}>Details</h4>
                    <span>{" | "}</span>
                    <h4 onClick={toggleProjects} className={projectstab ? "isActive" : "inactive"}>Projects</h4>
                </div>
            </div>

            <div id="otherprofile-info">
                {details && <ProfileText user={user} isReadOnly={true} />}
                {projectstab && <UserProjectsView projectIds={userProjectIds} />}
            </div>
        </div>
    );
}

export default OtherProfile;

//23527685 18