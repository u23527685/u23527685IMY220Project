// frontend/src/components/ProfileText.js
import React, { useState } from "react";
import EditProfile from "./EditProfile";
import "../../public/assets/css/profiletext.css";

function ProfileText({ user, onedit }) {
    const [editing, setEditing] = useState(false); // Renamed for consistency

    const toggleEditing = () => { // Renamed for consistency
        setEditing(prev => !prev);
    };

    // Ensure user and personalInfo exist before accessing properties
    const bio = user?.personalInfo?.bio;
    const website = user?.personalInfo?.website;
    const socials = user?.personalInfo?.socials; // This is an array

    return (
        <>
            {!editing && (
                <div className="profiletext">
                    <button onClick={toggleEditing}>Edit</button>
                    <br />
                    <label>UserName</label>
                    <p>{user?.username || 'N/A'}</p> {/* Use optional chaining */}

                    <label>Email</label>
                    <p>{user?.email || 'N/A'}</p>

                    <label>Full Name</label>
                    <p><span>{user?.name || ''}</span> <span>{user?.surname || ''}</span></p>

                    <label>Bio</label>
                    <p>{bio || "None specified"}</p>

                    <label>Website</label>
                    <p>{website ? <a href={website} target="_blank" rel="noopener noreferrer">{website}</a> : "None specified"}</p>

                    <label>Socials</label>
                    <p>
                        {socials && socials.length > 0
                            ? socials.map((social, index) => (
                                  <span key={index}>
                                      {social}
                                      {index < socials.length - 1 ? ', ' : ''}
                                  </span>
                              ))
                            : "None specified"}
                    </p>
                </div>
            )}

            {editing && <EditProfile onSave={onedit} user={user} onCancel={toggleEditing} />}
        </>
    );
}

export default ProfileText;
