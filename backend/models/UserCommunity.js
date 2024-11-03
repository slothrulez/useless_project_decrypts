// models/UserCommunity.js
const mongoose = require('mongoose');

// Define the UserCommunity schema
const userCommunitySchema = new mongoose.Schema({
    user_name: { type: String, required: true }, // Replace user_id with user_name
    community_name: { type: String, required: true }, // Replace community_id with community_name
    joined_at: { type: Date, default: Date.now }, // Default to current date
    role: { type: String, required: true },
    week_number: { type: Number, required: true },
    gossip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gossip' }, // Optional
    votes: { type: Boolean, default: false }, // Default to false
});

// Create a model from the schema
const UserCommunity = mongoose.model('UserCommunity', userCommunitySchema);

// Export the UserCommunity model
module.exports = UserCommunity;
