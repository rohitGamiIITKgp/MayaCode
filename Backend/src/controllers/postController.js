const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  console.log(`HTTP ${req.method} ${req.url} - Create Post`, req.body);
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  console.log(`HTTP ${req.method} ${req.url} - Get Posts`, req.query);
  try {
    const { type } = req.query; // Get the type from query parameters
    let query = {};

    if (type) {
      // Add type filter to the query if type is provided
      query.type = type;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }); // Apply the query
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post
exports.getPost = async (req, res) => {
  console.log(`HTTP ${req.method} ${req.url} - Get Post`, req.params);
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  console.log(`HTTP ${req.method} ${req.url} - Update Post`, req.params, req.body);
  try {
    const { id } = req.params;
    
    const post = await Post.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  console.log(`HTTP ${req.method} ${req.url} - Delete Post`, req.params);
  try {
    const { id } = req.params;
    
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by phone
exports.getUserPosts = async (req, res) => {
  console.log(`HTTP ${req.method} ${req.url} - Get User Posts`, req.params);
  try {
    const { phone } = req.params;
    
    const posts = await Post.find({ phone }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 