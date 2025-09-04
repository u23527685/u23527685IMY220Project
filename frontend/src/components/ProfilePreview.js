import React from "react";

function ProfilePreview({user}){
    return(
        <div className="userpreview" >
            <div className="previmg" >User Image</div>
            <span>{user.name} </span>
            <span>Folowwers:{(user.followers).length}</span>
        </div>
    )
}