import React from "react";
import PinnedProjects from "../components/PinnedProjects";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Outlet } from 'react-router-dom';

function OtherProfile(){
    const {username}=useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {users} = location.state || [];
    // true false states
    const [details,setdetails]=useState(true);
    const [projectstab,setprojectstab]=useState(false);
    //
    var user=users.find((u,i)=>u.username===username);
    const userprojectnames=()=>{return user?[...user.owned_projects,...user.contributed_projects]:[]};
    const toggledetails=()=>{
        setprojectstab(false);
        setdetails(true);
    };
    const toggleprojects=()=>{
        setdetails(false);
        setprojectstab(true);
    };
    const gotohom=()=>{
        navigate('/home');
    }
    return(
        <div id="profile">
            <div>
                <div>userImage</div>
                <p>
                    <span >{(user.followers).length} followers</span>{" | "}<span >{(user.following).length} following</span>
                </p>
            </div>
            <div onClick={gotohom} >Home Icon</div>
            <h3>Pinned Projects</h3>
            <PinnedProjects pinprojects={user.pinnedprojects} />
            <div className="tabs" >
                <span onClick={toggledetails} >Details</span>
                {" | "}
                <span onClick={toggleprojects} >Projects</span>
            </div>
            {details && <ProfileText user={user} />}
            {projectstab && <UserProjectsView projectnames={userprojectnames()} />}
        </div>
    )
}

export default OtherProfile;