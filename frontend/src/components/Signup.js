import React, { useState } from "react";
import "../../public/assets/css/signup.css";

function Signup({oncancel, onsignup, toggleLogin }) {
  const [formData, setFormData] = useState({
    email: "",
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
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
        const response = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            password: formData.password
          })
        });

        const data = await response.json();

        if (data.success) {
          // Pass user data to parent component
          onsignup(data.user);
        } else {
          setApiError(data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Signup error:", error);
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
    <div id="SigninOverlay">
      <form id="SignupForm" onSubmit={handleSubmit} noValidate>
        <p onClick={cancel} className="cancel">X</p>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-describedby="emailError"
          disabled={isLoading}
        />
        {errors.email && (
          <p id="emailError" style={{ color: "red", marginTop: "4px" }}>
            {errors.email}
          </p>
        )}

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

        <input type="submit" value={isLoading ? "Signing up..." : "Signup"} disabled={isLoading} />
        <p className="otherlink" onClick={toggleLogin} style={{ cursor: "pointer" }}>
          <strong>Login?</strong>
        </p>
      </form>
    </div>
  );
}

export default Signup;