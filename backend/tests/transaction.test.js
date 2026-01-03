const request = require('supertest');
const app = require('../server');
const { initDatabase, closeDatabase } = require('../src/models/database');

describe('交易接口测试', () => {
  let authToken;
  let accountId1;
  let accountId2;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.DATABASE_PATH = ':memory:';
    initDatabase();

    // 注册并登录获取token
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'transactiontest',
        email: 'transaction@example.com',
        password: 'password123'
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'transactiontest',
        password: 'password123'
      });

    authToken = loginResponse.body.token;

    // 获取账户ID
    const accountsResponse = await request(app)
      .get('/api/account')
      .set('Authorization', `Bearer ${authToken}`);

    accountId1 = accountsResponse.body.accounts[0].id;

    // 创建第二个用户和账户用于转账测试
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'transactiontest2',
        email: 'transaction2@example.com',
        password: 'password123'
      });

    const loginResponse2 = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'transactiontest2',
        password: 'password123'
      });

    const accountsResponse2 = await request(app)
      .get('/api/account')
      .set('Authorization', `Bearer ${loginResponse2.body.token}`);

    accountId2 = accountsResponse2.body.accounts[0].id;
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('POST /api/transactions/transfer', () => {
    test('应该成功转账', async () => {
      const response = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fromAccountId: accountId1,
          toAccountNumber: 'ACC' + Date.now() + accountId2,
          amount: 100.0,
          description: '测试转账'
        });

      // 注意：这里需要获取正确的账户号
      const accountsResponse = await request(app)
        .get('/api/account')
        .set('Authorization', `Bearer ${authToken}`);

      const account = accountsResponse.body.accounts[0];
      
      const response2 = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fromAccountId: accountId1,
          toAccountNumber: account.account_number,
          amount: 50.0,
          description: '测试转账'
        });

      expect([200, 201]).toContain(response2.status);
    });

    test('应该拒绝余额不足的转账', async () => {
      const accountsResponse = await request(app)
        .get('/api/account')
        .set('Authorization', `Bearer ${authToken}`);

      const account = accountsResponse.body.accounts[0];
      const balance = account.balance;

      const response = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fromAccountId: accountId1,
          toAccountNumber: account.account_number,
          amount: balance + 1000,
          description: '超额转账'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/transactions/history', () => {
    test('应该返回交易历史', async () => {
      const response = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(Array.isArray(response.body.transactions)).toBe(true);
    });
  });
});

