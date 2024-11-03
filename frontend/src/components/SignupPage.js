import React, { useState } from "react";
import axios from "axios";
import "./SignupPage.css";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", formData);
      console.log("User created:", response.data);
      alert("Account created successfully!"); // Success message
    } catch (error) {
      // Handling error response from the server
      if (error.response) {
        // Server responded with a status other than 200 range
        alert(`Failed to create account: ${error.response.data.error || 'Unknown error occurred.'}`);
      } else if (error.request) {
        // Request was made but no response received
        alert("Failed to create account: No response from server.");
      } else {
        // Something happened in setting up the request
        alert(`Error: ${error.message}`);
      }
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
