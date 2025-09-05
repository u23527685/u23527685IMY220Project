
import "../../public/assets/css/login.css"

import React, { useState } from "react";

function Login({ onlogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\${};':"\\|,.<>/?]).{8,}$/;

  // Simple validation function
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

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onlogin(formData);
    }
  };

  return (
    <div id="LoginOverlay">
      <form id="LoginForm" onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
          aria-describedby="usernameError"
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
        />
        {errors.password && (
          <p id="passwordError" style={{ color: "red", marginTop: "4px" }}>
            {errors.password}
          </p>
        )}

        <input type="submit" value="Login" />

        <p className="otherlink">
          <strong>Signup?</strong>
        </p>
      </form>
    </div>
  );
}

export default Login;