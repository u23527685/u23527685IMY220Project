import React from 'react';
import "../../public/assets/css/addproject.css";

function AddProject({oncancel}) {
  const handlesubmit=(event)=>{
    event.preventDefault();
    if(oncancel)
      oncancel();
  }
  return (
    <form>
      <h2>Create New Project</h2>

      <label htmlFor="projectName">Project Name</label>
      <input type="text" id="projectName" name="projectName" required />

      <label htmlFor="projectDescription">Description</label>
      <textarea id="projectDescription" name="projectDescription" required />

      <label htmlFor="projectLanguages">Programming Languages (hashtags)</label>
      <input type="text" id="projectLanguages" name="projectLanguages" placeholder="#javascript #react" />

      <label htmlFor="projectType">Project Type</label>

      <label htmlFor="projectVersion">Version</label>
      <input type="text" id="projectVersion" name="projectVersion" placeholder="e.g. 1.0.0" required />

      <label htmlFor="projectImage">Upload Project Image (max 5MB)</label>
      <input type="file" id="projectImage" name="projectImage" accept="image/*" />

      <button onClick={handlesubmit} type="submit">Create Project</button>
    </form>
  );
}
export default AddProject; 

//u23527685 18