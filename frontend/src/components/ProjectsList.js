import React from "react";
import ProjectPreview from "./ProjectPreview";
import "../../public/assets/css/projectlist.css";


function ProjectsList({owned,member,username}){
    return(
        <>
            <div id="Owned" >
                <h3>Owned</h3>
                {owned.length>0? owned.map((ond,i)=><ProjectPreview username={username} project={ond} key={i} yours={true} />):"No owned Projects"}
            </div>
            <div id="member" >
                <h3>Member</h3>
                {member.length>0? member.map((mem,i)=><ProjectPreview username={username} project={mem} key={i} yours={true} />) :"No Projects as a member"}
            </div>
        </>
    )
}

export default ProjectsList;

//u23527685 18