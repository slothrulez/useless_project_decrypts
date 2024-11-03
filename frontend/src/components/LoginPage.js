import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext"; // Adjust the import path
import "./LoginPage.css";

function LoginPage() {
  const { login } = useUser(); // Access the login function from context
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    // Basic validation
    if (!formData.name || !formData.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      console.log("User logged in:", response.data);
      alert("Login successful!");

      // Call the login function from context to store user data
      login({ name: formData.name, email: response.data.email }); // Adjust according to your backend response

      // Optionally, clear input fields
      setFormData({ name: "", password: "" });

      // Redirect to a different page (e.g., community)
      navigate("/community"); // Ensure this is the correct route
    } catch (error) {
      console.error("Error logging in:", error);
      const errorResponse = error.response?.data || { error: "Failed to log in." };
      setErrorMessage(errorResponse.error || "Failed to log in.");
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <p className="signup-text">
        Don't have an account?{" "}
        <span onClick={handleSignupClick} className="signup-link">
          Sign up
        </span>
      </p>
    </div>
  );
}

export default LoginPage;
