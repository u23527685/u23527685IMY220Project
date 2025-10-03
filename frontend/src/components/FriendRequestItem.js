import React, { useState } from 'react';

function FriendRequestItem({ request, type, onAction, requesterId }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAction = async (actionType) => {
        setLoading(true);
        setError(null);
        try {
            await onAction(request._id, actionType); // request._id is the other user's ID
        } catch (err) {
            setError(err.message || 'Failed to perform action.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="friend-request-item">
            <span>{request.username}</span> {/* Assuming request object has username */}
            {type === 'received' && (
                <div className="actions">
                    <button onClick={() => handleAction('accept')} disabled={loading}>
                        {loading ? 'Accepting...' : 'Accept'}
                    </button>
                    <button onClick={() => handleAction('decline')} disabled={loading}>
                        {loading ? 'Declining...' : 'Decline'}
                    </button>
                </div>
            )}
            {type === 'sent' && (
                <div className="actions">
                    <button onClick={() => handleAction('cancel')} disabled={loading}>
                        {loading ? 'Cancelling...' : 'Cancel Request'}
                    </button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default FriendRequestItem;