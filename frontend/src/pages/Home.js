import React from "react";
import Navbar from "../components/Navbar";
const { useRef, useState } = React;
import LocalFeed from "../components/LocalProjectFeed";
import GlobalFeed from "../components/GlobalProjectFeed";
import Search from "../components/Search";

const Projects=[
    {
    owner:"Keny Ken",
    likes:22,
    name:"Kenny Kens Tressure",
    downloads:2,
    datecreated: new Date(2024, 6, 4)
},
{
    owner:"Dan gtrimm",
    likes:34,
    name:"Grim town",
    downloads:15,
    datecreated: new Date(2024, 6, 24)
},
{
    owner:"lokalikeSam",
    likes:2,
    name:"Sam says who",
    downloads:0,
    datecreated: new Date(2024, 8, 14)
}
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
            <Navbar/>
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