const ERROR_NAMES_MAP = {
  CastError: (res) => res.status(400).send({ error: 'Invalid ID' }),
  ValidationError: (res) => res.status(400).send({ error: 'Title and URL have to be defined' }),
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const knownErrorResponse = ERROR_NAMES_MAP[err.name];

  if (knownErrorResponse) return knownErrorResponse(res);
  return res.status(500).end();
};

module.exports = errorHandler;
