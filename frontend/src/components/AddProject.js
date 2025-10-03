// frontend/src/components/AddProject.js
import React, { useState, useEffect } from 'react';
import "../../public/assets/css/addproject.css";

function AddProject({ onCancel, onProjectAdded, ownerId }) {
    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: '',
        projectLanguages: '', // Corresponds to hashtags
        projectType: '',      // Will store the _id of the selected type
        projectVersion: '1.0.0',
        projectImage: ''      // Assuming a URL for now, as per backend API
    });
    const [projectTypes, setProjectTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Fetch project types on component mount
    useEffect(() => {
        const fetchProjectTypes = async () => {
            try {
                const response = await fetch('/api/types');
                const result = await response.json();
                if (result.success && result.types) {
                    setProjectTypes(result.types);
                    // Set the first type as default if available
                    if (result.types.length > 0) {
                        setFormData(prev => ({ ...prev, projectType: result.types[0]._id }));
                    }
                } else {
                    setError(result.message || 'Failed to fetch project types.');
                }
            } catch (err) {
                console.error('Error fetching project types:', err);
                setError('Failed to connect to server to fetch project types.');
            }
        };
        fetchProjectTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear messages on input change
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Basic client-side validation
        if (!formData.projectName.trim() || !formData.projectDescription.trim() || !formData.projectType) {
            setError('Project Name, Description, and Type are required.');
            setLoading(false);
            return;
        }
        if (!ownerId) {
            setError('Owner ID is missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {

            const dataToSend = {
                ...formData,
                ownerId: ownerId // Passed from Projects.js
            };

            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage(result.message);
                // Reset form fields after successful submission
                setFormData({
                    projectName: '',
                    projectDescription: '',
                    projectLanguages: '',
                    projectType: projectTypes.length > 0 ? projectTypes[0]._id : '', // Reset to default type
                    projectVersion: '1.0.0',
                    projectImage: ''
                });
                onProjectAdded(result.project); // Notify parent to update project list
                setTimeout(onCancel, 1500); // Close form after a short delay
            } else {
                setError(result.message || 'Failed to create project.');
            }
        } catch (err) {
            console.error('Error creating project:', err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-project-container"> {/* Added a container div for styling */}
            <form onSubmit={handleSubmit} className="add-project-form"> {/* Added a class for styling */}
                <h2>Create New Project</h2>

                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

                <div className="form-group">
                    <label htmlFor="projectName">Project Name *</label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectDescription">Description *</label>
                    <textarea
                        id="projectDescription"
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectLanguages">Programming Languages (space-separated hashtags)</label>
                    <input
                        type="text"
                        id="projectLanguages"
                        name="projectLanguages"
                        value={formData.projectLanguages}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="e.g. #javascript #react"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectType">Project Type *</label>
                    <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        disabled={loading || projectTypes.length === 0}
                        required
                    >
                        {projectTypes.length === 0 ? (
                            <option value="">Loading types...</option>
                        ) : (
                            projectTypes.map(type => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="projectVersion">Version</label>
                    <input
                        type="text"
                        id="projectVersion"
                        name="projectVersion"
                        value={formData.projectVersion}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="e.g. 1.0.0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectImage">Project Image URL (Optional)</label>
                    <input
                        type="url" // Changed to URL type as per backend expectation
                        id="projectImage"
                        name="projectImage"
                        value={formData.projectImage}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={loading}>Cancel</button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProject;

//u23527685 18