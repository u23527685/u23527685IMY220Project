import React, { use } from "react";
import { useLocation,useNavigate,useParams,Outlet } from "react-router-dom";
import Project from "../components/Project";
import ProjectsList from "../components/ProjectsList";
import AddProject from "../components/AddProject";
import "../../public/assets/css/projects.css";
const {useState}=React;


function Projects(){
    const [add,setadd] = useState(false);
    const navigate=useNavigate();
    const location=useLocation();
    const {username}=useParams();
    const {projects}=location.state || [];
    const ownedprojects=projects.filter((project,i)=>project.owner===username);
    const memberprojects=projects.filter((project,i)=>{
        return project.members.some((p,i)=>p.username==username)
    });
    const handleadd=()=>{
        setadd(true);
    }
    const canceladd=()=>{
        setadd(false);
    }
    return(
        <div className="projects">
            <div className="list" >
                <button onClick={handleadd} >Add Project</button>
                { add &&  <AddProject oncancel={canceladd} />}
                <ProjectsList username={username} owned={ownedprojects} member={memberprojects} />
            </div>
            <Outlet/>
            
        </div>
    )

}

export default Projects;

//u23527685 18