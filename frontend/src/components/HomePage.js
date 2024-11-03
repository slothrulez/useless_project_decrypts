import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirects to the login page
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <p>WELCOME TO</p>
        <h1>Gossip Hub</h1>
        <p>Come, Let's Gossip in real time</p>
        <button onClick={handleLoginClick} className="login-button">
          Login
        </button>
      </header>
    </div>
  );
}

export default HomePage;
