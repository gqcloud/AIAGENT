const request = require('supertest');
const app = require('../server');
const { getDatabase, initDatabase, closeDatabase } = require('../src/models/database');

describe('认证接口测试', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.DATABASE_PATH = ':memory:';
    initDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    test('应该成功注册新用户', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', '注册成功');
      expect(response.body).toHaveProperty('userId');
    });

    test('应该拒绝无效的注册数据', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
    });

    test('应该拒绝重复的用户名', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          email: 'dup1@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          email: 'dup2@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'logintest',
          email: 'login@example.com',
          password: 'password123'
        });
    });

    test('应该成功登录', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'logintest',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    test('应该拒绝错误的密码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'logintest',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});

