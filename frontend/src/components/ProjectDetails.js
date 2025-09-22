import React from 'react';
import Hashtag from './Hashtag';
import"../../public/assets/css/projectdetails.css";
function ProjectDetails({ project }) {
  return (
    <section>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Type: {project.type}</p>
      <div>
        {project.hashtags.map((tag) => (
          <Hashtag key={tag} tag={tag} onClick={() => { /* search handler */ }} />
        ))}
      </div>
    </section>
  );
}

export default ProjectDetails;

//u23427685 18