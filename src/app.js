const express = require('express');
const app = express();
const cors = require('cors');
const Blog = require('./models/blog');

app.use(cors());
app.use(express.json());

// Get all blogs
app.get('/blog', async (req, res) => {
  try {
    const searchQuery = req.query.search ? { topic: { $regex: req.query.search, $options: 'i' } } : {};
    const limit = 5;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await Blog.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.results = await Blog.find(searchQuery).limit(limit).skip(startIndex).exec();
    res.status(200).json({
      status: 'success',
      result: results
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Create a blog
app.post('/blog', async (req, res) => {
  const blog = new Blog({
    topic: req.body.topic,
    description: req.body.description,
    posted_by: req.body.posted_by
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json({
      status: 'success',
      result: newBlog
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

// Update a blog
app.put('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.topic = req.body.topic || blog.topic;
    blog.description = req.body.description || blog.description;
    blog.posted_by = req.body.posted_by || blog.posted_by;

    const updatedBlog = await blog.save();

    res.status(200).json({
      status: 'success',
      result: updatedBlog
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

// Delete a blog
app.delete('/blog/:id', async (req, res) => {
  try {
    const removedBlog = await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      result: removedBlog
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = app;
