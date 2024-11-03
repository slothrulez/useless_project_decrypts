import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import "./CommunityDetailsPage.css";

function CommunityDetailsPage() {
  const { communityName } = useParams();
  const { user } = useUser();
  const [members, setMembers] = useState([]);
  const [gossipData, setGossipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [gossip, setGossip] = useState("");
  const [targetedMemberName, setTargetedMemberName] = useState("");
  const [gossipError, setGossipError] = useState(null);

  // Fetch community members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/community-members`, {
          params: { community_name: communityName },
        });

        if (Array.isArray(response.data.communities) && response.data.communities.length > 0) {
          const allMembers = response.data.communities;
          setMembers(allMembers);

          // Random member selection for gossip
          const randomIndex = Math.floor(Math.random() * allMembers.length);
          const randomMember = allMembers[randomIndex];
          setSelectedMember(randomMember);
        } else {
          setMembers([]);
          console.warn("Unexpected response format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching community members:", err);
        setError("Failed to load members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [communityName]);

  // Fetch gossip data
  useEffect(() => {
    const fetchGossip = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/gossip`, {
          params: { community_name: communityName, week: 0 },
        });
        console.log("Gossip fetched:", response.data);
        setGossipData(response.data);
      } catch (err) {
        console.error("Error fetching gossip:", err);
        setError("Failed to load gossip. Please try again later.");
      }
    };
    fetchGossip();
  }, [communityName]);

  const handleGossipChange = (e) => {
    setGossip(e.target.value);
  };

  const handleTargetedMemberChange = (e) => {
    setTargetedMemberName(e.target.value);
  };

  const handlePostGossip = async () => {
    if (!gossip || !targetedMemberName) {
      setGossipError("Gossip and targeted member name cannot be empty!");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/post-gossip`, {
        gossipText: gossip,
        community_name: communityName,
        targeted_member_name: targetedMemberName,
        user_name: user.name,
      });
      setGossip("");
      setTargetedMemberName("");
      setGossipError(null);
      alert("Gossip posted successfully!");
    } catch (err) {
      console.error("Error posting gossip:", err);
      setGossipError("Failed to post gossip. Please try again later.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="community-details">
      <h1>{communityName} Members</h1>
      {user && <p>Welcome, {user.name}!</p>}

      {error && <p className="error-message">{error}</p>}

      {/* Display Today's Headlines */}
      {gossipData && gossipData.length > 0 ? (
        <div className="headlines">
          <h2>Today's Headlines:</h2>
          <ul>
            {gossipData.map((item) => (
              <li key={item._id}>{item.gossip || "No Text"}</li> // Displaying 'gossip' property
            ))}
          </ul>
        </div>
      ) : (
        <p>No gossip available for today.</p>
      )}

      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul className="members-list">
          {members.map((member) => (
            <li key={member._id} className="member-item">
              <span>{member.user_name}</span> - Role: {member.role}
            </li>
          ))}
        </ul>
      )}

      {selectedMember && selectedMember.user_name === user.name && (
        <div className="gossip-posting">
          <h2>You are chosen to post the gossip, {selectedMember.user_name}!</h2>
          <textarea
            value={gossip}
            onChange={handleGossipChange}
            placeholder="Write your gossip here..."
          />
          <input
            type="text"
            value={targetedMemberName}
            onChange={handleTargetedMemberChange}
            placeholder="Targeted member's name..."
          />
          {gossipError && <p className="error-message">{gossipError}</p>}
          <button onClick={handlePostGossip}>Post Gossip</button>
        </div>
      )}
    </div>
  );
}

export default CommunityDetailsPage;
