# 银行智能体应用 (Bank AI Agent)

基于 MVP 原则开发的银行场景智能体应用，集成 AI 对话能力，支持账户查询、转账、账单支付等核心银行功能。

## 项目/视频说明

如果手机端注册失败，请优先使用浏览器打开，已适配 pc 和移动，做转账时可注册两个账号互转，转账助手由于需要 api，这里使用的 openai 的 chatgpt，暂时未提供
[aiagentvideos](https://meeting.tencent.com/crm/NgDek6J762)

## 项目架构

```
bank-ai-agent/
├── backend/          # Node.js + Express 后端服务
├── frontend/         # React 前端应用
├── .github/          # CI/CD 配置
└── docs/             # 项目文档
```

## 技术栈

### 后端

- Node.js + Express
- JWT 认证
- SQLite 数据库（MVP 阶段）
- OpenAI API 集成

### 前端

- React 18
- TypeScript
- Tailwind CSS
- Axios

## 核心功能

- ✅ 用户认证和权限管理
- ✅ 账户查询
- ✅ 转账功能
- ✅ 账单支付
- ✅ 交易历史查看
- ✅ AI 智能对话助手

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 本地开发

1. 克隆仓库

```bash
git clone <repository-url>
cd bank-ai-agent
```

2. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. 配置环境变量

创建 `backend/.env` 文件：

```env
PORT=3001
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
DATABASE_PATH=./bank.db
```

创建 `frontend/.env` 文件：

```env
REACT_APP_API_URL=http://localhost:3001
```

4. 启动服务

```bash
# 启动后端（在 backend 目录）
npm run dev

# 启动前端（在 frontend 目录，新终端）
npm start
```

访问 http://localhost:3000 查看应用

## API 文档

详见 [API 文档](./docs/API.md)

## 测试

```bash
# 运行后端测试
cd backend
npm test

# 运行前端测试
cd frontend
npm test
```

## 部署

### Zeabur 部署

1. 连接 GitHub 仓库到 Zeabur
2. 配置环境变量
3. 自动部署

详细部署说明见 [部署文档](./docs/DEPLOYMENT.md)

## 项目结构

```
backend/
├── src/
│   ├── routes/       # API 路由
│   ├── controllers/  # 控制器
│   ├── models/       # 数据模型
│   ├── middleware/   # 中间件
│   ├── services/     # 业务逻辑服务
│   └── utils/        # 工具函数
├── tests/            # 测试文件
└── server.js         # 入口文件

frontend/
├── src/
│   ├── components/   # React 组件
│   ├── pages/        # 页面组件
│   ├── services/     # API 服务
│   ├── hooks/        # 自定义 Hooks
│   └── utils/        # 工具函数
└── public/           # 静态资源
```

## 开发规范

- 使用 ESLint 进行代码检查
- 遵循 RESTful API 设计规范
- 提交前运行测试确保通过

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request
