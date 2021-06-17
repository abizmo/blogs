const Blog = require('../models/blog');

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

const aBlog = initialBlogs[0];
const anotherBlog = {
  title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
};
const wrongBlog = {};

const dbInit = async () => {
  await Blog.deleteMany({});
  const blogsToSave = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogsToSave.map((blog) => blog.save());
  await Promise.all(promiseArray);
};

const initialLength = () => initialBlogs.length;

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const newBlog = new Blog(anotherBlog);
  await newBlog.save();
  await newBlog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return newBlog._id.toString();
};

module.exports = {
  aBlog, anotherBlog, blogsInDb, dbInit, initialLength, nonExistingId, wrongBlog,
};
