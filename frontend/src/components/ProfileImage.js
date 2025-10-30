import React, { useEffect, useState } from "react";
import defaultProfile from "../../public/assets/svg/default user.svg";
import "../../public/assets/css/profileimage.css";

/**
 * Props:
 * - userId (required): The ID of the user whose profile image to fetch.
 * - size (optional): The size (in px) of the displayed image. Default 120.
 * - refreshKey (optional): A value that changes when you want to refetch the image (e.g. after upload).
 */
function ProfileImage({ userId, size = 120, refreshKey }) {
  const [imageSrc, setImageSrc] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) {
      setImageSrc(defaultProfile);
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`/api/users/${userId}/profile`, {
          method: "GET",
          cache: "no-store", // Avoid caching old image after upload
        });

        if (!response.ok) {
          console.log("profile image not foundt");
        }

        // Create object URL from blob
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (err) {
        console.warn(`No profile image found for user ${userId}:`, err.message);
        setImageSrc(defaultProfile);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup old blob URLs to prevent memory leaks
    return () => {
      if (imageSrc && imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [userId, refreshKey]);

  return (
    <div className="profile-image-wrapper" style={{ width: size, height: size }}>
      {loading ? (
        <div className="profile-image-loading">Loading...</div>
      ) : (
        <img
          src={imageSrc}
          alt="Profile"
          width={size}
          height={size}
          className="profile-image"
          onError={() => setImageSrc(defaultProfile)}
        />
      )}
      {error && (
        <p className="profile-image-error" style={{ color: "#888", fontSize: "0.8rem" }}>
          No profile image
        </p>
      )}
    </div>
  );
}

export default ProfileImage;
