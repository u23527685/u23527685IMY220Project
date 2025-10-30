// frontend/src/components/ProjectMembers.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../public/assets/css/projectmembers.css";
import Search from "./Search";

function ProjectMembers({ ownerId, memberIds,onPromoteMember, isOwner, onMembersUpdated,onadd }) { 
    const navigate=useNavigate();
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [memberDetails, setMemberDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showSearch, setShowSearch] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

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

    const onSearch = async (search) => {
        if (!search || search.trim().length < 2) {
            setSearchResults(null);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(search)}`);
            const data = await response.json();

            if (data.success) {
                setSearchResults(data.results);
            } else {
                setSearchResults(null);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults(null);
        }
    };

    const ToggleSearch =()=>{
        if(showSearch)
            setShowSearch(false);
        else
            setShowSearch(true);
        console.log(showSearch);
    }

    const handlePromoteMember = async (memberId) => {
        if (!onPromoteMember) return;
        const confirmPromote = true;
        if (confirmPromote) {
            await onPromoteMember(memberId);
            await onMembersUpdated();
            navigate("/home");
        }
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
            { isOwner && <button onClick={ToggleSearch} >Add member</button>}
            {isOwner && showSearch && <Search onsearch={onSearch}/>}
            {isOwner && searchResults.users && (
                <div className="search-results">
                        {/* USERS */}
                        {searchResults.users.length > 0 && (
                                <div>
                                    <h3>Users</h3>
                                    <ul>
                                        {searchResults.users.map((user,index) => (
                                            <li>
                                                {user.username}
                                                <button onClick={()=>onadd(user._id)} >Add</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                </div>
            )}
            <p><strong>Owner:</strong> {ownerDetails?.username || 'N/A'}</p>
            {memberDetails.length > 0 ? (
                <ul>
                    {memberDetails.map((member) => (
                        <li key={member._id}>
                            {member.username}
                            {isOwner && ( // Only owner can manage members
                                <>
                                    <button onClick={() => handlePromoteMember(member._id)}>Give Ownership</button>
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

