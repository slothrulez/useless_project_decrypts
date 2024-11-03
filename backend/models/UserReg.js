// models/User.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create a model from the schema
const UserReg = mongoose.model('UserReg', userSchema);

// Export the User model
module.exports = UserReg;
