const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  posted_at: {
    type: Date,
    default: Date.now
  },
  posted_by: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Blog', blogSchema);
