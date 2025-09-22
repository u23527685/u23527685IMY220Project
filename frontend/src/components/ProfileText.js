import React from "react";
import { useState } from "react";
import EditProfile from "./EditProfile";
import "../../public/assets/css/profiletext.css"

function ProfileText({user,onedit}){
    const [editing,setediting]=useState(false);
    const toggleediting=()=>{
        if(editing)
            setediting(false);
        else
            setediting(true);
    };
    return(
        <>
            { !editing && <div className="profiletext" >
                <button onClick={toggleediting} >Edit</button>
                <br/>
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
            </div>}

            {editing && <EditProfile onSave={onedit} user={user} onCancel={toggleediting} />}
        </>
    )
}

export default ProfileText;

//u23527685 18