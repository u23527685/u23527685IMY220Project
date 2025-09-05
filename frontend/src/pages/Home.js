import React from "react";
import Navbar from "../components/Navbar";
const { useRef, useState } = React;
import LocalFeed from "../components/LocalProjectFeed";
import GlobalFeed from "../components/GlobalProjectFeed";
import Search from "../components/Search";
import { useSearchParams,useLocation } from 'react-router-dom';
import"../../public/assets/css/home.css"
import Filter from "../components/Filter";

/*const Projects=[
    {
    owner:"AlexCoder",
    likes:22,
    name:"Smart Budget",
    downloads:2,
    datecreated: new Date(2024, 6, 4),
    members:[{
        username: "SarahDev"
    }]
},
{
    owner:"DanGrimm",
    likes:34,
    name:"Grim town",
    downloads:15,
    datecreated: new Date(2024, 6, 24),
    members:[{
        username: "Ben10"
    },{username: "AlexCoder"}]
},
{
    owner:"SarahDev",
    likes:2,
    name:"Weather App",
    downloads:0,
    datecreated: new Date(2024, 8, 14),
    members:[]
}
]

const otheruser={
    username:"DanGrimm",
    paswword:"DanGrimm44#*",
    email:"DanGrimm@gmail.com",
    company:"D1Demo Holdings",
    owned_projects:[{
        name:"Grim town",
        owner:"DanGrimm"
    }],
    contributed_projects:[],
    following:[
        {username:"Ben10"}
    ],
    followers:[
        {username:"Ben10"}
    ],
    likes:[{
        name:"Grim town",
        owner:"DanGrimm"
    },{
        name: "Smart Budget",
        owner: "AlexCoder"
    }],
    name:"Dan",
    surname:'Grimm',
    pinnedprojects:[{
        name:"Grim town",
        owner:"DanGrimm"
    }]
}

const user={
    username:"Ben10",
    paswword:"benLook11#",
    email:"Ben10@gmail.com",
    company:"D1Demo Holdings",
    owned_projects:[],
    contributed_projects:[{
        name:"Grim town",
        owner:"DanGrimm"
    }
    ],
    following:[
        {username:"DanGrimm"}
    ],
    followers:[
        {username:"DanGrimm"},
        {username: "AlexCoder"}
    ],
    likes:[{
        name:"Grim town",
        owner:"DanGrimm"
    }],
    name:"Ben",
    surname:'10',
    pinnedprojects:[{
        name:"Grim town",
        owner:"DanGrimm"
    }]
}

const user2 = {
    username: "AlexCoder",
    paswword: "alex2024!Pass",
    email: "alexcoder@gmail.com",
    company: "TechStart Solutions",
    owned_projects: [{
        name: "Smart Budget",
        owner: "AlexCoder"
    }],
    contributed_projects: [{
        name: "Grim town",
        owner: "DanGrimm"
    }],
    following: [
        {username: "Ben10"},
        {username: "DanGrimm"}
    ],
    followers: [
    ],
    likes: [{
    }],
    name: "AlexCoder",
    surname: "Johnson",
    pinnedprojects:[{
        name:"Grim town",
        owner:"DanGrimm"
    },{
        name: "Smart Budget",
        owner: "AlexCoder"
    }
    ]
}

const user3 = {
    username: "SarahDev",
    paswword: "sarah#Secure99",
    email: "sarahdev@gmail.com",
    company: "Innovation Labs Inc",
    owned_projects: [
        {
            name: "Weather App",
            owner: "SarahDev"
        },
    ],
    contributed_projects: [{
        name: "Smart Budget",
        owner: "AlexCoder"
    }],
    following: [
        {username: "AlexCoder"}
    ],
    followers: [
        {username: "Ben10"},
        {username: "AlexCoder"},
        {username: "DanGrimm"}
    ],
    likes: [
        {
            name: "Weather App",
            owner: "SarahDev"
        },
        {
            name: "Grim town",
            owner: "DanGrimm"
        }
    ],
    name: "Sarah",
    surname: "Williams",
    pinnedprojects:[ {
            name: "Weather App",
            owner: "SarahDev"
        },{
        name: "Smart Budget",
        owner: "AlexCoder"
    }
    ]
}

const users=[
    user,
    otheruser,
    user2,
    user3
]*/


function Home(){
    const location=useLocation();
    const {projects}=location.state||[];
    const {user}=location.state||{};
    const [filter,setfilter]=useState(false);
    const [local, setlocal]=useState(true);
    const [global, setglobal]=useState(false);
    const onSearch=(search)=>{
        console.log(search);
    };
    const toggleLocal=()=>{
        setglobal(false);
        setlocal(true);
    };
    const toggleGlobal=()=>{
        setlocal(false);
        setglobal(true);
    };
    const toggleFilter=()=>{
        if(filter)
            setfilter(false);
        else
            setfilter(true);
    }
    return(
        <main>
            <h1>Home Page</h1>
            <div id="homeitems" >
                <div className="LocGlobchoose" >
                    <h2 className={local ? "isActive" : "inactive"} onClick={toggleLocal}>Local</h2>
                    <h2>{" | "}</h2>
                    <h2 className={global ? "isActive" : "inactive"} onClick={toggleGlobal} >Global</h2>
                </div>
                <div id="searchfil">
                    <Search onsearch={onSearch} />
                    <button onClick={toggleFilter}>Filter</button>
                </div>
            </div>
            
            <div id="out">
                <div id="chosen feed" >
                    {local && <LocalFeed user={user} projects={projects} />}
                    {global && <GlobalFeed projects={projects} />}
                </div>
                
                {filter&& <Filter/>}
            </div>
        </main>
        
    )
}

export default Home;