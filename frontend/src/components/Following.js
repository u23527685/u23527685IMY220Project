import React from "react";
import { useLocation } from 'react-router-dom';
import ProfilePreview from "./ProfilePreview";

function Following({following}){
    const location = useLocation();
    const { users } = location.state || [];
    var followedusers=users.filter(user =>
        following.some(f =>
            f.username === user.username
        )
    );
    return(
        <div id="following" >
            {followedusers.map((fm,i)=><ProfilePreview key={i} user={fm} />) }
        </div>
    )
}

export default Following;