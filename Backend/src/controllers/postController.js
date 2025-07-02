const Post = require('../models/Post');
const { logger } = require('../utils/logger');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    logger.info('Create Post - Request:', req.body);
    const post = new Post(req.body);
    await post.save();
    logger.info('Create Post - Success:', post);
    res.status(201).json(post);
  } catch (error) {
    logger.error('Create Post - Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    logger.info('Get Posts - Request received');
    const { type } = req.query; // Get the type from query parameters
    let query = {};

    if (type) {
      // Add type filter to the query if type is provided
      query.type = type;
      logger.info('Get Posts - Filtering by type:', type);
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }); // Apply the query
    logger.info('Get Posts - Success:', { count: posts.length, query });
    res.json(posts);
  } catch (error) {
    logger.error('Get Posts - Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single post
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Get Post - Request:', { id });
    
    const post = await Post.findById(id);
    if (!post) {
      logger.warn('Get Post - Not found:', id);
      return res.status(404).json({ message: 'Post not found' });
    }
    
    logger.info('Get Post - Success:', post);
    res.json(post);
  } catch (error) {
    logger.error('Get Post - Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Update Post - Request:', { id, body: req.body });
    
    const post = await Post.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      logger.warn('Update Post - Not found:', id);
      return res.status(404).json({ message: 'Post not found' });
    }
    
    logger.info('Update Post - Success:', post);
    res.json(post);
  } catch (error) {
    logger.error('Update Post - Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Delete Post - Request:', { id });
    
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      logger.warn('Delete Post - Not found:', id);
      return res.status(404).json({ message: 'Post not found' });
    }
    
    logger.info('Delete Post - Success:', post);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Delete Post - Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get posts by phone
exports.getUserPosts = async (req, res) => {
  try {
    const { phone } = req.params;
    logger.info('Get User Posts - Request:', { phone });
    
    const posts = await Post.find({ phone }).sort({ createdAt: -1 });
    logger.info('Get User Posts - Success:', { count: posts.length });
    res.json(posts);
  } catch (error) {
    logger.error('Get User Posts - Error:', error);
    res.status(500).json({ message: error.message });
  }
}; 