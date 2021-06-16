const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await helper.dbInit();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect('Content-Type', /json/)
    .expect(200);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialLength());
});

test('each blog has id', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test('when post a blog there is one more', async () => {
  await api
    .post('/api/blogs')
    .send(helper.anotherBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const titles = response.body.map(({ title }) => title);

  expect(response.body).toHaveLength(helper.initialLength() + 1);
  expect(titles).toContain(helper.anotherBlog.title);
});

test('if there is not likes, then likes eq 0', async () => {
  const response = await api.post('/api/blogs').send(helper.anotherBlog);
  expect(response.body.likes).toBeDefined();
  expect(response.body.likes).toBe(0);
});

test('if ther is not title or url, then 400 - Bad Request', async () => {
  await api
    .post('/api/blogs')
    .send(helper.wrongBlog)
    .expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
