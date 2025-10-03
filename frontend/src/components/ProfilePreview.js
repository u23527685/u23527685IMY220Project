import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import ptofileimage from "../../public/assets/svg/default user.svg";
import "../../public/assets/css/profilepreview.css";

function ProfilePreview({user}){
    const navigate=useNavigate();
    const location = useLocation();
    const gotoprofile=()=>{
        const { users,projects } = location.state || {};
        console.log(users);
        navigate(`/profile/${user.username}`,{state:{users,projects}});
    }
    return(
        <div onClick={gotoprofile} className="profile-card">
            <img src={user.image || "/assets/svg/default user.svg"} alt={user.username} />
            <h4>{user.username}</h4>
            <p>friends:{(user.friends).length}</p>
        </div>
    )
}

export default ProfilePreview;