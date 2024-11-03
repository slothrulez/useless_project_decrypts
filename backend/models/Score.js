// models/Score.js
const mongoose = require('mongoose');

// Define the Scores schema
const scoreSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    community_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    week_number: { type: Number, required: true },
    score: { type: Number, required: true }, // Score value
});

// Create a model from the schema
const Score = mongoose.model('Score', scoreSchema);

// Export the Score model
module.exports = Score;
