require('dotenv').config();

const { PORT } = process.env;
const { DB_URL } = process.env;

module.exports = {
  DB_URL,
  PORT,
};
