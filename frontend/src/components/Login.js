
import "../../public/assets/css/loginstyle.css"

import React, { useState } from "react";

function Login({ onlogin, toggleSignup, oncancel }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const data = await response.json();

        if (data.success) {
          // Pass user data to parent component
          if (data.user && data.user._id) {
          sessionStorage.setItem('userId', data.user._id);
          }
          onlogin(data.user);
        } else {
          setApiError(data.message || "Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setApiError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cancel=()=>{
    if(oncancel)
      oncancel();
  }

  return (
    <div id="LoginOverlay">
      <form id="LoginForm" onSubmit={handleSubmit} noValidate>
        <p onClick={cancel} className="cancel">X</p>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
          aria-describedby="usernameError"
          disabled={isLoading}
        />
        {errors.username && (
          <p id="usernameError" style={{ color: "red", marginTop: "4px" }}>
            {errors.username}
          </p>
        )}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          aria-describedby="passwordError"
          disabled={isLoading}
        />
        {errors.password && (
          <p id="passwordError" style={{ color: "red", marginTop: "4px" }}>
            {errors.password}
          </p>
        )}

        {apiError && (
          <p style={{ color: "red", marginTop: "8px", marginBottom: "8px" }}>
            {apiError}
          </p>
        )}

        <input type="submit" value={isLoading ? "Logging in..." : "Login"} disabled={isLoading} />
        <p className="otherlink" onClick={toggleSignup} style={{ cursor: "pointer" }}>
          <strong>Signup?</strong>
        </p>
      </form>
    </div>
  );
}

export default Login;