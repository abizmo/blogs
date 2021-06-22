const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { SECRET } = require('../utils/config');
const Blog = require('../models/blog');
const User = require('../models/user');

router.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
    });

  return res.status(200).json(blogs);
});

router.post('/', async (req, res) => {
  const { token } = req;
  if (!token) return res.status(401).json({ error: 'token missing or invalid' });
  const { id } = jwt.verify(token, SECRET);
  if (!id) return res.status(401).json({ error: 'token missing or invalid' });

  const { body } = req;
  const user = await User.findById(id);

  // eslint-disable-next-line no-underscore-dangle
  const blog = new Blog({ ...body, user: id });
  const savedBlog = await blog.save();
  // eslint-disable-next-line no-underscore-dangle
  user.blogs.push(blog._id);
  await user.save();

  return res.status(201).json(savedBlog);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) return res.status(404).end();
  return res.status(200).send(blog);
});

router.delete('/:id', async (req, res) => {
  const { token } = req;
  if (!token) return res.status(401).json({ error: 'token missing or invalid' });

  const decodedToken = jwt.verify(token, SECRET);
  if (!decodedToken.id) return res.status(401).json({ error: 'token missing or invalid' });

  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).end();

  if (blog.user.toString() !== decodedToken.id.toString()) return res.status(401).send({ error: 'forbidden' });

  await blog.remove();
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
