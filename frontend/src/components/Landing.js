import React from "react";
import Login from "./Login";
import Singup from "./Signup";
import { useNavigate } from 'react-router-dom';
const { useRef, useState } = React;

const projects=[
    {
    owner:"AlexCoder",
    likes:22,
    name:"Smart Budget",
    downloads:2,
    datecreated: new Date(2024, 6, 4),
    members:[{
        username: "SarahDev"
    }],
    description: 'A description of the project.',
    imageUrl: 'https://placehold.co/200',
    type: 'Web Application',
    hashtags: ['javascript', 'react'],
    feed:[
        {
        user: 'Alice',
        action: 'check-in',
        message: 'Initial commit',
        timestamp: Date.now() - 1000000
        },
        {
        user: 'Bob',
        action: 'check-out',
        message: 'Working on feature X',
        timestamp: Date.now() - 500000
        }
    ],
    files: [
        { id: 1, name: 'index.js', url: '/files/index.js' },
        { id: 2, name: 'README.md', url: '/files/README.md' }
    ],
    discussion:[
        { id: 1, user: 'Alice', message: 'Welcome to the project!', timestamp: Date.now() - 2000000 },
        { id: 2, user: 'Bob', message: 'Thanks! Happy to be here.', timestamp: Date.now() - 1500000 }
    ]
},
{
    owner:"DanGrimm",
    likes:34,
    name:"Grim town",
    downloads:15,
    datecreated: new Date(2024, 6, 24),
    members:[{
        username: "Ben10"
    },
    {username: "AlexCoder"}],
    description: 'A description of the project.',
    imageUrl: 'https://placehold.co/200',
    type: 'Web Application',
    hashtags: ['javascript', 'react'],
    feed:[
        {
        user: 'Alice',
        action: 'check-in',
        message: 'Initial commit',
        timestamp: Date.now() - 1000000
        },
        {
        user: 'Bob',
        action: 'check-out',
        message: 'Working on feature X',
        timestamp: Date.now() - 500000
        }
    ],
    files: [
        { id: 1, name: 'index.js', url: '/files/index.js' },
        { id: 2, name: 'README.md', url: '/files/README.md' }
    ],
    discussion:[
        { id: 1, user: 'Alice', message: 'Welcome to the project!', timestamp: Date.now() - 2000000 },
        { id: 2, user: 'Bob', message: 'Thanks! Happy to be here.', timestamp: Date.now() - 1500000 }
    ]
},
{
    owner:"SarahDev",
    likes:2,
    name:"Weather App",
    downloads:0,
    datecreated: new Date(2024, 8, 14),
    members:[],
    description: 'A description of the project.',
    imageUrl: 'https://placehold.co/200',
    type: 'Web Application',
    hashtags: ['javascript', 'react'],
    feed:[
        {
        user: 'Alice',
        action: 'check-in',
        message: 'Initial commit',
        timestamp: Date.now() - 1000000
        },
        {
        user: 'Bob',
        action: 'check-out',
        message: 'Working on feature X',
        timestamp: Date.now() - 500000
        }
    ],
    files: [
        { id: 1, name: 'index.js', url: '/files/index.js' },
        { id: 2, name: 'README.md', url: '/files/README.md' }
    ],
    discussion:[
        { id: 1, user: 'Alice', message: 'Welcome to the project!', timestamp: Date.now() - 2000000 },
        { id: 2, user: 'Bob', message: 'Thanks! Happy to be here.', timestamp: Date.now() - 1500000 }
    ]
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

function Landing(){
    const navigate = useNavigate();
    const [login, setlogin] = useState(false);
    const [signup, setsignup] = useState(false);
    function toggleLogin() {
        setsignup(false);
        setlogin(true);
    }
    function toggleSignup() {
        setsignup(true);
        setlogin(false);
    }
    function handleLogin(event){
        setlogin(false);
        navigate('/home', { state: { user, projects, otheruser, users } });
    }
    function handleSignup(){
        setsignup(false);
        navigate('/home', { state: { user, projects, otheruser, users } });
    }
    return(
        <div id="landing">
            <button onClick={toggleLogin} >Login</button>
            <button onClick={toggleSignup}>Signup</button>
            {login && (<Login onlogin={handleLogin} />)}
            {signup && (<Singup onsignup={handleSignup}/>)}
        </div>
    )
}

export default Landing;