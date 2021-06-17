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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) return res.status(404).end();
  return res.status(200).send(blog);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndRemove(id);

  if (!blog) return res.status(404).end();
  return res.status(204).end();
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) return res.status(404).end();

  const { author, title, url } = req.body;
  if (author) blog.author = author;
  if (title) blog.title = title;
  if (url) blog.url = url;
  const updatedBlog = await blog.save();

  return res.status(201).json(updatedBlog);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  const blogUpdate = await Blog.findByIdAndUpdate(id, { likes }, { new: true });

  if (!blogUpdate) return res.status(404).end();
  return res.status(201).send(blogUpdate);
});
module.exports = router;
