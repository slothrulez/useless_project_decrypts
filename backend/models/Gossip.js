// models/Gossip.js
const mongoose = require('mongoose');

// Define the Gossips schema
const gossipSchema = new mongoose.Schema({
    poster_name: { type: String, ref: 'User', required: true },
    targeted_member_name: { type: String, ref: 'User' }, // Optional
    gossip: { type: String, required: true },
    community_name: { type: String, required: true },
    week: { type: Number, required: true },
    total_votes: { type: Number, default: 0 }, // Default to 0
});

// Create a model from the schema
const Gossip = mongoose.model('Gossip', gossipSchema);

// Export the Gossip model
module.exports = Gossip;
