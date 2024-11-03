// models/Community.js
const mongoose = require('mongoose');

// Define the community schema
const communitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    community_member_quantity: { type: Number, default: 0 }, // Default to 0
});

// Create a model from the schema
const Community = mongoose.model('Community', communitySchema);

// Export the Community model
module.exports = Community;
