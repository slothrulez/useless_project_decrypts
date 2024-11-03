// models/Poster.js
const mongoose = require('mongoose');

// Define the Poster schema
const posterSchema = new mongoose.Schema({
    poster_name: { type: String, ref: 'User', required: true },
    gossip: { type: String, required: true },
    community_id: { type: String, ref: 'Community', required: true },
    week_number: { type: Number, required: true },
    score: { type: Number, default: 0 }, // Default to 0
});

// Create a model from the schema
const Poster = mongoose.model('Poster', posterSchema);

// Export the Poster model
module.exports = Poster;
