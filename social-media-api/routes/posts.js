const express = require('express');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');

const router = express.Router();

router.route('/').get(getPosts).put(updatePost);

router.route('/:id').get(getPost).put(updatePost).delete(deletePost);

module.exports = routers