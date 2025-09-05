import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function ProfilePreview({user}){
    const navigate=useNavigate();
    const location = useLocation();
    const gotoprofile=()=>{
        const { users,projects } = location.state || {};
        console.log(users);
        navigate(`/profile/${user.username}`,{state:{users,projects}});
    }
    return(
        <div className="userpreview" >
            <div className="previmg" >User Image</div>
            <span onClick={gotoprofile} >{user.username} </span>
            <span>Folowers:{(user.followers).length}</span>
        </div>
    )
}

export default ProfilePreview;