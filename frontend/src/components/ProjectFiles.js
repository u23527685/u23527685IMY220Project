import React from 'react';
function ProjectFiles({ files }) {
  // files: array of { id, name, url }
  return (
    <section>
      <h2>Project Files</h2>
      <ul>
        {files.map(({ id, name, url }) => (
          <li key={id}>
            <a href={url} download>{name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectFiles;