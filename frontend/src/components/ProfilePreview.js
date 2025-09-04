import React from "react";

function ProfilePreview({user}){
    return(
        <div className="userpreview" >
            <div className="previmg" >User Image</div>
            <span>{user.username} </span>
            <span>Folowers:{(user.followers).length}</span>
        </div>
    )
}

export default ProfilePreview;