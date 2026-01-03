# 测试文档

## 测试策略

本项目采用分层测试策略，包括单元测试和集成测试。

## 后端测试

### 运行测试

```bash
cd backend
npm test
```

### 测试覆盖率

```bash
npm test -- --coverage
```

### 测试文件结构

```
backend/tests/
├── auth.test.js          # 认证相关测试
├── account.test.js       # 账户相关测试
└── transaction.test.js   # 交易相关测试
```

### 测试用例

#### 认证测试

- ✅ 用户注册成功
- ✅ 用户注册验证（用户名、邮箱、密码格式）
- ✅ 拒绝重复用户名/邮箱
- ✅ 用户登录成功
- ✅ 拒绝错误密码

#### 账户测试

- ✅ 获取账户列表（需要认证）
- ✅ 获取账户余额
- ✅ 未认证请求被拒绝

#### 交易测试

- ✅ 转账成功
- ✅ 拒绝余额不足的转账
- ✅ 获取交易历史

## 前端测试

### 运行测试

```bash
cd frontend
npm test
```

### 测试框架

- Jest
- React Testing Library

### 测试覆盖

- 组件渲染测试
- 用户交互测试（未来扩展）

## 集成测试

### API集成测试

使用Supertest进行API端点测试：

```javascript
const request = require('supertest');
const app = require('../server');

test('GET /api/account', async () => {
  const response = await request(app)
    .get('/api/account')
    .set('Authorization', `Bearer ${token}`);
  
  expect(response.status).toBe(200);
});
```

## 测试数据

测试使用内存数据库（`:memory:`），确保测试隔离性。

## CI/CD测试

GitHub Actions自动运行测试：

1. 后端测试
2. 前端测试
3. 代码质量检查

## 手动测试清单

### 功能测试

- [ ] 用户注册
- [ ] 用户登录
- [ ] 查看账户信息
- [ ] 转账功能
- [ ] 账单创建
- [ ] 账单支付
- [ ] 查看交易历史
- [ ] AI对话功能

### 安全测试

- [ ] 未认证访问被拒绝
- [ ] Token过期处理
- [ ] 输入验证
- [ ] SQL注入防护

### 性能测试

- [ ] API响应时间
- [ ] 并发请求处理
- [ ] 数据库查询性能

## 测试最佳实践

1. **隔离性**: 每个测试独立运行
2. **可重复性**: 测试结果一致
3. **快速执行**: 测试运行速度快
4. **清晰命名**: 测试名称描述明确
5. **覆盖率**: 关键业务逻辑100%覆盖

## 未来改进

- [ ] E2E测试（使用Cypress或Playwright）
- [ ] 性能测试
- [ ] 负载测试
- [ ] 安全测试自动化

