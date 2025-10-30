import React, { useState, useRef } from "react";

function ProjectFiles({ files = [], onUpload, onDownload, isOwner, isMember }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const dropRef = useRef(null);

  /** Handle file input manually **/
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  /** Handles drag/drop or input uploads **/
  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadProgress({});

    for (const [index, file] of fileList.entries()) {
      try {
        // Show current progress state
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: "Uploading..."
        }));

        // Wait for upload to complete (sequential)
        await onUpload(file);

        // Mark this file as done
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: "Done"
        }));
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: " Failed"
        }));
      }
    }

    setUploading(false);
  };

  /** Drag and drop events **/
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  return (
    <section className="project-files">
      <h2>Project Files</h2>

      {/* Drag-and-drop zone */}
      { (isOwner || isMember) &&(<>
      <div
        ref={dropRef}
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #888",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          background: isDragging ? "#f0f8ff" : "#fafafa",
          cursor: "pointer",
          marginBottom: "20px",
          transition: "background 0.2s ease",
        }}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {uploading
          ? "Uploading files... Please wait"
          : "Drag & drop files here, or click to select"}
      </div>

      {/* Hidden file input */}
      <input
        id="fileInput"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
        </>)}

      {/* File list */}
      {(!files || files.length === 0) ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              <span style={{ marginRight: "10px" }}>{file.fileName || file.name}</span>
              <button
                onClick={() => onDownload(file.fileName || file.name)}
                style={{
                  padding: "5px 10px",
                  border: "none",
                  background: "#007bff",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Download
              </button>
              {uploadProgress[file.fileName || file.name] && (
                <span style={{ marginLeft: "10px" }}>
                  {uploadProgress[file.fileName || file.name]}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProjectFiles;
