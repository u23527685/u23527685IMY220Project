import React, { useState, useEffect, useCallback } from 'react';
import FriendRequestItem from './FriendRequestItem';

function FriendRequests({ user, fetchUserData }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sentRequestsDetails, setSentRequestsDetails] = useState([]);
    const [receivedRequestsDetails, setReceivedRequestsDetails] = useState([]);

    // Function to fetch details for a list of user IDs
    const fetchUserDetails = useCallback(async (userIds) => {
        if (!userIds || userIds.length === 0) return [];

        const details = [];
        for (const id of userIds) {
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

    // Effect to fetch details of users in friend requests
    useEffect(() => {
        const loadRequestDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const sent = user?.friendRequestsSent || [];
                const received = user?.friendRequestsReceived || [];

                const [sentDetails, receivedDetails] = await Promise.all([
                    fetchUserDetails(sent),
                    fetchUserDetails(received)
                ]);

                setSentRequestsDetails(sentDetails);
                setReceivedRequestsDetails(receivedDetails);
            } catch (err) {
                setError(err.message || 'Failed to load friend request details.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadRequestDetails();
        }
    }, [user, fetchUserDetails]); // Re-run if user object changes

    const handleFriendRequestAction = async (otherUserId, actionType) => {
        if (!user?._id) {
            setError('Your user ID is missing.');
            return;
        }

        let endpoint = '';
        let method = 'POST';
        let body = {};

        switch (actionType) {
            case 'accept':
                endpoint = '/api/friends/accept';
                body = { senderId: otherUserId, receiverId: user._id };
                break;
            case 'decline':
                endpoint = '/api/friends/decline';
                body = { senderId: otherUserId, receiverId: user._id };
                break;
            case 'cancel': // For sent requests
                endpoint = '/api/friends/decline'; // Backend uses decline for both sender/receiver
                body = { senderId: user._id, receiverId: otherUserId }; // Sender is current user, receiver is other user
                break;
            default:
                setError('Invalid action type.');
                return;
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (result.success) {
                await fetchUserData(user._id);
            } else {
                setError(result.message || `Failed to ${actionType} friend request.`);
            }
        } catch (err) {
            console.error(`Error ${actionType} friend request:`, err);
            setError('Failed to connect to server.');
        }
    };

    if (loading) {
        return <div className="friend-requests">Loading friend requests...</div>;
    }

    if (error) {
        return <div className="friend-requests" style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="friend-requests">
            <h4>Received Requests ({receivedRequestsDetails.length})</h4>
            {receivedRequestsDetails.length > 0 ? (
                receivedRequestsDetails.map(req => (
                    <FriendRequestItem
                        key={req._id}
                        request={req}
                        type="received"
                        onAction={handleFriendRequestAction}
                        requesterId={user._id}
                    />
                ))
            ) : (
                <p>No new friend requests.</p>
            )}

            <h4>Sent Requests ({sentRequestsDetails.length})</h4>
            {sentRequestsDetails.length > 0 ? (
                sentRequestsDetails.map(req => (
                    <FriendRequestItem
                        key={req._id}
                        request={req}
                        type="sent"
                        onAction={handleFriendRequestAction}
                        requesterId={user._id}
                    />
                ))
            ) : (
                <p>No pending sent requests.</p>
            )}
        </div>
    );
}

export default FriendRequests;