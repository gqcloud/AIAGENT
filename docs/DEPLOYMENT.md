# 部署文档

## Zeabur 部署指南

### 前置要求

1. Zeabur 账号
2. GitHub 仓库已创建
3. OpenAI API Key

### 部署步骤

#### 1. 连接 GitHub 仓库

1. 登录 Zeabur 控制台
2. 点击 "New Project"
3. 选择 "Import from GitHub"
4. 选择你的仓库

#### 2. 配置后端服务

1. 在项目中选择添加新服务
2. 选择 "Node.js" 模板
3. 设置根目录为 `backend`
4. 配置环境变量：
   ```
   PORT=3001
   JWT_SECRET=your-production-secret-key
   OPENAI_API_KEY=your-openai-api-key
   DATABASE_PATH=./bank.db
   NODE_ENV=production
   ```

#### 3. 配置前端服务

1. 添加新服务
2. 选择 "Static Site" 或 "React" 模板
3. 设置根目录为 `frontend`
4. 配置环境变量：
   ```
   REACT_APP_API_URL=https://your-backend-service.zeabur.app
   ```
5. 构建命令：`npm run build`
6. 输出目录：`build`

#### 4. 配置路由

在 Zeabur 中配置路由规则：
- `/api/*` → 后端服务
- `/*` → 前端服务

#### 5. 部署

1. 点击 "Deploy" 按钮
2. 等待构建完成
3. 获取部署URL

### 环境变量配置

#### 后端环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| PORT | 服务端口 | 否（默认3001）|
| JWT_SECRET | JWT密钥 | 是 |
| OPENAI_API_KEY | OpenAI API密钥 | 是 |
| DATABASE_PATH | 数据库路径 | 否（默认./bank.db）|
| NODE_ENV | 环境模式 | 否 |

#### 前端环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| REACT_APP_API_URL | 后端API地址 | 是 |

### 数据库迁移

当前使用 SQLite 数据库，生产环境建议：

1. **使用 PostgreSQL**（推荐）
   - 在 Zeabur 添加 PostgreSQL 服务
   - 修改数据库连接配置
   - 运行迁移脚本

2. **使用 SQLite**（仅用于MVP）
   - 确保数据库文件持久化存储
   - 配置数据卷挂载

### 监控和日志

1. **查看日志**
   - 在 Zeabur 控制台的服务详情页查看实时日志

2. **性能监控**
   - 使用 Zeabur 内置的监控面板
   - 配置告警规则

3. **错误追踪**
   - 集成 Sentry 或其他错误追踪服务
   - 配置错误通知

### 持续部署

配置 GitHub Actions 自动部署：

1. 在 Zeabur 中启用自动部署
2. 设置触发分支（如 main）
3. 每次 push 到主分支自动部署

### 备份策略

1. **数据库备份**
   - 定期导出 SQLite 数据库
   - 或使用 PostgreSQL 的自动备份功能

2. **代码备份**
   - 使用 GitHub 作为代码仓库
   - 定期创建 release 标签

### 安全建议

1. **环境变量安全**
   - 不要在代码中硬编码密钥
   - 使用 Zeabur 的环境变量管理

2. **HTTPS**
   - Zeabur 自动提供 HTTPS
   - 确保所有API调用使用 HTTPS

3. **CORS 配置**
   - 在生产环境限制 CORS 来源
   - 只允许前端域名访问

### 故障排查

1. **服务无法启动**
   - 检查环境变量配置
   - 查看构建日志
   - 验证依赖安装

2. **API 调用失败**
   - 检查 CORS 配置
   - 验证 API URL 配置
   - 查看后端日志

3. **数据库错误**
   - 检查数据库文件权限
   - 验证数据库路径配置
   - 查看数据库连接日志

### 性能优化

1. **前端优化**
   - 启用代码分割
   - 压缩静态资源
   - 使用 CDN

2. **后端优化**
   - 启用响应压缩
   - 配置缓存策略
   - 优化数据库查询

3. **数据库优化**
   - 添加适当的索引
   - 定期清理旧数据
   - 使用连接池

