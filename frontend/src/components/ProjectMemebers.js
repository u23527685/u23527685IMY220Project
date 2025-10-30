// frontend/src/components/ProjectMembers.js
import React, { useState, useEffect, useCallback } from 'react';
import "../../public/assets/css/projectmembers.css";

function ProjectMembers({ ownerId, memberIds, isOwner, onMembersUpdated }) { 
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [memberDetails, setMemberDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserDetails = useCallback(async (ids) => {
        const idArray = Array.isArray(ids) ? ids : [ids];
        if (!idArray || idArray.length === 0) return [];

        const details = [];
        for (const id of idArray) {
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

    useEffect(() => {
        const loadMembers = async () => {
            setLoading(true);
            setError(null);
            try {
                const owner = await fetchUserDetails(ownerId);
                setOwnerDetails(owner[0] || null);

                const members = await fetchUserDetails(memberIds);
                setMemberDetails(members);
            } catch (err) {
                setError(err.message || 'Failed to load member details.');
            } finally {
                setLoading(false);
            }
        };
        loadMembers();
    }, [ownerId, memberIds, fetchUserDetails]);

    // TODO: Implement remove member and give ownership functionality
    const handleRemoveMember = (memberId) => {
        // Requires new backend endpoint: DELETE /api/project/:projectId/members/:memberId
        // After successful API call, call onMembersUpdated()
    };

    const handleGiveOwnership = (memberId) => {
        // Requires new backend endpoint: PUT /api/project/:projectId/owner
        // After successful API call, call onMembersUpdated()
    };

    if (loading) {
        return <section><h2>Project Members</h2><p>Loading members...</p></section>;
    }

    if (error) {
        return <section><h2>Project Members</h2><p style={{ color: 'red' }}>Error: {error}</p></section>;
    }

    return (
        <section>
            <h2>Project Members</h2>
            <p><strong>Owner:</strong> {ownerDetails?.username || 'N/A'}</p>
            {memberDetails.length > 0 ? (
                <ul>
                    {memberDetails.map((member) => (
                        <li key={member._id}>
                            {member.username}
                            {isOwner && ( // Only owner can manage members
                                <>
                                    <button onClick={() => handleRemoveMember(member._id)}>Remove</button>
                                    <button onClick={() => handleGiveOwnership(member._id)}>Give Ownership</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No additional members.</p>
            )}
        </section>
    );
}

export default ProjectMembers;

