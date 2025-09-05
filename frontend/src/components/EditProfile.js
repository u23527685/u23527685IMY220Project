import React from "react";
import { useState } from "react";

function EditUser({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.email || '',
        name: user.name || '',
        surname: user.surname || '',
        bio: user.bio || '',
        website: user.website || '',
        socials: user.socials || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError('');
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

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            // Call the onSave function passed from parent
            await onSave(formData);
        } catch (error) {
            setError('Failed to update profile. Please try again.');
            console.error('Profile update error:', error);
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
                    <label htmlFor="socials">Social Media</label>
                    <input
                        type="text"
                        id="socials"
                        name="socials"
                        value={formData.socials}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="@yourusername or social media links"
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

export default EditUser;