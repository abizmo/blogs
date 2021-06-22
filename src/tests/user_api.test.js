const supertest = require('supertest');

const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await helper.dbInit();
});

describe('Get Users', () => {
  test('should return users as json', async () => {
    const response = await api
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(response.body).toHaveLength(helper.usersLength());
  });

  test('should not return the passwordHash and have id', async () => {
    const response = await api.get('/api/users');
    response.body.forEach((user) => {
      expect(user.passwordHash).toBeUndefined();
      expect(user.id).toBeDefined();
    });
  });
});

describe('POST /api/users', () => {
  test('should succed and there are two users', async () => {
    await api
      .post('/api/users')
      .send(helper.anotherUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    const usernames = usersAtEnd.map(({ username }) => username);

    expect(usersAtEnd).toHaveLength(helper.usersLength() + 1);
    expect(usernames).toContain(helper.anotherUser.username);
  });

  test('should failed when no name, username or password', async () => {
    await api
      .post('/api/users')
      .send(helper.wrongUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.usersLength());
  });

  test('should failed when username is not unique', async () => {
    const { body } = await api
      .post('/api/users')
      .send(helper.duplicatedUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(body.error).toContain('Invalid data sent');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.usersLength());
  });

  test('should failed when username has length < 3', async () => {
    const { body } = await api
      .post('/api/users')
      .send({ name: 'test', username: 'te', password: 'test' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(body.error).toContain('Invalid data sent');
  });

  test('should failed when password has length < 3', async () => {
    const { body } = await api
      .post('/api/users')
      .send({ name: 'test', username: 'test', password: 'te' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(body.error).toContain('Invalid data sent');
  });
});

afterAll(() => {
  helper.closeDB();
});
