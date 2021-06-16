const router = require('express').Router();

const Blog = require('../models/blog');

router.get('/', async (req, res) => {
  const blogs = await Blog.find({});

  return res.status(200).json(blogs);
});

router.post('/', async (req, res) => {
  const blog = new Blog(req.body);
  const savedBlog = await blog.save();

  return res.status(201).json(savedBlog);
});

module.exports = router;
