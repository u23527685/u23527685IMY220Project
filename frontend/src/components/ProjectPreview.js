import React from "react";
const { useRef, useState } = React;

function ProjectPreview({project,ondownload,onlike,onunlike}){
    const [liked, setLiked] = useState(false);
    const owner=project.owner;
    const name=project.name;
    const toggleLike=()=>{
        if (liked && owner && name && onunlike) {
            onunlike(owner,name);
            setLiked(false);
        } else if (!liked && owner && name && onlike) { 
            onlike(owner,name);
            setLiked(true);
        }
    }
    const download=()=>{
        if(owner && name && ondownload)
            ondownload(owner,name)
    }
    return (
        <div className="projectprev">
            <div className="usernameshow">
                <div className="userImage">User Image</div>
                <div className="userName">{project.owner}</div>
            </div>
            <div className="projectinf">
                <p>{project.name}</p>
                {onlike && onunlike && <button onClick={toggleLike}>
                    {liked ? "Unlike":"Like"}
                </button>}
                <span>{project.likes} Likes</span>
                {ondownload && <button onClick={download}>Download</button>}
                <span>{project.downloads} Downloads</span>
            </div>
        </div>
    )
}

export default ProjectPreview;