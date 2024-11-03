import React, { useState } from "react";
import axios from "axios";
import "./InviteUserDialog.css";
import { useUser } from "../contexts/UserContext"; // Import the custom hook to access the user context

const InviteUserDialog = ({ isOpen, onClose }) => {
  const { user } = useUser(); // Get the current logged-in user
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // List of users based on search
  const [communityName, setCommunityName] = useState(""); // New community name
  const [communityId, setCommunityId] = useState(null); // Created community ID
  const [isCommunityCreated, setIsCommunityCreated] = useState(false); // New state to track community creation

  // Function to create a new community with the community name and username
  const handleCreateCommunity = async () => {
    if (communityName && user?.name) { // Ensure we have both community name and user name
      try {
        const response = await axios.post(`http://localhost:5000/create-community`, {
          name: communityName,
          createdBy: user.name, // Pass the username from context
        });
        setCommunityId(response.data.communityId); // Store the created community ID
        setIsCommunityCreated(true); // Set community created state to true
        alert("Community created successfully!");
      } catch (error) {
        console.error("Error creating community:", error);
      }
    } else {
      alert("Community name or user information is missing.");
    }
  };

  // Function to search for users based on search term
  const handleSearch = async () => {
    if (searchTerm) { // Trigger search only if there's a search term
      try {
        const response = await axios.get(`http://localhost:5000/search-users`, {
          params: { name: searchTerm },
        });
        setUsers(response.data); // Set users list with search results
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setUsers([]); // Clear users if no search term
    }
  };

  const handleInvite = async (inviteeName) => {
    if (communityName) { // Check if communityName is available
      try {
        // Save invitation to the database
        await axios.post(`http://localhost:5000/invite-user`, {
          communityName: communityName, // Send community name directly
          inviterName: user.name, // Use user._id for inviter_name (ObjectId)
          inviteeName: inviteeName, // Use inviteeId for invitee_name (ObjectId)
          status: "pending" // Default status
        });
        alert("Invitation sent!");
      } catch (error) {
        console.error("Error inviting user:", error);
      }
    } else {
      alert("Community name is not available."); // Alert if community name is missing
    }
  };

  return (
    <div className={`modal ${isOpen ? "is-open" : ""}`}>
      <div className="modal-content">
        <h2>{isCommunityCreated ? "Invite Users to Community" : "Create a Community"}</h2>

        {/* Community creation form */}
        {!isCommunityCreated ? (
          <>
            <input
              type="text"
              placeholder="Enter community name"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
            />
            <button onClick={handleCreateCommunity}>Create Community</button>
          </>
        ) : (
          <>
            {/* User search section */}
            <input
              type="text"
              placeholder="Search for users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button> {/* Search button */}
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name}
                  <button onClick={() => handleInvite(user.name)}>Invite</button>
                </li>
              ))}
            </ul>
          </>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InviteUserDialog;
