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
    const userNames = usersAtEnd.map(({ userName }) => userName);

    expect(usersAtEnd).toHaveLength(helper.usersLength() + 1);
    expect(userNames).toContain(helper.anotherUser.userName);
  });

  test('should failed when no name, userName or password', async () => {
    await api
      .post('/api/users')
      .send(helper.wrongUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.usersLength());
  });

  test('should failed when userName is not unique', async () => {
    const { body } = await api
      .post('/api/users')
      .send(helper.duplicatedUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(body.error).toContain('Invalid data sent');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.usersLength());
  });

  test('should failed when userName has length < 3', async () => {
    const { body } = await api
      .post('/api/users')
      .send({ name: 'test', userName: 'te', password: 'test' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(body.error).toContain('Invalid data sent');
  });

  test('should failed when password has length < 3', async () => {
    const { body } = await api
      .post('/api/users')
      .send({ name: 'test', userName: 'test', password: 'te' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(body.error).toContain('Invalid data sent');
  });
});

afterAll(() => {
  helper.closeDB();
});
