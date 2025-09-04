import React from "react";
import ProjectPreview from "./ProjectPreview";


function ProjectsList({owned,member}){
    return(
        <>
            <div id="Owned" >
                <h3>Owned</h3>
                {owned.length>0? owned.map((ond,i)=><ProjectPreview project={ond} key={i} />):"No owned Projects"}
            </div>
            <div id="member" >
                <h3>Member</h3>
                {member.length>0? member.map((mem,i)=><ProjectPreview project={mem} key={i} />) :"No Projects as a member"}
            </div>
        </>
    )
}

export default ProjectsList;