const datastore = require("../models");

// Get all users
const getAllUsers = (req, res) => {
    res.status(200).json(datastore.users);
};

// Get user by ID
const getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = datastore.users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
};

// POST create a new user
const createUser = (req, res) => {
    const { username, email, name } = req.body;
    
    // Basic validation
    if (!username || !email || !name) {
        return res.status(400).json({ error: 'Required fields missing' });
    }
    
    // Check if username or email already exists
    const userExists = datastore.users.some(user => user.username === username);
    const emailExists = datastore.users.some(user => user.email === email);
    
    if (userExists) {
        return res.status(409).json({ error: 'Username already taken' });
    }
    if (emailExists) {
        return res.status(409).json({ error: 'Email already registered' });
    }
    
    const newUser = {
        id: datastore.nextId++,
        username,
        email,
        name,
        followers: [],
        createdAt: new Date().toISOString()
    };
    
    datastore.users.push(newUser);
    res.status(201).json(newUser);
};

// PUT update a user
const updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = datastore.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const { email, name } = req.body;
    const user = datastore.users[userIndex];
    
    // Update fields if provided
    if (email) {
        const emailExists = datastore.users.some(u => u.email === email && u.id !== userId);
        if (emailExists) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        user.email = email;
    }
    
    if (name) {
        user.name = name;
    }
    
    user.updatedAt = new Date().toISOString();
    res.status(200).json(user);
};

// DELETE a user
const deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = datastore.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove the user
    datastore.users.splice(userIndex, 1);
    res.status(204).send();

    // Remove user's videos and comments
    datastore.videos = datastore.videos.filter(video => video.userId !== userId);
    datastore.comments = datastore.comments.filter(comment => comment.userId !== userId);

    // Remove user from followers/following lists
    datastore.users.forEach(user => {
        user.followers = user.followers.filter(id => id !== userId);
        user.following = user.following.filter(id => id !== userId);
    });
    
    // Remove the user
    datastore.users = datastore.users.filter(user => user.id !== userId);
    res.status(204).send();
};

// Get user videos
const getUserVideos = (req, res) => {
    const userId = parseInt(req.params.id);
    if (!checkUserExists(userId)) {
        return res.status(404).json({ error: 'User not found' });
    }
    const videos = datastore.videos.filter(v => v.userId === userId);
    res.status(200).json(videos);
};

// Get user followers
const getUserFollowers = (req, res) => {
    const userId = parseInt(req.params.id);
    if (!checkUserExists(userId)) {
        return res.status(404).json({ error: 'User not found' });
    }
    const user = datastore.users.find(u => u.id === userId);
    const followers = user.followers.map(followerId => 
        datastore.users.find(u => u.id === followerId) || null
    ).filter(Boolean);
    res.status(200).json(followers);
};

// POST follow user
const followUser = (req, res) => {
    const followerId = parseInt(req.body.followerId);
    const userId = parseInt(req.params.id);
    if (!checkUserExists(userId) || !checkUserExists(followerId)) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const user = datastore.users.find(u => u.id === userId);
    if (user.followers.includes(followerId)) {
        return res.status(409).json({ error: 'Already following this user' });
    }
    
    user.followers.push(followerId);
    res.status(201).json({ message: 'User followed successfully' });
};

// DELETE unfollow user
const unfollowUser = (req, res) => {
    const userToUnfollowId = parseInt(req.params.id);
    const { followerId } = req.body;

    if (!followerId) {
        return res.status(400).json({ error: 'followerId is required' });
    }

    const followerIdInt = parseInt(followerId);
    const userToUnfollow = dataStore.users.find(u => u.id === userToUnfollowId);
    const follower = dataStore.users.find(u => u.id === followerIdInt);

    if (!userToUnfollow || !follower) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if following relationship exists
    const followerIndex = userToUnfollow.followers.indexOf(followerIdInt);
    const followingIndex = follower.following.indexOf(userToUnfollowId);

    if (followerIndex === -1 || followingIndex === -1) {
        return res.status(404).json({ error: 'Follow relationship not found' });
    }
    
    // Remove follower relationship
    userToUnfollow.followers.splice(followerIndex, 1);
    follower.following.splice(followingIndex, 1);
    
    res.status(204).end();
    };
    
    module.exports = {
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        getUserVideos,
        getUserFollowers,
        followUser,
        unfollowUser
    };