import React from "react";
import { useLocation } from 'react-router-dom';
import ProfilePreview from "./ProfilePreview";

function Followers({followers}){
    const location = useLocation();
    const { users } = location.state || [];
    var followingusers=users.filter(user =>
        followers.some(f =>
            f.username === user.username
        )
    );
    return(
        <div id="followers" >
            {followingusers.map((fm,i)=><ProfilePreview key={i} user={fm} />) }
        </div>
    )
}

export default Followers;
//u23527685 18