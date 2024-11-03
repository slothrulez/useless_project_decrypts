import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import InviteUserDialog from "./InviteUserDialog"; 
import { useNavigate } from "react-router-dom";
import "./CommunityPage.css";

function CommunityPage() {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);

  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    navigate(`/community/${communityName}`);
  };

  const handleCreateCommunity = () => {
    setIsDialogOpen(true);
  };

  const handleCommunityCreate = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/create-community`, {
        name: communityName,
        community_member_quantity: 0,
      });
      alert(`Community "${communityName}" created!`);
      setIsDialogOpen(false);
      setCommunityName("");
      fetchUserCommunities();
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  const handleInvite = async (userName) => {
    try {
      await axios.post(`http://localhost:5000/invite-user`, {
        community_name: communityName,
        user_name: userName,
      });
      alert("Invitation sent and member added!");
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/invitations");
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user-communities`, {
        params: { user_name: user.name },
      });
      setUserCommunities(response.data);
    } catch (error) {
      console.error("Error fetching user communities:", error);
    }
  };

  const handleAcceptInvitation = async (inviterName, inviteeName, communityName) => {
    try {
      await axios.post(`http://localhost:5000/accept-invitation/`, {
        inviter_name: inviterName,
        invitee_name: inviteeName,
        community_name: communityName,
      });
      fetchInvitations();
      fetchUserCommunities();
      alert("Invitation accepted!");
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleDeclineInvitation = async (inviterName, inviteeName) => {
    try {
      await axios.post(`http://localhost:5000/decline-invitation`, {
        inviter_name: inviterName,
        invitee_name: inviteeName,
      });
      fetchInvitations();
      alert("Invitation declined!");
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
    fetchUserCommunities();
  }, []);

  return (
    <div className="community-page">
      <h1>Hi, {user ? user.name : "User"}!</h1>
      <div className="button-container">
        <button onClick={handleJoinCommunity}>Join Community</button>
        <button onClick={handleCreateCommunity}>Create Community</button>
      </div>

      <div className="invitations-section">
        <h2>Pending Invitations</h2>
        {invitations.length === 0 ? (
          <p>No pending invitations.</p>
        ) : (
          <ul className="invitations-list">
            {invitations.map((invitation) => (
              <li key={invitation._id}>
                {invitation.inviter_name} invited you to join {invitation.community_name}.
                <button onClick={() => handleAcceptInvitation(invitation.inviter_name, invitation.invitee_name, invitation.community_name)}>Accept</button>
                <button onClick={() => handleDeclineInvitation(invitation.inviter_name, invitation.invitee_name)}>Decline</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Your Communities</h2>
      {userCommunities.length === 0 ? (
        <p>You are not part of any communities.</p>
      ) : (
        <ul className="community-list">
          {userCommunities.map((community) => (
            <button
              key={community._id}
              className="community-row"
              onClick={() => navigate(`/community/${community.community_name}`)}
            >
              {community.community_name} - Members: {community.community_member_quantity}
            </button>
          ))}
        </ul>
      )}

      {isDialogOpen && (
        <InviteUserDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          communityName={communityName}
          setCommunityName={setCommunityName}
          onCreate={handleCommunityCreate}
          onInvite={handleInvite}
        />
      )}
    </div>
  );
}

export default CommunityPage;
