# Project Context

## Purpose

银行智能体应用 (Bank AI Agent) 是一个基于 MVP 原则开发的银行场景智能体应用。项目集成 AI 对话能力，支持账户查询、转账、账单支付等核心银行功能，旨在提供一个现代化的、用户友好的银行服务体验。

## Tech Stack

### 后端

- **运行时**: Node.js 18+
- **框架**: Express.js 4.18+
- **数据库**: SQLite3 (MVP 阶段，未来可迁移到 PostgreSQL)
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **AI 服务**: OpenAI API (GPT-3.5-turbo)
- **安全**: Helmet, CORS
- **日志**: Morgan
- **验证**: express-validator
- **测试**: Jest, Supertest

### 前端

- **框架**: React 18
- **路由**: React Router v6
- **HTTP 客户端**: Axios
- **状态管理**: React Context API
- **样式**: CSS3 (自定义样式，未使用 Tailwind)
- **测试**: Jest, React Testing Library

### 开发工具

- **包管理**: npm
- **代码格式化**: ESLint (React App 配置)
- **CI/CD**: GitHub Actions
- **部署**: Zeabur

## Project Conventions

### Code Style

- **引号**: 使用双引号 (`"`) 而非单引号
- **分号**: 使用分号
- **缩进**: 2 个空格
- **命名**:
  - 变量/函数: camelCase
  - 组件: PascalCase
  - 常量: UPPER_SNAKE_CASE
  - 文件: 与导出内容一致（组件用 PascalCase，工具函数用 camelCase）
- **导入顺序**:
  1. React/外部库
  2. 内部组件
  3. 工具函数/服务
  4. 样式文件

### Architecture Patterns

#### 后端架构

- **路由层**: `backend/src/routes/` - 定义 API 端点
- **中间件层**: `backend/src/middleware/` - 认证、验证等中间件
- **模型层**: `backend/src/models/` - 数据库模型和操作
- **服务层**: 业务逻辑（当前内联在路由中，未来可提取）

#### 前端架构

- **页面组件**: `frontend/src/pages/` - 完整页面组件
- **通用组件**: `frontend/src/components/` - 可复用组件
- **上下文**: `frontend/src/contexts/` - React Context 状态管理
- **服务层**: `frontend/src/services/` - API 调用封装

#### API 设计

- **RESTful 规范**: 使用标准 HTTP 方法 (GET, POST, PUT, DELETE)
- **路径前缀**: 所有 API 路径以 `/api` 开头
- **认证**: 使用 Bearer Token (JWT) 在 Authorization header 中
- **响应格式**: JSON，统一错误格式 `{ error: "message" }`

### Testing Strategy

- **单元测试**: 使用 Jest 测试业务逻辑
- **集成测试**: 使用 Supertest 测试 API 端点
- **测试覆盖**: 关键业务逻辑（认证、转账、账单支付）必须有测试
- **测试文件位置**:
  - 后端: `backend/tests/`
  - 前端: `frontend/src/**/*.test.js`
- **测试命名**: `[feature].test.js`

### Git Workflow

- **分支策略**:
  - `main`: 生产环境代码
  - `develop`: 开发分支（可选）
  - 功能分支: `feature/[feature-name]`
- **提交信息**:
  - 格式: `[type]: [description]`
  - 类型: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`
- **PR 要求**:
  - 通过所有测试
  - 代码审查
  - 更新相关文档

## Domain Context

### 银行核心功能

1. **用户认证**: 注册、登录、JWT token 管理
2. **账户管理**: 账户查询、余额查询、账户详情
3. **转账功能**: 账户间转账，支持备注
4. **账单管理**: 账单创建、账单支付、账单状态查询
5. **交易历史**: 查看所有交易记录，支持分页
6. **AI 助手**: 自然语言查询账户信息、交易记录等

### 业务规则

- 新用户注册时自动创建默认账户，初始余额 ¥10,000.00
- 转账需要验证余额充足
- 账单支付需要验证余额充足
- 所有交易记录都会保存到数据库
- AI 助手可以访问用户的账户信息和最近交易记录作为上下文

### 数据模型

- **用户** (users): 用户名、邮箱、加密密码
- **账户** (accounts): 账户号、余额、账户类型、关联用户
- **交易** (transactions): 转账记录、账单支付记录
- **账单** (bills): 账单类型、金额、到期日期、状态

## Important Constraints

### 技术约束

- **MVP 阶段**: 使用 SQLite 数据库，未来可迁移到 PostgreSQL
- **单机部署**: 当前设计为单机部署，无分布式需求
- **API 限制**: OpenAI API 有调用限制和成本，需要合理使用

### 安全约束

- 密码必须使用 bcrypt 加密存储
- JWT token 有过期时间（24 小时）
- 所有需要认证的 API 必须验证 token
- 用户只能访问自己的账户和交易记录

### 业务约束

- 转账金额必须大于 0.01
- 账户余额不能为负
- 账单状态: pending, paid

## External Dependencies

### API 服务

- **OpenAI API**:
  - 用途: AI 对话功能
  - 模型: GPT-3.5-turbo
  - 配置: 通过环境变量 `OPENAI_API_KEY`
  - 注意: 需要有效的 API key 才能使用 AI 功能

### 部署平台

- **Zeabur**:
  - 用途: 生产环境部署
  - 配置: 通过 `zeabur.json` 配置
  - 环境变量: 需要在平台配置

### 开发工具

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

## File Structure Conventions

### 后端文件组织

```
backend/
├── src/
│   ├── routes/          # API 路由定义
│   ├── middleware/      # 中间件（认证、验证等）
│   ├── models/          # 数据模型和数据库操作
│   └── utils/          # 工具函数（如需要）
├── tests/               # 测试文件
└── server.js            # 应用入口
```

### 前端文件组织

```
frontend/src/
├── pages/               # 页面组件（路由级别）
├── components/          # 可复用组件
├── contexts/            # React Context
├── services/            # API 服务封装
└── utils/               # 工具函数（如需要）
```

## Development Workflow

1. **本地开发**:
   - 后端: `cd backend && npm run dev` (使用 nodemon 自动重启)
   - 前端: `cd frontend && npm start` (开发服务器)
2. **测试**:

   - 后端: `cd backend && npm test`
   - 前端: `cd frontend && npm test`

3. **环境变量**:

   - 后端: `backend/.env` (不提交到 git)
   - 前端: `frontend/.env` (不提交到 git)

4. **代码提交前**:
   - 运行测试确保通过
   - 检查 ESLint 错误
   - 确保代码符合项目规范
