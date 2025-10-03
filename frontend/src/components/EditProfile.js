// frontend/src/components/EditProfile.js
import React, { useState, useEffect } from "react";
import "../../public/assets/css/editprofile.css";

function EditProfile({ user, onSave, onCancel }) {
    // Initialize formData with user's current personalInfo fields
    const [formData, setFormData] = useState({
        _id: user._id || '', // Crucial for API update
        username: user.username || '',
        email: user.email || '',
        name: user.name || '',
        surname: user.surname || '',
        bio: user.personalInfo?.bio || '', // Access nested personalInfo
        website: user.personalInfo?.website || '', // Access nested personalInfo
        socials: user.personalInfo?.socials?.join(', ') || '' // Assuming socials is an array, join for editing
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Effect to update formData if the user prop changes (e.g., after a save)
    useEffect(() => {
        setFormData({
            _id: user._id || '',
            username: user.username || '',
            email: user.email || '',
            name: user.name || '',
            surname: user.surname || '',
            bio: user.personalInfo?.bio || '',
            website: user.personalInfo?.website || '',
            socials: user.personalInfo?.socials?.join(', ') || ''
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(''); // Clear error when user starts typing
        if (successMessage) setSuccessMessage(''); // Clear success message
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            return 'Username is required';
        }
        if (!formData.email.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return 'Please enter a valid email address';
        }
        if (formData.username.length < 3) {
            return 'Username must be at least 3 characters long';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {

            // Prepare data for API, matching backend structure
            const dataToSend = {
                _id: formData._id,
                username: formData.username,
                email: formData.email,
                name: formData.name,
                surname: formData.surname,
                personalInfo: {
                    bio: formData.bio,
                    website: formData.website,
                    socials: formData.socials.split(',').map(s => s.trim()).filter(s => s.length > 0) // Convert back to array
                }
            };

            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage(result.message);
                // Call the onSave function passed from parent with the updated data
                // The parent (MyProfile) should then refetch the user or update its state
                onSave(dataToSend); // Pass the data that was sent, or refetch in parent
                // Optionally, close the editing form after a short delay
                setTimeout(onCancel, 1500);
            } else {
                setError(result.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setError('Failed to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-user">
            <form onSubmit={handleSubmit} className="edit-user-form">
                <h3>Edit Profile</h3>

                {error && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="success-message" style={{ color: 'green', marginBottom: '15px' }}>
                        {successMessage}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Username *</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">First Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Enter first name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surname">Last Name</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Enter last name"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Tell us about yourself..."
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="https://yourwebsite.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="socials">Social Media (comma-separated)</label>
                    <input
                        type="text"
                        id="socials"
                        name="socials"
                        value={formData.socials}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="@yourusername, link, another link"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="save-button"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;

//23527685 18