const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { logger } = require('../utils/logger');

// Add detailed logging middleware
router.use((req, res, next) => {
  logger.info('Post Route Request:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Error handling middleware
router.use((err, req, res, next) => {
  logger.error('Post Route Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Post routes
router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// User posts route
router.get('/phone/:phone', postController.getUserPosts);

module.exports = router; 