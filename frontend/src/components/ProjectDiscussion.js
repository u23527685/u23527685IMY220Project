// frontend/src/components/ProjectDiscussion.js
import React, { useState, useEffect, useCallback } from 'react';
import "../../public/assets/css/projectdiscussion.css";

function ProjectDiscussion({ projectId, discussionIds, currentUserId, ismember }) { // Changed props to IDs
    const [discussion, setDiscussion] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postLoading, setPostLoading] = useState(false);
    const [postError, setPostError] = useState(null);

    const fetchDiscussion = useCallback(async () => {
        if (!discussionIds || discussionIds.length === 0) {
            setDiscussion([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {

            const response = await fetch('/api/project/discussions', { // POST endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(discussionIds) // Send array of IDs
            });
            const result = await response.json();

            if (result.success && result.discussions) {
                // Fetch user details for each discussion entry
                const discussionsWithUsers = await Promise.all(result.discussions.map(async (disc) => {
                    const userResponse = await fetch(`/api/user/${disc.userId}`);
                    const userResult = await userResponse.json();
                    return { ...disc, username: userResult.success ? userResult.user.username : 'Unknown User' };
                }));
                setDiscussion(discussionsWithUsers);
            } else {
                setError(result.message || 'Failed to fetch discussion.');
            }
        } catch (err) {
            console.error('Error fetching discussion:', err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    }, [discussionIds]);

    useEffect(() => {
        fetchDiscussion();
    }, [fetchDiscussion]);

    const handlePostMessage = async (event) => {
        event.preventDefault();
        setPostLoading(true);
        setPostError(null);

        if (!newMessage.trim()) {
            setPostError('Message cannot be empty.');
            setPostLoading(false);
            return;
        }
        if (!projectId || !currentUserId) {
            setPostError('Project or user ID missing.');
            setPostLoading(false);
            return;
        }

        try {

            const response = await fetch('/api/discussion', { // POST endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectId: projectId,
                    userId: currentUserId,
                    message: newMessage
                })
            });
            const result = await response.json();

            if (result.success) {
                setNewMessage('');
                await fetchDiscussion(); // Refetch discussion to show new message
            } else {
                setPostError(result.message || 'Failed to post message.');
            }
        } catch (err) {
            console.error('Error posting message:', err);
            setPostError(err.message || 'Failed to connect to server.');
        } finally {
            setPostLoading(false);
        }
    };

    if (loading) {
        return <section><h2>Project Discussion</h2><p>Loading discussion...</p></section>;
    }

    if (error) {
        return <section><h2>Project Discussion</h2><p style={{ color: 'red' }}>Error: {error}</p></section>;
    }

    return (
        <section>
            <h2>Project Discussion</h2>
            {discussion.length > 0 ? (
                <ul>
                    {discussion.map((entry) => (
                        <li key={entry._id}>
                            <strong>{entry.username}</strong> at {new Date(entry.createdAt).toLocaleString()}
                            <p>{entry.message}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No discussion yet. Be the first to post!</p>
            )}
            { ismember && <form onSubmit={handlePostMessage}>
                <label htmlFor="newMessage">Add Message</label>
                <textarea
                    id="newMessage"
                    name="newMessage"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={postLoading}
                />
                {postError && <p style={{ color: 'red' }}>{postError}</p>}
                <button type="submit" disabled={postLoading}>
                    {postLoading ? 'Posting...' : 'Post'}
                </button>
            </form>}
        </section>
    );
}

export default ProjectDiscussion;