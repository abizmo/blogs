const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await helper.dbInit();
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.blogsLength());
  });

  test('each blog has id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map(({ title }) => title);
    expect(titles).toContain(helper.aBlog.title);
  });
});

describe('addition of a new blog', () => {
  test('when post a blog there is one more', async () => {
    const token = `Bearer ${await helper.createToken()}`;
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.anotherBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(({ title }) => title);

    expect(response.body).toHaveLength(helper.blogsLength() + 1);
    expect(titles).toContain(helper.anotherBlog.title);
  });

  test('if there is not likes, then likes eq 0', async () => {
    const token = `Bearer ${await helper.createToken()}`;
    const response = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.anotherBlog);
    expect(response.body.likes).toBeDefined();
    expect(response.body.likes).toBe(0);
  });

  test('if ther is not title or url, then 400 - Bad Request', async () => {
    const token = `Bearer ${await helper.createToken()}`;
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.wrongBlog)
      .expect(400);
  });
});

describe('viewing a specifin blog', () => {
  test('should succeed with a valid id', async () => {
    // eslint-disable-next-line no-unused-vars
    const [blogToView, ...rest] = await helper.blogsInDb();

    const response = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(response.body).toEqual(processedBlogToView);
  });

  test('should fail with statuscode 404 if note does not exist', async () => {
    const nonExistingId = await helper.nonExistingId();

    await api
      .get(`/api/blogs/${nonExistingId}`)
      .expect(404);
  });

  test('should fail with statuscode 400 if id is invalid', async () => {
    const wrongId = `${await helper.nonExistingId()}invalid`;

    await api
      .get(`/api/blogs/${wrongId}`)
      .expect(400);
  });
});

describe('deletion of a blog', () => {
  test('should succeed with status code 204 if id is valid', async () => {
    // eslint-disable-next-line no-unused-vars
    const [blogToDelete, ...rest] = await helper.blogsInDb();
    const token = `Bearer ${await helper.createToken()}`;

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('should fail with statuscode 404 if note does not exist', async () => {
    const nonExistingId = await helper.nonExistingId();
    const token = `Bearer ${await helper.createToken()}`;

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', token)
      .expect(404);
  });

  test('should fail with statuscode 400 if id is invalid', async () => {
    const wrongId = `${await helper.nonExistingId()}invalid`;
    const token = `Bearer ${await helper.createToken()}`;

    await api
      .delete(`/api/blogs/${wrongId}`)
      .set('Authorization', token)
      .expect(400);
  });
});

describe('update of a blog', () => {
  test('should succeed with status code 201 if id is valid', async () => {
    // eslint-disable-next-line no-unused-vars
    const [blogToUpdate, ...rest] = await helper.blogsInDb();
    const modifiedBlog = { ...blogToUpdate, title: 'New Title' };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(modifiedBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const processedModifiedBlog = JSON.parse(JSON.stringify(modifiedBlog));
    expect(response.body).toEqual(processedModifiedBlog);

    const getResponse = await api.get('/api/blogs');
    const titles = getResponse.body.map(({ title }) => title);
    expect(getResponse.body).toHaveLength(helper.blogsLength());
    expect(titles).toContain('New Title');
  });

  test('should fail with statuscode 404 if note does not exist', async () => {
    const nonExistingId = await helper.nonExistingId();
    // eslint-disable-next-line no-unused-vars
    const [blogToUpdate, ...rest] = await helper.blogsInDb();
    const modifiedBlog = { ...blogToUpdate, title: 'New Title' };

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(modifiedBlog)
      .expect(404);
  });

  test('should fail with statuscode 400 if id is invalid', async () => {
    const wrongId = `${await helper.nonExistingId()}invalid`;
    // eslint-disable-next-line no-unused-vars
    const [blogToUpdate, ...rest] = await helper.blogsInDb();
    const modifiedBlog = { ...blogToUpdate, title: 'New Title' };

    await api
      .put(`/api/blogs/${wrongId}`)
      .send(modifiedBlog)
      .expect(400);
  });
});

describe('modify likes in a blog', () => {
  test('should succeed with status code 201 if id is valid', async () => {
    // eslint-disable-next-line no-unused-vars
    const [blogToUpdate, ...rest] = await helper.blogsInDb();

    const response = await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 700 })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const processedModifiedBlog = JSON.parse(JSON.stringify({ ...blogToUpdate, likes: 700 }));
    expect(response.body).toEqual(processedModifiedBlog);

    const getResponse = await api.get('/api/blogs');
    const likesArray = getResponse.body.map(({ likes }) => likes);
    expect(getResponse.body).toHaveLength(helper.blogsLength());
    expect(likesArray).toContain(700);
  });

  test('should fail with statuscode 404 if note does not exist', async () => {
    const nonExistingId = await helper.nonExistingId();

    await api
      .patch(`/api/blogs/${nonExistingId}`)
      .send({ likes: 700 })
      .expect(404);

    const getResponse = await api.get('/api/blogs');
    const likesArray = getResponse.body.map(({ likes }) => likes);
    expect(getResponse.body).toHaveLength(helper.blogsLength());
    expect(likesArray).not.toContain(700);
  });

  test('should fail with statuscode 400 if id is invalid', async () => {
    const wrongId = `${await helper.nonExistingId()}invalid`;

    await api
      .patch(`/api/blogs/${wrongId}`)
      .send({ likes: 700 })
      .expect(400);

    const getResponse = await api.get('/api/blogs');
    const likesArray = getResponse.body.map(({ likes }) => likes);
    expect(getResponse.body).toHaveLength(helper.blogsLength());
    expect(likesArray).not.toContain(700);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
