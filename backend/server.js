const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions
const UserReg = require('./models/UserReg'); // Import the User model
const Community = require('./models/Community');
const Invitation = require('./models/Invitation');
const UserCommunity = require('./models/UserCommunity');
const Gossip = require('./models/Gossip');
const Poster = require('./models/Poster');
const Vote = require('./models/Vote');


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Crucial for parsing JSON body requests

// MongoDB Connection
const mongoURI = "mongodb+srv://anirudhksixten:anirudh@cluster0.opazl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Basic GET endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if email is already used
        const userExists = await UserReg.findOne({ email });
        if (userExists) {
            return res.status(409).json({ error: 'Email is already registered.' });
        }

        // Create a new user
        const newUser = new UserReg({ name, email, password }); // You should hash the password before saving in a real app

        // Save user to the database
        await newUser.save();

        // Respond with the newly created user data (excluding password for security)
        res.status(201).json({ message: 'User created successfully!', user: { name, email } });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    // Simple validation
    if (!name || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Find user by name (replace UserReg with your model)
        const user = await UserReg.findOne({ name });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Check password (you should hash passwords for security)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Successful login
        res.status(200).json({ message: 'Login successful!', user: { name: user.name, email: user.email } });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/create-community', async (req, res) => {
    const { name: communityName, createdBy: creatorUsername } = req.body;

    console.log('Request received:', req.body); // Log incoming request

    // Validation
    if (!communityName || !creatorUsername) {
        return res.status(400).json({ error: 'Community name and creator username are required.' });
    }

    try {
        // Find the user creating the community by their name
        const user = await UserReg.findOne({ name: creatorUsername });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if a community with the same name exists to prevent duplicates
        const existingCommunity = await Community.findOne({ name: communityName });
        if (existingCommunity) {
            return res.status(409).json({ error: 'Community with this name already exists.' });
        }

        // Create a new community
        const newCommunity = new Community({
            name: communityName,
            community_member_quantity: 1
        });
        const savedCommunity = await newCommunity.save();

        // Add the creator to UserCommunity with updated fields
        const newUserCommunity = new UserCommunity({
            user_name: user.name, // Use user name instead of user_id
            community_name: savedCommunity.name, // Use community name instead of community_id
            joined_at: new Date(),
            role: 'admin',
            week_number: 1
        });
        await newUserCommunity.save();

        // Respond with success
        res.status(201).json({ message: 'Community created successfully!', communityId: savedCommunity._id });
    } catch (err) {
        console.error('Error creating community:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to search for users by name
app.get('/search-users', async (req, res) => {
    const { name } = req.query; // Get the search term from query parameters

    if (!name) {
        return res.status(400).json({ error: 'Search term is required.' });
    }

    try {
        // Use a case-insensitive regex to find matching users
        const regex = new RegExp(name, 'i'); // 'i' for case-insensitive search
        const users = await UserReg.find({ name: { $regex: regex } }).select('name email'); // Select only name and email fields

        // Respond with the list of matched users
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/invite-user', async (req, res) => {
    const { communityName, inviterName, inviteeName, status } = req.body;
    console.log("Received POST request to /invite-user");

    try {
        const newInvitation = new Invitation({
            community_name: communityName,
            inviter_name: inviterName,
            invitee_name: inviteeName,
            status: status,
        });

        await newInvitation.save();
        res.status(201).json({ message: 'Invitation created successfully!', invitationId: newInvitation._id });
    } catch (error) {
        console.error("Error creating invitation:", error);
        res.status(500).json({ error: 'Failed to create invitation.' });
    }
});

app.get('/invitations', async (req, res) => {
    try {
      const pendingInvitations = await Invitation.find({ status: 'pending' });
      res.json(pendingInvitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.post('/accept-invitation/', async (req, res) => {
    console.log('Request body:', req.body); // Log the incoming request body

    const { inviter_name, invitee_name, community_name } = req.body;
    

    try {
        // Find the invitation
        const invitation = await Invitation.findOneAndUpdate(
            { inviter_name, invitee_name },
            { status: 'accepted' },
            { new: true }
        );

        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found or names do not match.' });
        }

        // Increment the community member quantity
        const communityUpdateResult = await Community.findOneAndUpdate(
            { name: community_name },
            { $inc: { community_member_quantity: 1 } },
            { new: true } // Return the updated document
        );

        console.log('Community update result:', communityUpdateResult);


        if (!communityUpdateResult) {
            return res.status(404).json({ message: 'Community not found.' });
        }

        console.log(`Community updated: ${communityUpdateResult.name}, New Member Count: ${communityUpdateResult.community_member_quantity}`);

        // Save the user-community relationship
        const newUserCommunity = new UserCommunity({
            user_name: invitee_name,
            community_name: community_name,
            joined_at: new Date(),
            role: 'member',
            week_number: 1,
        });

        const savedUserCommunity = await newUserCommunity.save();
        console.log(`User-Community relationship saved: ${savedUserCommunity}`);

        res.json({ message: 'Invitation accepted and user added to community!' });
    } catch (error) {
        console.error('Error accepting invitation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  
  

  app.post('/decline-invitation', async (req, res) => {
    const invitationId = req.params.id;
    const { inviter_name, invitee_name } = req.body; // Extract parameters from request body
  
    try {
      // Find the invitation with the specified inviter_name and invitee_name
      const invitation = await Invitation.findOne({
        inviter_name: inviter_name,
        invitee_name: invitee_name,
      });
  
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found or names do not match.' });
      }
  
      // Update the status to 'declined'
      const updatedInvitation = await Invitation.findByIdAndUpdate(
        invitationId,
        { status: 'declined' },
        { new: true }
      );
  
      res.json(updatedInvitation);
    } catch (error) {
      console.error('Error declining invitation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  app.get('/user-communities', async (req, res) => {
    const { user_name } = req.query; // Get user_name from query parameters

    try {
        // Fetch communities from the UserCommunity collection
        const communities = await UserCommunity.find({ user_name });
        res.status(200).json(communities); // Return the communities
    } catch (error) {
        console.error("Error fetching user communities:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/community-members', async (req, res) => {
    const { community_name } = req.query;

    console.log(`Received request for community: ${community_name}`); // Log the request
    try {
        const communities = await UserCommunity.find({ community_name }); // Use find() to get all matching communities

        if (communities.length === 0) {
            console.log("Community not found"); // Log if no communities are found
            return res.status(404).json({ message: 'Community not found' });
        }

        console.log("Communities found:", communities); // Log the found communities

        // Extract members' user names from the communities
        const members = communities.map(community => community.user_name); // Extract only user names

        console.log("Members found:", members); // Log the found members

        // Select a random member from the members array
        let selectedMember = null;
        if (members.length > 0) {
            const randomIndex = Math.floor(Math.random() * members.length);
            selectedMember = members[randomIndex];
        }

        // Return both communities and the selected member
        res.status(200).json({ communities, members, selected_member: selectedMember });
    } catch (error) {
        console.error("Error fetching community members:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST endpoint to handle gossip posting
app.post('/post-gossip', async (req, res) => {
    const { gossipText, community_name, targeted_member_name, user_name } = req.body;

    if (!gossipText || !community_name || !targeted_member_name || !user_name) {
        return res.status(400).json({ message: "Member ID, gossip text, community name, targeted member name, and user name are required." });
    }

    try {
        // Create a new Gossip document
        const newGossip = new Gossip({
            poster_name: user_name, // Using the logged-in user's name
            targeted_member_name: targeted_member_name, // The targeted member's name
            gossip: gossipText,
            community_name: community_name,
            week: 0, // Initialize week to 0
            total_votes: 0 // Initialize total votes to 0
        });

        // Save the gossip to the database
        await newGossip.save();

        // Optionally, create a corresponding Poster document
        const newPoster = new Poster({
            poster_name: user_name, // Using the logged-in user's name
            gossip: gossipText,
            community_id: community_name, // or community ID if you have it
            week_number: 0, // Initialize week number to 0
        });

        await newPoster.save();

        // Optionally, initialize a Vote record if required
        const newVote = new Vote({
            gossip: gossipText,
            voter: user_name, // Assuming the poster is the initial voter
        });

        await newVote.save();

        res.status(201).json({ message: "Gossip posted successfully!" });
    } catch (error) {
        console.error("Error posting gossip:", error);
        res.status(500).json({ message: "Failed to post gossip. Please try again later." });
    }
});

app.get('/gossip', async (req, res) => {
    const { community_name, week } = req.query; // Extract community_name and week from query parameters
  
    try {
      // Fetch gossip from the database
      const gossips = await Gossip.find({ community_name, week }).sort({ createdAt: -1 });
      
      if (gossips.length > 0) {
        return res.json(gossips); // Send the gossip data as JSON
      } else {
        return res.status(404).json({ message: "No gossip found for this community and week." });
      }
    } catch (error) {
      console.error("Error fetching gossip:", error);
      return res.status(500).json({ message: "Failed to fetch gossip." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});