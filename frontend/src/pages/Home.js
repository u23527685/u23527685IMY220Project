import React from "react";
import Navbar from "../components/Navbar";
const { useRef, useState } = React;
import LocalFeed from "../components/LocalProjectFeed";
import GlobalFeed from "../components/GlobalProjectFeed";
import Search from "../components/Search";

const Projects=[
    {
    owner:"AlexCoder",
    likes:22,
    name:"Smart Budget",
    downloads:2,
    datecreated: new Date(2024, 6, 4)
},
{
    owner:"DanGrimm",
    likes:34,
    name:"Grim town",
    downloads:15,
    datecreated: new Date(2024, 6, 24)
},
{
    owner:"SarahDev",
    likes:2,
    name:"Weather App",
    downloads:0,
    datecreated: new Date(2024, 8, 14)
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
]


function Home(){
    const [local, setlocal]=useState(true);
    const [global, setglobal]=useState(false);
    const [projects, setprojects]= useState(Projects);
    const [allprojects, setallprojects]=useState(Projects);
    const onDownload=(owner,name)=>{
        setprojects(
            projects.map((project,i)=>{
                 if (project.owner===owner && project.name===name) {
                    return {...project,downloads:project.downloads + 1 };
                }
                return project;
            })
        );
        setallprojects(
            allprojects.map((project,i)=>{
                 if (project.owner===owner && project.name===name) {
                    return {...project,downloads:project.downloads + 1 };
                }
                return project;
            })
        )
    };
    const onLike=(owner,name)=>{
        setprojects(
            projects.map((project,i)=>{
                if(project.owner==owner && project.name==name)
                    return {...project,likes:project.likes + 1 };
                return project;
            })
        );
        setallprojects(
            allprojects.map((project,i)=>{
                 if (project.owner===owner && project.name===name) {
                    return {...project,likes:project.likes + 1 };
                }
                return project;
            })
        )
    };
    const onUnLike=(owner,name)=>{
        setprojects(
            projects.map((project,i)=>{
                if(project.owner==owner && project.name==name)
                    return {...project,likes:project.likes - 1 };
                return project;
            })
        );
        setallprojects(
            allprojects.map((project,i)=>{
                 if (project.owner===owner && project.name===name) {
                    return {...project,likes:project.likes - 1 };
                }
                return project;
            })
        )
    };
    const onSearch=(search)=>{
        console.log(search);
    }
    const toggleLocal=()=>{
        console.log("loc");
        setglobal(false);
        setlocal(true);
    };
    const toggleGlobal=()=>{
        console.log("glob");
        setlocal(false);
        setglobal(true);
    };
    return(
        <div>
            <Navbar user={user} otheruser={otheruser} projects={projects} users={users} />
            <Search onsearch={onSearch} />
            <h1>Home Page</h1>
            <div className="LocGlobchoose" >
                <h2 className={local ? "active" : "inactive"} onClick={toggleLocal}>Local</h2>
                <h2 className={global ? "active" : "inactive"} onClick={toggleGlobal} >Global</h2>
            </div>
            { local && <LocalFeed projects={projects} ondownload={onDownload} onlike={onLike} onunlike={onUnLike}/>}
            {global && <GlobalFeed projects={projects} ondownload={onDownload} onlike={onLike} onunlike={onUnLike}/>}
        </div>
        
    )
}

export default Home;