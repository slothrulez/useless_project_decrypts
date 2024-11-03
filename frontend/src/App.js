import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; 
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import CommunityPage from "./components/CommunityPage";
import CommunityDetailsPage from "./components/CommunityDetailsPage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community" element={<CommunityDetailsPage />} />
          <Route path="/community/:communityName" element={<CommunityDetailsPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
