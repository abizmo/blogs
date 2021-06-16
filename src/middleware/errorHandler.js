// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).send({ error: 'Title and URL have to be defined' });
  return res.status(500).end();
};

module.exports = errorHandler;
