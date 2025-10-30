import React, { useState, useEffect } from "react";
import "../../public/assets/css/editprofile.css";

function EditProfile({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        _id: user._id || '',
        username: user.username || '',
        email: user.email || '',
        name: user.name || '',
        surname: user.surname || '',
        bio: user.personalInfo?.bio || '',
        website: user.personalInfo?.website || '',
        socials: user.personalInfo?.socials?.join(', ') || ''
    });

    const [profileImage, setProfileImage] = useState(null); // File object for upload
    const [previewUrl, setPreviewUrl] = useState(null); // To show preview of selected image
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

        // Load existing profile image if available
        setPreviewUrl(`/api/users/${user._id}/profile`);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (!formData.username.trim()) return 'Username is required';
        if (!formData.email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email';
        if (formData.username.length < 3) return 'Username must be at least 3 characters';
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
            // Update user data
            const dataToSend = {
                _id: formData._id,
                username: formData.username,
                email: formData.email,
                name: formData.name,
                surname: formData.surname,
                personalInfo: {
                    bio: formData.bio,
                    website: formData.website,
                    socials: formData.socials.split(',').map(s => s.trim()).filter(s => s.length > 0)
                }
            };

            const updateResponse = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            const updateResult = await updateResponse.json();
            if (!updateResult.success) throw new Error(updateResult.message);

            //  Upload profile image (if selected)
            if (profileImage) {
                const formDataToUpload = new FormData();
                formDataToUpload.append("file", profileImage);

                const uploadResponse = await fetch(`/api/user/${formData._id}/upload`, {
                    method: 'POST',
                    body: formDataToUpload
                });

                const uploadResult = await uploadResponse.json();
                if (!uploadResult.success) throw new Error(uploadResult.message);

                setSuccessMessage("Profile picture uploaded successfully!");
            }

            // All done
            setSuccessMessage(updateResult.message || "Profile updated successfully!");
            onSave(dataToSend);
            setTimeout(onCancel, 1500);

        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.message || 'Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-user">
            <form onSubmit={handleSubmit} className="edit-user-form">
                <h3>Edit Profile</h3>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* PROFILE IMAGE UPLOAD */}
                <div className="form-group image-upload">
                    <label>Profile Picture</label>
                    {previewUrl && (
                        <div className="image-preview">
                            <img src={previewUrl} alt="Profile Preview" width="120" height="120" />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                    />
                </div>

                {/* OTHER FIELDS */}
                <div className="form-group">
                    <label htmlFor="username">Username *</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading}
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
                        rows="3"
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
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={loading} className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="save-button">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
