import React from "react";
import { useState } from "react";

function ProfileText({user}){
    return(
        <div className="profiletext" >
            <label>UserName</label>
            <p>{user.username}</p>

            <label>Email</label>
            <p>{user.email}</p>

            <label>Full Name</label>
            <p><span>{user.name}</span> <span>{user.surname}</span></p>

            <label>Bio</label>
            <p>{user.bio ? user.bio:"None specified"}</p>

            <label>Website</label>
            <p>{user.website ? user.website:"None specified"}</p>
            <label>Socials</label>
            <p>{user.socials ? user.socials:"None specified"}</p>
        </div>
    )
}

export default ProfileText;