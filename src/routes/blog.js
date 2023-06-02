const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");

router.get("/", async (req, res) => {
  try {
    const { page = 1, search = "" } = req.query;
    const blogs = await Blog.find({
      topic: { $regex: search, $options: "i" },
    })
      .sort({ posted_at: -1 })
      .skip((page - 1) * 5)
      .limit(5);
    res.json({ status: "success", result: blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { topic, description, posted_at, posted_by } = req.body;
    const blog = new Blog({ topic, description, posted_at, posted_by });
    await blog.save();
    res.json({ status: "success", result: blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { topic, description, posted_at, posted_by } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { topic, description, posted_at, posted_by },
      { new: true }
    );
    res.json({ status: "success", result: blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    res.json({ status: "success", result: blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
});

module.exports = router;
