// frontend/src/components/ProjectFiles.js
import React from 'react';
import "../../public/assets/css/projectfiles.css";

function ProjectFiles({ files }) {
  if (!files || files.length === 0) {
    return (
      <section>
        <h2>Project Files</h2>
        <p>No files uploaded yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Project Files</h2>
      <ul>
        {files.map((file,index) => (
          <li key={index}> 
            <a href={file.url} download={file.name}>{file.name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectFiles;