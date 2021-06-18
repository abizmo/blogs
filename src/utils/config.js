require('dotenv').config();

const { PORT } = process.env;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const DB_URL = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL;

module.exports = {
  DB_URL,
  PORT,
  SALT_ROUNDS,
};
