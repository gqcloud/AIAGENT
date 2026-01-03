# OpenSpec 工作流程指南

## 概述

OpenSpec 是一个规范驱动的开发工作流，帮助团队通过三个阶段管理项目变更：

1. **创建变更提案** (Stage 1)
2. **实现变更** (Stage 2)
3. **归档变更** (Stage 3)

## 三个阶段详解

### Stage 1: 创建变更提案

**何时创建提案？**

- ✅ 添加新功能
- ✅ 修改现有功能（改变行为）
- ✅ 架构变更
- ✅ 性能优化（改变行为）
- ✅ 安全模式更新
- ✅ 破坏性变更（API、数据库结构）

**何时跳过提案？**

- ❌ Bug 修复（恢复预期行为）
- ❌ 拼写错误、格式、注释
- ❌ 依赖更新（非破坏性）
- ❌ 配置更改
- ❌ 现有行为的测试

**创建提案步骤：**

1. **探索当前状态**

   ```bash
   openspec list              # 查看活跃的变更
   openspec list --specs      # 查看现有能力
   openspec show [spec-id]    # 查看特定规范详情
   ```

2. **选择唯一的变更 ID**

   - 格式: kebab-case, 动词开头
   - 示例: `add-two-factor-auth`, `update-payment-flow`, `remove-old-api`

3. **创建提案结构**

   ```
   openspec/changes/[change-id]/
   ├── proposal.md      # 为什么、做什么、影响
   ├── tasks.md         # 实现检查清单
   ├── design.md        # 技术决策（可选）
   └── specs/           # 规范变更
       └── [capability]/
           └── spec.md  # ADDED/MODIFIED/REMOVED 需求
   ```

4. **编写规范变更**

   - 使用 `## ADDED Requirements` 添加新功能
   - 使用 `## MODIFIED Requirements` 修改现有功能
   - 使用 `## REMOVED Requirements` 移除功能
   - 每个需求必须至少有一个 `#### Scenario:`

5. **验证提案**
   ```bash
   openspec validate [change-id] --strict
   ```

### Stage 2: 实现变更

**实现步骤：**

1. **阅读提案文档**

   - `proposal.md` - 理解要构建什么
   - `design.md` (如果存在) - 查看技术决策
   - `tasks.md` - 获取实现检查清单

2. **按顺序实现任务**

   - 按照 `tasks.md` 中的顺序完成
   - 每完成一个任务，更新检查清单

3. **确认完成**

   - 确保 `tasks.md` 中所有项目都标记为完成 `- [x]`
   - 运行测试确保通过
   - 代码审查

4. **重要**: 在提案被审查和批准之前，不要开始实现

### Stage 3: 归档变更

**归档步骤：**

1. **部署后归档**

   ```bash
   openspec archive [change-id] --yes
   ```

2. **手动归档**（如果需要）

   - 移动 `changes/[name]/` → `changes/archive/YYYY-MM-DD-[name]/`
   - 更新 `specs/` 如果能力已更改

3. **验证归档**
   ```bash
   openspec validate --strict
   ```

## 示例：创建变更提案

假设我们要添加"账户余额通知"功能：

### 1. 创建目录结构

```bash
mkdir -p openspec/changes/add-balance-notifications/specs/notifications
```

### 2. 创建 proposal.md

```markdown
# Change: Add Balance Notifications

## Why

Users need to be notified when their account balance falls below a threshold to prevent overdraft.

## What Changes

- Add balance threshold configuration per account
- Add email notification when balance drops below threshold
- Add notification preferences in user settings

## Impact

- Affected specs: notifications, account-management
- Affected code: backend/src/routes/account.js, frontend/src/pages/Account.js
```

### 3. 创建 tasks.md

```markdown
## 1. Backend Implementation

- [ ] 1.1 Add balance_threshold column to accounts table
- [ ] 1.2 Create notification service
- [ ] 1.3 Add API endpoint to update threshold
- [ ] 1.4 Add balance check logic

## 2. Frontend Implementation

- [ ] 2.1 Add threshold input in Account page
- [ ] 2.2 Add notification preferences UI
- [ ] 2.3 Connect to API endpoints

## 3. Testing

- [ ] 3.1 Write unit tests for notification service
- [ ] 3.2 Write integration tests for API
- [ ] 3.3 Test frontend components
```

### 4. 创建规范变更

`openspec/changes/add-balance-notifications/specs/notifications/spec.md`:

```markdown
## ADDED Requirements

### Requirement: Balance Threshold Notification

Users SHALL be able to set a balance threshold for their accounts. When the account balance falls below this threshold, the system SHALL send an email notification.

#### Scenario: Set balance threshold

- **WHEN** user sets a balance threshold of 1000 for their account
- **THEN** the threshold is saved
- **AND** when balance drops below 1000, an email notification is sent

#### Scenario: Balance below threshold

- **WHEN** account balance is 500 and threshold is 1000
- **THEN** a notification email is sent to the user
```

### 5. 验证提案

```bash
openspec validate add-balance-notifications --strict
```

## 与 AI 助手协作

### 创建提案时

```
"我想添加账户余额通知功能。请创建一个 OpenSpec 变更提案。"
```

### 实现变更时

```
"请帮我实现 add-balance-notifications 变更提案。"
```

### 查看状态时

```
"显示当前的变更提案列表"
"显示 add-balance-notifications 提案的详情"
```

## 最佳实践

1. **简单优先**: 默认 <100 行新代码，单文件实现
2. **明确引用**: 使用 `file.ts:42` 格式引用代码位置
3. **能力命名**: 使用动词-名词，单一目的
4. **变更 ID**: 简短描述性，动词开头
5. **场景格式**: 必须使用 `#### Scenario:` 格式（4 个#）

## 常见问题

**Q: 什么时候需要 design.md？**
A: 当涉及跨模块变更、新外部依赖、安全/性能复杂性、或需要技术决策时。

**Q: ADDED vs MODIFIED 的区别？**
A: ADDED 用于新能力，MODIFIED 用于改变现有能力的行为。修改时必须包含完整的需求内容。

**Q: 如何知道变更是否冲突？**
A: 运行 `openspec list` 查看活跃变更，检查是否有重叠的规范。

## 快速参考

```bash
# 查看活跃变更
openspec list

# 查看所有规范
openspec list --specs

# 查看变更详情
openspec show [change-id]

# 验证提案
openspec validate [change-id] --strict

# 归档变更
openspec archive [change-id] --yes
```
