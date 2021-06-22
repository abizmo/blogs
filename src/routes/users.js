const bcrypt = require('bcrypt');
const router = require('express').Router();

const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/config');

router.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', {
      author: 1,
      title: 1,
      url: 1,
    });

  return res.status(200).json(users);
});

router.post('/', async (req, res) => {
  const { name, password, username } = req.body;

  if (username && username.length < 3) {
    const err = new Error('username is too short');
    err.name = 'ValidationError';
    throw err;
  }
  if (password && password.length < 3) {
    const err = new Error('password is too short');
    err.name = 'ValidationError';
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = new User({
    name,
    passwordHash,
    username,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = router;
