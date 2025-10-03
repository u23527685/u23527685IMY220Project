// frontend/src/components/EditProjectForm.js
import React, { useState, useEffect } from 'react';
//import '../../public/assets/css/editprojectform.css'; // Assuming you'll create this CSS

function EditProjectForm({ project, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        _id: project._id,
        name: project.name || '',
        description: project.description || '',
        hashtags: project.hashtags?.join(' ') || '', // Convert array to space-separated string
        type: project.type || '', // This will be the ObjectId of the type
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
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!formData.name.trim() || !formData.description.trim() || !formData.type) {
            setError('Project Name, Description, and Type are required.');
            setLoading(false);
            return;
        }

        try {

            const dataToSend = {
                _id: formData._id,
                name: formData.name,
                description: formData.description,
                hashtags: formData.hashtags.split(' ').map(tag => tag.trim()).filter(tag => tag.length > 0),
                type: formData.type,
            };

            const response = await fetch('/api/project', { // PUT /api/project endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage(result.message);
                onSave(); // Notify parent to refetch project data
                setTimeout(onCancel, 1500); // Close form after a short delay
            } else {
                setError(result.message || 'Failed to update project.');
            }
        } catch (err) {
            console.error('Error updating project:', err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-project-form-container">
            <form onSubmit={handleSubmit} className="edit-project-form">
                <h3>Edit Project Details</h3>

                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

                <div className="form-group">
                    <label htmlFor="name">Project Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="hashtags">Hashtags (space-separated)</label>
                    <input
                        type="text"
                        id="hashtags"
                        name="hashtags"
                        value={formData.hashtags}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="e.g. javascript react mongodb"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Project Type *</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
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

                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={loading}>Cancel</button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProjectForm;