// frontend/src/components/ProjectStatusFeed.js
import React, { useState, useEffect, useCallback } from 'react';

function ProjectStatusFeed({ projectId, activityFeedIds, ismember }) { // Changed props to IDs
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActivityFeed = useCallback(async () => {
        if (!activityFeedIds || activityFeedIds.length === 0) {
            setFeed([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {

            const response = await fetch('/api/project/feed', { // POST endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activityFeedIds) // Send array of IDs
            });
            const result = await response.json();

            if (result.success && result.activities) {
                setFeed(result.activities);
            } else {
                setError(result.message || 'Failed to fetch activity feed.');
            }
        } catch (err) {
            console.error('Error fetching activity feed:', err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    }, [activityFeedIds]);

    useEffect(() => {
        fetchActivityFeed();
    }, [fetchActivityFeed]);

    if (loading) {
        return <section><h2>Project Activity</h2><p>Loading activity feed...</p></section>;
    }

    if (error) {
        return <section><h2>Project Activity</h2><p style={{ color: 'red' }}>Error: {error}</p></section>;
    }

    return (
        <section>
            <h2>Project Activity</h2>
            {feed.length > 0 ? (
                <ul>
                    {feed.map((entry) => (
                        <li key={entry._id}>
                            <strong>{entry.userId}</strong> {entry.type} at {new Date(entry.createdAt).toLocaleString()}
                            <p>Message: {entry.message}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No activity yet.</p>
            )}
        </section>
    );
}

export default ProjectStatusFeed;