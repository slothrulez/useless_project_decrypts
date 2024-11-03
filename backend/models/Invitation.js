// models/Invitation.js
const mongoose = require('mongoose');

// Define the Invitations schema
const invitationSchema = new mongoose.Schema({
    community_name: { type: String, ref: 'Community', required: true },
    inviter_name: { type: String, ref: 'User', required: true },
    invitee_name: { type: String, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], required: true },
});

// Create a model from the schema
const Invitation = mongoose.model('Invitation', invitationSchema);

// Export the Invitation model
module.exports = Invitation;
