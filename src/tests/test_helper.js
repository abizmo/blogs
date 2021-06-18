const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [{
  title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7,
}, {
  title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5,
}, {
  title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12,
}, {
  title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10,
}, {
  title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0,
},
];

const initialUser = {
  name: 'administrator',
  passwordHash: 'root',
  userName: 'root',
};

const anotherUser = {
  name: 'New User',
  password: 'newPassword',
  userName: 'newUser',
};

const duplicatedUser = {
  name: 'administrator',
  password: 'root',
  userName: 'root',
};

const wrongUser = {
  password: 'newPassword',
  userName: 'newUser',
};

const aBlog = initialBlogs[0];
const anotherBlog = {
  title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
};
const wrongBlog = {};

const closeDB = () => mongoose.connection.close();

const dbInit = async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const userToSave = new User(initialUser);
  const user = await userToSave.save();
  // eslint-disable-next-line no-underscore-dangle
  const blogsToSave = initialBlogs.map((blog) => new Blog({ ...blog, user: user._id }));
  const promises = blogsToSave.map((blog) => blog.save());
  const savedBlogs = await Promise.all(promises);
  const idBlogs = savedBlogs.map(({ _id }) => _id);
  user.blogs = idBlogs;
  await user.save();
};

const blogsLength = () => initialBlogs.length;
const usersLength = () => 1;

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const nonExistingId = async () => {
  const newBlog = new Blog(anotherBlog);
  await newBlog.save();
  await newBlog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return newBlog._id.toString();
};

module.exports = {
  aBlog,
  anotherBlog,
  initialUser,
  anotherUser,
  blogsInDb,
  usersInDb,
  closeDB,
  dbInit,
  blogsLength,
  usersLength,
  nonExistingId,
  wrongBlog,
  wrongUser,
  duplicatedUser,
};
