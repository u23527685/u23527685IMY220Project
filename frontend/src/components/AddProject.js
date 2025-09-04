import React from 'react';

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

      <label htmlFor="projectFiles">Add Files</label>
      <input type="file" id="projectFiles" name="projectFiles" multiple />

      <label htmlFor="projectLanguages">Programming Languages (hashtags)</label>
      <input type="text" id="projectLanguages" name="projectLanguages" placeholder="#javascript #react" />

      <label htmlFor="projectType">Project Type</label>
      <select id="projectType" name="projectType" required>
        <option value="">Select type</option>
        <option value="desktop">Desktop Application</option>
        <option value="web">Web Application</option>
        <option value="mobile">Mobile Application</option>
        <option value="framework">Framework</option>
        <option value="library">Library</option>
      </select>

      <label htmlFor="projectVersion">Version</label>
      <input type="text" id="projectVersion" name="projectVersion" placeholder="e.g. 1.0.0" required />

      <label htmlFor="projectImage">Upload Project Image (max 5MB)</label>
      <input type="file" id="projectImage" name="projectImage" accept="image/*" />

      <button onClick={handlesubmit} type="submit">Create Project</button>
    </form>
  );
}
export default AddProject; 