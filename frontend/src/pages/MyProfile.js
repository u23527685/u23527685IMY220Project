import React from "react";
import ProfileText from "../components/ProfileText";
import UserProjectsView from "../components/UserProjectsView";
import Likes from "../components/Likes";
import { useState } from "react";
import { useLocation } from 'react-router-dom';

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
     const location = useLocation();
    const { user } = location.state || {};
    const [details,setdetails]=useState(true);
    const [projectstab,setprojectstab]=useState(false);
    const [likes,setlikes]=useState(false);
    const userprojectnames=()=>{return user?[...user.owned_projects,...user.contributed_projects]:[]};
    const toggledetails=()=>{
        setprojectstab(false);
        setlikes(false);
        setdetails(true);
    };
    const toggleprojects=()=>{
        setdetails(false);
        setlikes(false);
        setprojectstab(true);
    };
     const toggleLike=()=>{
        setdetails(false);
        setprojectstab(false);
        setlikes(true);
    };
    return(
        <div id="profile">
            <div>userImage</div>
            <div>Home Icon</div>
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
        </div>
    )
}

export default MyProfile;