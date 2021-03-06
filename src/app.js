const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');

const errorHandler = require('./middleware/errorHandler');
const blogsRoutes = require('./routes/blogs');
const config = require('./utils/config');

const app = express();

const mongoUrl = config.DB_URL;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRoutes);
app.use(errorHandler);

module.exports = app;
