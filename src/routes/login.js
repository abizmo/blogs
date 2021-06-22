const bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { SECRET } = require('../utils/config');
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const isPasswordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && isPasswordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };
  const token = await jwt.sign(userForToken, SECRET);

  return res.status(200)
    .send({
      token,
      username,
      name: user.name,
    });
});

module.exports = router;
