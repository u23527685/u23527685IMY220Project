import React from "react";
import ProjectCheckInOut from "./ProjectCheckinout";
import ProjectDiscussion from "./ProjectDiscussion";
import ProjectFiles from "./ProjectFiles";
import ProjectMembers from "./ProjectMemebers";
import ProjectStatusFeed from "./ProjectStatusFeed";
import ProjectDetails from "./ProjectDetails";


function Project(){
    const sampleProject = {
        name: 'Sample Project',
        description: 'A description of the project.',
        imageUrl: 'https://placehold.co/200',
        type: 'Web Application',
        hashtags: ['javascript', 'react']
    };
    const sampleFeed = [
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
    ];
    const sampleFiles = [
        { id: 1, name: 'index.js', url: '/files/index.js' },
        { id: 2, name: 'README.md', url: '/files/README.md' }
    ];
    const sampleOwner = { id: 1, name: 'Alice' };
    const sampleMembers = [
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ];
    const sampleDiscussion = [
        { id: 1, user: 'Alice', message: 'Welcome to the project!', timestamp: Date.now() - 2000000 },
        { id: 2, user: 'Bob', message: 'Thanks! Happy to be here.', timestamp: Date.now() - 1500000 }
    ];
    return (
        <div id="projinfo">
            <h1>Project System</h1>
            <ProjectDetails project={sampleProject} />
            <ProjectStatusFeed feed={sampleFeed} />
            <ProjectFiles files={sampleFiles} />
            <ProjectMembers owner={sampleOwner} members={sampleMembers} />
            <ProjectDiscussion discussion={sampleDiscussion} />
            <ProjectCheckInOut />
        </div>
    )
}

export default Project;