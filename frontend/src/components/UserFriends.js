// frontend/src/components/UserFriends.js
import React, { useState, useEffect, useCallback } from 'react';
import "../../public/assets/css/profilepreview.css";

function UserFriends({ userId, friendsList, onFriendRemoved, onAddFriendToProject, isProjectContext = false, currentProjectMembers = [] }) {
    const [friendsDetails, setFriendsDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [selectedFriendsForProject, setSelectedFriendsForProject] = useState(new Set(currentProjectMembers.map(m => m._id || m.toString()))); // For project context

    // Function to fetch details for a list of user IDs
    const fetchUserDetails = useCallback(async (ids) => {
        if (!ids || ids.length === 0) return [];

        const details = [];
        for (const id of ids) {
            try {
                const response = await fetch(`/api/user/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (result.success && result.user) {
                    details.push(result.user);
                } else {
                    console.warn(`Failed to fetch details for user ${id}: ${result.message}`);
                }
            } catch (err) {
                console.error(`Error fetching details for user ${id}:`, err);
            }
        }
        return details;
    }, []);

    // Effect to fetch details of friends
    useEffect(() => {
        const loadFriendsDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const details = await fetchUserDetails(friendsList);
                setFriendsDetails(details);
            } catch (err) {
                setError(err.message || 'Failed to load friends details.');
            } finally {
                setLoading(false);
            }
        };

        if (friendsList && friendsList.length > 0) {
            loadFriendsDetails();
        } else {
            setFriendsDetails([]);
            setLoading(false);
        }
    }, [friendsList, fetchUserDetails]);

    // Handle removing a friend
    const handleRemoveFriend = async (friendId) => {
        if (!window.confirm(`Are you sure you want to remove this friend?`)) return;
        if (!userId) {
            setError('Your user ID is missing.');
            return;
        }

        try {
            const response = await fetch('/api/friends/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId, friendId: friendId })
            });

            const result = await response.json();

            if (result.success) {
                // Notify parent to refetch user data
                onFriendRemoved();
            } else {
                setError(result.message || 'Failed to remove friend.');
            }
        } catch (err) {
            console.error('Error removing friend:', err);
            setError('Failed to connect to server.');
        }
    };

    // Handle searching for new friends
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length < 3) {
            setSearchResults([]);
            return;
        }
        // Debounce search if needed
        const timer = setTimeout(() => performSearch(e.target.value), 500);
        return () => clearTimeout(timer);
    };

    const performSearch = useCallback(async (term) => {
        if (term.length < 3) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        setSearchError(null);
        try {

            // Assuming you have a backend endpoint for searching users by username
            // This endpoint is NOT in your current API, so you'd need to add it.
            // For now, I'll simulate or assume a simple search.
            // Example: GET /api/users/search?q=searchTerm
            const response = await fetch(`/api/users/search?q=${term}`);
            const result = await response.json();

            if (result.success && result.users) {
                // Filter out current user and existing friends
                const filteredResults = result.users.filter(u =>
                    u._id !== userId && !friendsList.includes(u._id)
                );
                setSearchResults(filteredResults);
            } else {
                setSearchError(result.message || 'Failed to search users.');
            }
        } catch (err) {
            console.error('Error searching users:', err);
            setSearchError(err.message || 'Failed to connect to server for search.');
        } finally {
            setSearchLoading(false);
        }
    }, [userId, friendsList]);

    useEffect(() => {
        const handler = setTimeout(() => {
            performSearch(searchTerm);
        }, 500); // Debounce search

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, performSearch]);


    // Handle sending a friend request
    const handleSendFriendRequest = async (receiverId) => {
        if (!userId) {
            setError('Your user ID is missing.');
            return;
        }

        try {
            const response = await fetch('/api/friends/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ senderId: userId, receiverId: receiverId })
            });

            const result = await response.json();

            if (result.success) {
                setSearchTerm(''); // Clear search
                setSearchResults([]);
                onFriendRemoved(); // Trigger refetch of user data to update sent requests
            } else {
                setError(result.message || 'Failed to send friend request.');
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
            setError('Failed to connect to server.');
        }
    };

    const toggleFriendForProject = (friendId) => {
        setSelectedFriendsForProject(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(friendId)) {
                newSelection.delete(friendId);
            } else {
                newSelection.add(friendId);
            }
            // Immediately call the parent handler to update project members
            if (onAddFriendToProject) {
                onAddFriendToProject(Array.from(newSelection));
            }
            return newSelection;
        });
    };

    if (loading) {
        return <div className="user-friends">Loading friends...</div>;
    }

    if (error) {
        return <div className="user-friends" style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="user-friends">
            {!isProjectContext && (
                <>
                    <h4>Find New Friends</h4>
                    <div className="friend-search">
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {searchLoading && <p>Searching...</p>}
                        {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
                        <div className="search-results">
                            {searchResults.map(user => (
                                <div key={user._id} className="profile-card">
                                    <span>{user.username}</span>
                                    <button onClick={() => handleSendFriendRequest(user._id)}>Add Friend</button>
                                </div>
                            ))}
                            {searchTerm.length >= 3 && !searchLoading && searchResults.length === 0 && <p>No users found.</p>}
                        </div>
                    </div>
                </>
            )}

            <h4>{isProjectContext ? "Select Project Members" : "My Friends"} ({friendsDetails.length})</h4>
            {friendsDetails.length > 0 ? (
                <div>
                    {friendsDetails.map(friend => (
                        <div key={friend._id} className="profile-card">
                            <span>{friend.username}</span>
                            {isProjectContext ? (
                                <input
                                    type="checkbox"
                                    checked={selectedFriendsForProject.has(friend._id)}
                                    onChange={() => toggleFriendForProject(friend._id)}
                                />
                            ) : (
                                <button onClick={() => handleRemoveFriend(friend._id)}>Remove</button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no friends yet. Start by searching for some!</p>
            )}
        </div>
    );
}

export default UserFriends;
