import React from "react";
import PinnedProjects from "../components/PinnedProjects";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from "react-router-dom";
import "../../public/assets/css/otherprofile.css";
import ptofileimage from "../../public/assets/svg/default user.svg";

function OtherProfile(){
    const {username}=useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {users} = location.state || [];
    
    const [details,setdetails]=useState(true);
    const [projectstab,setprojectstab]=useState(false);

    const user=users.find(u => u.username===username);
    const userprojectnames = () => user ? [...user.owned_projects, ...user.contributed_projects] : [];

    const toggledetails = () => {
        setprojectstab(false);
        setdetails(true);
    };
    const toggleprojects = () => {
        setdetails(false);
        setprojectstab(true);
    };
    const gotohome = () => navigate('/home');

    return(
        <div id="otherprofile">
            <div id="otherprofile-sidebar">
                <div id="otherprofile-header">
                    <div id="otherprofile-image-name">
                        <img width="200px" src={ptofileimage} alt="User"/>
                        <div id="otherprofile-username">{user.username}</div>
                    </div>
                    <p id="otherprofile-followers">
                        <span>{user.followers.length} followers</span>{" | "}
                        <span>{user.following.length} following</span>
                    </p>
                </div>

                <div className="otherprofile-home-icon" onClick={gotohome}>Home Icon</div>

                <h3>Pinned Projects</h3>
                <PinnedProjects pinprojects={user.pinnedprojects} />

                <div className="otherprofile-tabs">
                    <h4 onClick={toggledetails} className={details ? "isActive" : "inactive"}>Details</h4>
                    <span>{" | "}</span>
                    <h4 onClick={toggleprojects} className={projectstab ? "isActive" : "inactive"}>Projects</h4>
                </div>
            </div>

            <div id="otherprofile-info">
                {details && <ProfileText user={user} />}
                {projectstab && <UserProjectsView projectnames={userprojectnames()} />}
            </div>
        </div>
    )
}

export default OtherProfile;

//u23527685 18