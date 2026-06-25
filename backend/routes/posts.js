const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create post
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new Post({
            user: req.user.id,
            text: req.body.text,
            imageUrl: req.body.imageUrl
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get all posts (Feed)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', ['name', 'profilePic']).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Like / Unlike post
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        res.json(post.likes);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Comment on post
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const newComment = new Comment({
            post: req.params.id,
            user: req.user.id,
            text: req.body.text
        });
        await newComment.save();
        res.json(newComment);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get comments for post
router.get('/comment/:id', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id }).populate('user', ['name', 'profilePic']).sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
