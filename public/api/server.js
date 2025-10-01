const express = require('express');
const path = require('path');
const { getAllBlogPosts, getBlogPost } = require('./blog');

const app = express();
const PORT = 3001;

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API endpoint to get all blog posts
app.get('/api/blog/posts', (req, res) => {
  try {
    const posts = getAllBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// API endpoint to get a single blog post
app.get('/api/blog/posts/:slug', (req, res) => {
  try {
    const post = getBlogPost(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Blog API server running on http://localhost:${PORT}`);
  console.log(`📝 Blog posts endpoint: http://localhost:${PORT}/api/blog/posts`);
  console.log(`📄 Single post endpoint: http://localhost:${PORT}/api/blog/posts/:slug`);
});

