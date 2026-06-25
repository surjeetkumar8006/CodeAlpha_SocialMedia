const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get other users (who to follow recommendations)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Follow / Unfollow user
router.put('/follow/:id', auth, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (userToFollow.followers.includes(req.user.id)) {
            // Unfollow
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user.id);
            currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
        } else {
            // Follow
            userToFollow.followers.push(req.user.id);
            currentUser.following.push(req.params.id);
        }
        await userToFollow.save();
        await currentUser.save();
        
        res.json({ msg: 'Updated successfully', followersCount: userToFollow.followers.length });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
