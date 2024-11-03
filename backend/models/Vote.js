// models/Vote.js
const mongoose = require('mongoose');

// Define the Votes schema
const voteSchema = new mongoose.Schema({
    gossip: { type: String, required: true },
    voter: { type: String, ref: 'User', required: true },
    voted: { type: Boolean, default: false }, // Default to false
});

// Create a model from the schema
const Vote = mongoose.model('Vote', voteSchema);

// Export the Vote model
module.exports = Vote;
