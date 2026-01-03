const request = require('supertest');
const app = require('../server');
const { initDatabase, closeDatabase } = require('../src/models/database');

describe('账户接口测试', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.DATABASE_PATH = ':memory:';
    initDatabase();

    // 注册并登录获取token
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'accounttest',
        email: 'account@example.com',
        password: 'password123'
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'accounttest',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('GET /api/account', () => {
    test('应该返回用户的账户列表', async () => {
      const response = await request(app)
        .get('/api/account')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accounts');
      expect(Array.isArray(response.body.accounts)).toBe(true);
    });

    test('应该拒绝未认证的请求', async () => {
      const response = await request(app)
        .get('/api/account');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/account/balance', () => {
    test('应该返回账户总余额', async () => {
      const response = await request(app)
        .get('/api/account/balance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance');
      expect(typeof response.body.balance).toBe('number');
    });
  });
});

