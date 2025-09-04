import React from "react";

const otheruser={
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
}

function OtherProfile(){

}

export default OtherProfile;