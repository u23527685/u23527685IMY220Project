import { NavLink  } from "react-router-dom";
import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../public/assets/svg/logo.svg";
import "../../public/assets/css/navbar.css";
import profileimg from "../../public/assets/svg/default user.svg";

function Navbar(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(profileimg);

    useEffect(() => {
    // Get userId from sessionStorage
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.warn("No user ID found in sessionStorage");
      return;
    }

    // Fetch user info from backend
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`);
        const data = await response.json();

        if (data.success && data.user) {
          setUser(data.user);

          // If user has profile image path in DB, set that
          if (data.user.profileImage && data.user.profileImage.filePath) {
            setProfileImageUrl(`http://localhost:3000${data.user.profileImage.filePath}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user in Navbar:", error);
      }
    };

    fetchUser();
  }, []);

    const handleLogout=()=>{
        sessionStorage.clear();
        navigate("/");
    }
    return(
        <nav>
      {/* LEFT: Logo */}
      <div id="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
        <img width="100px" src={logo} alt="Logo" />
      </div>

      {/* MIDDLE: Navigation links */}
      <div id="middle">
        <NavLink className={({ isActive }) => (isActive ? "isActive" : undefined)} to="/home">
          <h2>Home</h2>
        </NavLink>

        {user && (
          <NavLink
            className={({ isActive }) => (isActive ? "isActive" : undefined)}
            to={`/projects/${user._id}`}
          >
            <h2>Projects</h2>
          </NavLink>
        )}
      </div>

      {/* RIGHT: Profile info and logout */}
      <div id="profilelink">
        <button onClick={handleLogout} className="logout-btn">Logout</button>

        {user ? (
          <NavLink
            className={({ isActive }) => (isActive ? "isActive" : undefined)}
            to="/profile"
          >
            <h2>{user.username || "User"}</h2>
            <img height="50px" src={profileImageUrl} alt="Profile" onError={(e) => (e.target.src = profileimg)}
            />
          </NavLink>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </nav>
    )
}

export default Navbar;

