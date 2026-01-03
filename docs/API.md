# API 文档

## 基础信息

- 基础 URL: `http://localhost:3001/api`
- 认证方式: Bearer Token (JWT)

## 认证接口

### 用户注册

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string (至少3个字符)",
  "email": "string (有效邮箱)",
  "password": "string (至少6个字符)"
}
```

**响应:**

```json
{
  "message": "注册成功",
  "userId": 1
}
```

### 用户登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**响应:**

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

## 账户接口

### 获取账户列表

```http
GET /api/account
Authorization: Bearer {token}
```

**响应:**

```json
{
  "accounts": [
    {
      "id": 1,
      "user_id": 1,
      "account_number": "ACC1234567890",
      "balance": 10000.0,
      "account_type": "checking",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 获取账户余额

```http
GET /api/account/balance
Authorization: Bearer {token}
```

**响应:**

```json
{
  "balance": 10000.0
}
```

### 获取特定账户详情

```http
GET /api/account/:accountId
Authorization: Bearer {token}
```

## 交易接口

### 转账

```http
POST /api/transactions/transfer
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromAccountId": 1,
  "toAccountNumber": "ACC1234567890",
  "amount": 100.0,
  "description": "转账备注（可选）"
}
```

**响应:**

```json
{
  "message": "转账成功",
  "transactionId": 1,
  "newBalance": 9900.0
}
```

### 账单支付

```http
POST /api/transactions/pay-bill
Authorization: Bearer {token}
Content-Type: application/json

{
  "accountId": 1,
  "billId": 1
}
```

**响应:**

```json
{
  "message": "支付成功",
  "transactionId": 1,
  "newBalance": 9800.0
}
```

### 获取交易历史

```http
GET /api/transactions/history?limit=50&offset=0
Authorization: Bearer {token}
```

**响应:**

```json
{
  "transactions": [
    {
      "id": 1,
      "from_account_id": 1,
      "to_account_id": 2,
      "amount": 100.0,
      "transaction_type": "transfer",
      "description": "转账",
      "status": "completed",
      "created_at": "2024-01-01T00:00:00.000Z",
      "from_account_number": "ACC1234567890",
      "to_account_number": "ACC0987654321"
    }
  ]
}
```

### 获取账单列表

```http
GET /api/transactions/bills
Authorization: Bearer {token}
```

**响应:**

```json
{
  "bills": [
    {
      "id": 1,
      "user_id": 1,
      "bill_type": "电费",
      "amount": 200.0,
      "due_date": "2024-01-15",
      "status": "pending",
      "description": "12月电费",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 创建账单

```http
POST /api/transactions/bills
Authorization: Bearer {token}
Content-Type: application/json

{
  "billType": "电费",
  "amount": 200.0,
  "dueDate": "2024-01-15",
  "description": "12月电费（可选）"
}
```

## AI 接口

### AI 对话

```http
POST /api/ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "我的账户余额是多少？"
}
```

**响应:**

```json
{
  "response": "根据您的账户信息，您的总余额是10000.0元...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 错误响应

所有错误响应格式：

```json
{
  "error": "错误消息"
}
```

常见 HTTP 状态码：

- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器错误
