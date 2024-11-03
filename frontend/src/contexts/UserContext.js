import React, { createContext, useContext, useState } from "react";

// Create a context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Default user state

  const login = (userData) => {
    // Assuming userData is an object like { name: "username", email: "user@example.com" }
    setUser(userData); // Set the user data, excluding sensitive info
  };

  const logout = () => {
    setUser(null); // Clear user data
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
