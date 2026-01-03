# 快速开始指南

## 5分钟快速启动

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd bank-ai-agent
```

### 2. 安装依赖

```bash
# 安装所有依赖（后端+前端）
npm run install:all

# 或分别安装
cd backend && npm install
cd ../frontend && npm install
```

### 3. 配置环境变量

#### 后端配置 (`backend/.env`)

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_PATH=./bank.db
NODE_ENV=development
```

#### 前端配置 (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:3001
```

### 4. 启动服务

#### 方式一：分别启动（推荐开发）

```bash
# 终端1：启动后端
cd backend
npm run dev

# 终端2：启动前端
cd frontend
npm start
```

#### 方式二：使用脚本

```bash
# 后端
npm run dev:backend

# 前端（新终端）
npm run dev:frontend
```

### 5. 访问应用

- 前端: http://localhost:3000
- 后端API: http://localhost:3001
- 健康检查: http://localhost:3001/health

## 首次使用

### 1. 注册账号

访问 http://localhost:3000/register

- 用户名: 至少3个字符
- 邮箱: 有效邮箱地址
- 密码: 至少6个字符

### 2. 登录

使用注册的账号登录

### 3. 功能体验

- **首页**: 查看账户余额和快速操作
- **账户**: 查看账户详情
- **转账**: 向其他账户转账
- **账单**: 创建和支付账单
- **交易历史**: 查看所有交易记录
- **AI助手**: 与AI对话查询账户信息

## 测试账号

注册后，系统会自动为新用户创建：
- 一个默认账户
- 初始余额: ¥10,000.00

## 常见问题

### Q: 后端启动失败？

**A:** 检查：
1. Node.js版本 >= 18.0.0
2. 环境变量配置是否正确
3. 端口3001是否被占用

### Q: 前端无法连接后端？

**A:** 检查：
1. 后端是否正常运行
2. `REACT_APP_API_URL` 配置是否正确
3. 浏览器控制台错误信息

### Q: OpenAI API错误？

**A:** 检查：
1. `OPENAI_API_KEY` 是否正确
2. API密钥是否有足够余额
3. 网络连接是否正常

### Q: 数据库错误？

**A:** 检查：
1. 数据库文件权限
2. `DATABASE_PATH` 配置
3. 删除 `bank.db` 重新初始化

## 下一步

- 阅读 [API文档](./API.md) 了解API接口
- 查看 [架构文档](./ARCHITECTURE.md) 了解系统设计
- 参考 [部署文档](./DEPLOYMENT.md) 进行生产部署
- 查看 [测试文档](./TESTING.md) 运行测试

## 开发建议

1. **代码规范**: 遵循ESLint规则
2. **提交前**: 运行测试确保通过
3. **功能开发**: 先写测试，再写实现
4. **API设计**: 遵循RESTful规范

## 获取帮助

- 查看项目 [README](../README.md)
- 提交 [Issue](https://github.com/your-repo/issues)
- 查看 [文档目录](./)

