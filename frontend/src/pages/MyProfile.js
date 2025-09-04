import React from "react";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import Likes from "../components/Likes";
import Followers from "../components/Followers";
import Following from "../components/Following";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

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
    const { user } = location.state || {};
    // true false states
    const [details,setdetails]=useState(true);
    const [projectstab,setprojectstab]=useState(false);
    const [likes,setlikes]=useState(false);
    const [followers,setfollowers]=useState(false);
    const [following,setfollowing]=useState(false);
    //
    const userprojectnames=()=>{return user?[...user.owned_projects,...user.contributed_projects]:[]};
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
    }
    return(
        <div id="profile">
            <div>
                <div>userImage</div>
                <p>
                    <span onClick={togglefollowers} >{(user.followers).length} followers</span>{" | "}<span onClick={togglefollowing}>{(user.following).length} following</span>
                </p>
            </div>
            <div onClick={gotohom} >Home Icon</div>
            <div className="tabs" >
                <span onClick={toggledetails} >Details</span>
                {" | "}
                <span onClick={toggleprojects} >Projects</span>
                {" | "}
                <span onClick={toggleLike} >Likes</span>
            </div>
            {details && <ProfileText user={user} />}
            {projectstab && <UserProjectsView projectnames={userprojectnames()} />}
            {likes && <Likes likes={user.likes} />}
            {followers && <Followers followers={user.followers}/>}
            {following && <Following following={user.following}/>}
        </div>
    )
}

export default MyProfile;

//u23527685 18 