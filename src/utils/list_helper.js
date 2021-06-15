const _ = require('lodash');

const dummy = (blogs) => 1;

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((prev, curr) => ((prev.likes > curr.likes) ? prev : curr));
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsByAuthor = _.groupBy(blogs, 'author');
  const blogsCountByAuthor = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [author, b] of Object.entries(blogsByAuthor)) {
    blogsCountByAuthor.push({ author, blogs: b.length });
  }

  return _.maxBy(blogsCountByAuthor, 'blogs');
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const blogsByAuthor = _.groupBy(blogs, 'author');
  const blogsLikesByAuthor = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [author, authorBlogs] of Object.entries(blogsByAuthor)) {
    blogsLikesByAuthor.push({
      author,
      likes: authorBlogs.reduce((total, { likes }) => total + likes, 0),
    });
  }
  return _.maxBy(blogsLikesByAuthor, 'likes');
};

const totalLikes = (blogs) => blogs.reduce((total, { likes }) => total + likes, 0);

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes,
};
