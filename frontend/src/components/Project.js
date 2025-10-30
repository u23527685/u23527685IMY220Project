// frontend/src/components/Project.js
import React, { useState, useEffect, useCallback, } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import ProjectCheckInOut from "./ProjectCheckinout"; // Assuming this component is self-contained
import ProjectDiscussion from "./ProjectDiscussion";
import ProjectFiles from "./ProjectFiles";
import ProjectStatusFeed from "./ProjectStatusFeed";
import ProjectDetails from "./ProjectDetails";
import ProjectMembers from './ProjectMemebers.js';
import "../../public/assets/css/projectinfo.css";

function Project() {
    const navigate = useNavigate();
    const [projectFiles, setProjectFiles] = useState([]);
    const {projectId}  = useParams(); // Get projectId from URL params
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserId = sessionStorage.getItem('userId'); // Get the logged-in user's ID

    const fetchProjectData = useCallback(async () => {
        if (!projectId) {
            setError('Project ID is missing.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {

            const response = await fetch(`/ap/project/${projectId}`, { // Your API endpoint
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            if (result.success && result.project) {
                setProject(result.project);
            } else {
                setError(result.message || 'Failed to fetch project data.');
                setProject(null);
            }
        } catch (err) {
            console.error('Error fetching project data:', err);
            setError(err.message || 'Failed to connect to server.');
            setProject(null);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const fetchAllProjectFiles = useCallback(async () => {
        try {
        const response = await fetch(`/api/projects/${projectId}/files`);
        const result = await response.json();

        if (result.success && Array.isArray(result.files)) {
            setProjectFiles(result.files);
        } else {
            console.warn('Unexpected files response:', result);
        }
        } catch (err) {
        console.error('Error fetching project files:', err);
        }
    }, [projectId]);

    const uploadProjectFile = useCallback(async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
        // Step 1: Upload file
        const uploadResponse = await fetch(`/api/projects/${projectId}/upload`, {
            method: 'POST',
            body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success && uploadResult.file) {
            // Add to state
            setProjectFiles(prev => [...prev, uploadResult.file]);

            // Step 2: Log upload activity
            const activityPayload = {
            projectId,
            userId: currentUserId,
            type: 'upload',
            message: `Uploaded file "${uploadResult.file.fileName}"`,
            timestamp: new Date()
            };

            await fetch(`/api/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activityPayload),
            });
        } else {
            console.warn('Upload failed:', uploadResult.message);
        }
        } catch (err) {
        console.error('Error uploading file:', err);
        }
    }, [projectId, currentUserId]);

    const downloadProjectFile = useCallback(async (fileName) => {
        try {
        const downloadUrl = `/uploads/${projectId}_${fileName}`;

        // Fetch the file as a blob
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error(`Failed to download file: ${response.status}`);
        const blob = await response.blob();

        // Trigger browser download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        // Log activity
        await fetch(`/api/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            projectId,
            userId: currentUserId,
            type: 'download',
            message: `Downloaded file "${fileName}"`,
            timestamp: new Date()
            }),
        });

        } catch (err) {
        console.error('Error downloading file:', err);
        }
    }, [projectId, currentUserId]);

    const handleDeleteProject = useCallback(async () => {

        const userId = sessionStorage.getItem("userId");
        if (!userId || !projectId) {
            alert("Missing user or project information.");
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/${userId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                navigate("/home");
            } else {
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    }, [projectId]);

    const addMember = useCallback(async (newMemberId) => {
        console.log(projectId);
        console.log(newMemberId);
        if (!projectId || !newMemberId) return;

        try {
        const response = await fetch(`/api/projects/add-member`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: newMemberId, projectId: projectId })
        });

        const result = await response.json();
        if (result.success) {
            console.log('Member added successfully:', newMemberId);
            await fetchProjectData(); // Refresh project data
        } else {
            console.error('Failed to add member:', result.message);
        }
        } catch (error) {
        console.error('Error adding member:', error);
        }
    }, [projectId, fetchProjectData]);

    const promoteMemberToOwner = useCallback(async (userId) => {
        if (!projectId || !userId) return;

        try {
            const response = await fetch(`/api/projects/promote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, userId })
            });

            const result = await response.json();

            if (result.success) {
                await fetchProjectData();
            } else {
                console.log(`Failed to promote member: ${result.message}`);
            }
        } catch (err) {
            console.error('Error promoting member:', err);
        }
    }, [projectId, fetchProjectData]);


    useEffect(() => {
        fetchProjectData();
        fetchAllProjectFiles();
    }, [fetchProjectData, fetchAllProjectFiles]);;

    if (loading) {
        return <div id="projinfo">Loading project...</div>;
    }

    if (error) {
        return <div id="projinfo" style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!project) {
        return <div id="projinfo">Project not found.</div>;
    }


    const isOwner = project.owner === currentUserId; // Check if current user is the project owner

    const isMember = project.owner === currentUserId || (project.members || []).includes(currentUserId);


    return (
        <div id="projinfo">
            <h1>VEYO Project System</h1>

            <div className="project-section">
                <ProjectDetails ondelete={handleDeleteProject} project={project} isOwner={isOwner} onProjectUpdated={fetchProjectData} />
            </div>

            <div className="project-section">
                <ProjectStatusFeed ismember={isMember} projectId={project._id} activityFeedIds={project.activityFeed} />
            </div>

            <div className="project-section">
                <ProjectFiles isMember={isMember} isOwner={isOwner} onUpload={uploadProjectFile} onDownload={downloadProjectFile} files={projectFiles} />
            </div>

            <div className="project-section">
                <ProjectMembers
                    onPromoteMember={promoteMemberToOwner}
                    onadd={addMember}
                    ownerId={project.owner}
                    memberIds={project.members}
                    isOwner={isOwner}
                    onMembersUpdated={fetchProjectData} // Callback to refetch project data
                />
            </div>

            <div className="project-section">
                <ProjectDiscussion
                    ismember={isMember}
                    projectId={project._id}
                    discussionIds={project.discussionBoard}
                    currentUserId={currentUserId}
                />
            </div>

            { isMember && <div className="project-section">
                <ProjectCheckInOut ismember={isMember} /> {/* Assuming this component is self-contained */}
            </div>}
        </div>
    );
}

export default Project;
