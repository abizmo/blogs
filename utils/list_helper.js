const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((total, { likes }) => total + likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((prev, curr) => ((prev.likes > curr.likes) ? prev : curr));
};

module.exports = {
  dummy,
  favoriteBlog,
  totalLikes,
};
