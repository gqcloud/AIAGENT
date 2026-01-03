# 架构文档

## 系统架构

### 整体架构

```
┌─────────────┐
│  前端 (React) │
│  Port: 3000  │
└──────┬───────┘
       │ HTTP/REST
       │
┌──────▼───────┐
│ 后端 (Node.js)│
│  Port: 3001  │
└──────┬───────┘
       │
       ├──► SQLite 数据库
       │
       └──► OpenAI API
```

## 技术栈

### 前端

- **框架**: React 18
- **路由**: React Router v6
- **HTTP 客户端**: Axios
- **状态管理**: React Context API
- **样式**: CSS3 (自定义样式)

### 后端

- **运行时**: Node.js 18+
- **框架**: Express.js
- **数据库**: SQLite3
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **AI 服务**: OpenAI API (GPT-3.5-turbo)
- **安全**: Helmet, CORS
- **日志**: Morgan

## 目录结构

```
bank-ai-agent/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── routes/         # API路由
│   │   ├── controllers/    # 控制器（可选）
│   │   ├── models/         # 数据模型
│   │   ├── middleware/     # 中间件
│   │   ├── services/       # 业务逻辑（可选）
│   │   └── utils/          # 工具函数（可选）
│   ├── tests/              # 测试文件
│   └── server.js           # 入口文件
│
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── pages/          # 页面组件
│   │   ├── contexts/       # Context API
│   │   ├── services/       # API服务
│   │   └── utils/          # 工具函数
│   └── public/             # 静态资源
│
├── docs/                   # 文档
├── .github/                # GitHub配置
│   └── workflows/          # CI/CD配置
└── README.md               # 项目说明
```

## 数据模型

### 用户表 (users)

| 字段       | 类型     | 说明           |
| ---------- | -------- | -------------- |
| id         | INTEGER  | 主键           |
| username   | TEXT     | 用户名（唯一） |
| email      | TEXT     | 邮箱（唯一）   |
| password   | TEXT     | 加密后的密码   |
| created_at | DATETIME | 创建时间       |

### 账户表 (accounts)

| 字段           | 类型     | 说明            |
| -------------- | -------- | --------------- |
| id             | INTEGER  | 主键            |
| user_id        | INTEGER  | 用户 ID（外键） |
| account_number | TEXT     | 账户号（唯一）  |
| balance        | REAL     | 余额            |
| account_type   | TEXT     | 账户类型        |
| created_at     | DATETIME | 创建时间        |

### 交易表 (transactions)

| 字段             | 类型     | 说明                |
| ---------------- | -------- | ------------------- |
| id               | INTEGER  | 主键                |
| from_account_id  | INTEGER  | 源账户 ID（外键）   |
| to_account_id    | INTEGER  | 目标账户 ID（外键） |
| amount           | REAL     | 金额                |
| transaction_type | TEXT     | 交易类型            |
| description      | TEXT     | 描述                |
| status           | TEXT     | 状态                |
| created_at       | DATETIME | 创建时间            |

### 账单表 (bills)

| 字段        | 类型     | 说明            |
| ----------- | -------- | --------------- |
| id          | INTEGER  | 主键            |
| user_id     | INTEGER  | 用户 ID（外键） |
| bill_type   | TEXT     | 账单类型        |
| amount      | REAL     | 金额            |
| due_date    | DATE     | 到期日期        |
| status      | TEXT     | 状态            |
| description | TEXT     | 描述            |
| created_at  | DATETIME | 创建时间        |

## API 设计

### RESTful 规范

- `GET`: 查询资源
- `POST`: 创建资源
- `PUT`: 更新资源（未实现）
- `DELETE`: 删除资源（未实现）

### 路由结构

```
/api
├── /auth          # 认证相关
│   ├── POST /register
│   └── POST /login
│
├── /account       # 账户相关
│   ├── GET /
│   ├── GET /balance
│   └── GET /:accountId
│
├── /transactions # 交易相关
│   ├── POST /transfer
│   ├── POST /pay-bill
│   ├── GET /history
│   ├── GET /bills
│   └── POST /bills
│
└── /ai           # AI相关
    └── POST /chat
```

## 安全机制

### 认证流程

1. 用户注册/登录
2. 服务器生成 JWT Token
3. 客户端存储 Token
4. 后续请求携带 Token
5. 服务器验证 Token

### 安全措施

- **密码加密**: 使用 bcryptjs 进行哈希加密
- **JWT 认证**: 使用 JWT 进行无状态认证
- **CORS**: 配置跨域资源共享
- **Helmet**: 设置安全 HTTP 头
- **输入验证**: 使用 express-validator 验证输入

## AI 集成

### OpenAI API 集成

- **模型**: GPT-3.5-turbo
- **上下文**: 包含用户账户信息和交易历史
- **功能**: 自然语言查询账户信息、交易记录等

### 对话流程

1. 用户发送消息
2. 后端获取用户账户上下文
3. 构建系统提示词
4. 调用 OpenAI API
5. 返回 AI 响应

## 数据库设计

### 关系图

```
users
  ├── accounts (1:N)
  └── bills (1:N)

accounts
  ├── transactions (from_account_id) (1:N)
  └── transactions (to_account_id) (1:N)
```

### 索引

- `accounts.user_id`: 加速用户账户查询
- `transactions.from_account_id`: 加速交易查询
- `transactions.to_account_id`: 加速交易查询
- `bills.user_id`: 加速账单查询

## 部署架构

### 开发环境

- 前端: `npm start` (开发服务器)
- 后端: `npm run dev` (nodemon)
- 数据库: SQLite (本地文件)

### 生产环境

- 前端: 静态文件服务 (Zeabur Static)
- 后端: Node.js 服务 (Zeabur Node)
- 数据库: SQLite (持久化存储) 或 PostgreSQL

## 性能考虑

### 前端优化

- React 组件懒加载
- API 请求去重
- 响应式设计

### 后端优化

- 数据库索引
- 连接池（如使用 PostgreSQL）
- 响应压缩
- 缓存策略（未来）

## 扩展性

### 未来改进

1. **数据库迁移**: SQLite → PostgreSQL
2. **缓存层**: Redis 集成
3. **消息队列**: 异步任务处理
4. **微服务**: 拆分服务
5. **监控**: 集成 APM 工具
6. **日志**: 集中式日志管理

## 测试策略

### 单元测试

- 后端: Jest + Supertest
- 前端: Jest + React Testing Library

### 集成测试

- API 端点测试
- 数据库操作测试
- 认证流程测试

### E2E 测试

- 用户流程测试（未来）
