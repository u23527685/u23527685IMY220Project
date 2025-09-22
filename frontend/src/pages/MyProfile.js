import React from "react";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import Likes from "../components/Likes";
import Followers from "../components/Followers";
import Following from "../components/Following";
import PinnedProjects from "../components/PinnedProjects";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import ptofileimage from "../../public/assets/svg/default user.svg";
import "../../public/assets/css/profile.css";

/*const otheruser={
    name:"Dan",
    surname:"Grimm",
    username:"DanGrimm",
    paswword:"DanGrimm44#*",
    email:"DanGrimm@gmail.com",
    company:"D1Demo Holdings",
    owned_projects:[{
        name:"Grim town",
        owner:"Dan Grimm"
    }],
    contributed_ptojects:[],
    following:[
        {username:"Ben10"}
    ],
    followers:[
        {username:"Ben10"}
    ]
}

const user={
    name:"Ben",
    surname:"10",
    username:"Ben10",
    paswword:"benLook11#",
    email:"Ben10@gmail.com",
    company:"D1Demo Holdings",
    owned_projects:[],
    contributed_ptojects:[{
        name:"Grim town",
        owner:"Dan Grimm"
    }
    ],
    following:[
        {username:"DanGrimm"}
    ],
    followers:[
        {username:"DanGrimm"}
    ]
}*/

function MyProfile(){
    const navigate = useNavigate();
    const location = useLocation();
    let { user } = location.state || {};
    // true false states
    const [details,setdetails]=useState(true);
    const [projectstab,setprojectstab]=useState(false);
    const [likes,setlikes]=useState(false);
    const [followers,setfollowers]=useState(false);
    const [following,setfollowing]=useState(false);
    //
    const userprojectnames=()=>{
        return user?[...user.owned_projects,...user.contributed_projects]:[]
    };
    const toggledetails=()=>{
        setprojectstab(false);
        setlikes(false);
        setfollowers(false);
        setfollowing(false);
        setdetails(true);
    };
    const toggleprojects=()=>{
        setdetails(false);
        setlikes(false);
        setfollowers(false);
        setfollowing(false);
        setprojectstab(true);
    };
    const toggleLike=()=>{
        setdetails(false);
        setprojectstab(false);
        setfollowers(false);
        setfollowing(false);
        setlikes(true);
    };
    const togglefollowing=()=>{
        setdetails(false);
        setprojectstab(false);
        setfollowers(false);
        setlikes(false);
        setfollowing(true);
    };
    const togglefollowers=()=>{
        setdetails(false);
        setprojectstab(false);
        setfollowing(false);
        setlikes(false);
        setfollowers(true);
    };
    const gotohom=()=>{
        navigate('/home');
    };
    const onedit=(editeduser)=>{
        user.username=editeduser.username;
    };
    return(
        <div id="profile">
            <div id="profileallpages">
                <div id="profileheader">
                    <div id="profileimagename">
                        <img width={"200px"} src={ptofileimage}></img>
                        <div id="username">{user.username}</div>
                    </div>
                        <p id="followersspan" >
                        <span onClick={togglefollowers} className={followers?"isActive":"inactive"} >{(user.followers).length} followers</span>{" | "}<span className={following?"isActive":"inactive"} onClick={togglefollowing}>{(user.following).length} following</span>
                    </p>
                </div>
                <div onClick={gotohom} >Home Icon</div>
                <h3>Pinned Projects</h3>
                <PinnedProjects pinprojects={user.pinnedprojects} />
                <div className="tabs" >
                    <h4 onClick={toggledetails} className={details?"isActive":"inactive"} >Details</h4>
                    <p>{" | "}</p>
                    <h4 onClick={toggleprojects} className={projectstab?"isActive":"inactive"} >Projects</h4>
                    <p>{" | "}</p>
                    <h4 onClick={toggleLike} className={likes?"isActive":"inactive"} >Likes</h4>
                </div>
            </div>
            <div id="info" >
                {details && <ProfileText user={user} onedit={onedit} />}
                {projectstab && <UserProjectsView projectnames={userprojectnames()} />}
                {likes && <Likes likes={user.likes} />}
                {followers && <Followers followers={user.followers}/>}
                {following && <Following following={user.following}/>}
            </div>
        </div>
    )
}

export default MyProfile;

//u23527685 18 