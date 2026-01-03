const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { getDatabase } = require('../models/database');

const router = express.Router();

// 转账
router.post('/transfer', authenticateToken, [
  body('fromAccountId').isInt().withMessage('源账户ID无效'),
  body('toAccountNumber').notEmpty().withMessage('目标账户号不能为空'),
  body('amount').isFloat({ min: 0.01 }).withMessage('转账金额必须大于0'),
  body('description').optional().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fromAccountId, toAccountNumber, amount, description } = req.body;
  const userId = req.user.userId;
  const db = getDatabase();

  // 开始事务
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // 验证源账户
    db.get('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [fromAccountId, userId], (err, fromAccount) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: '数据库错误' });
      }
      if (!fromAccount) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: '源账户不存在' });
      }
      if (fromAccount.balance < amount) {
        db.run('ROLLBACK');
        return res.status(400).json({ error: '余额不足' });
      }

      // 查找目标账户
      db.get('SELECT * FROM accounts WHERE account_number = ?', [toAccountNumber], (err, toAccount) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: '数据库错误' });
        }
        if (!toAccount) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: '目标账户不存在' });
        }

        // 更新余额
        db.run('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, fromAccountId], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: '转账失败' });
          }

          db.run('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toAccount.id], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: '转账失败' });
            }

            // 记录交易
            db.run(
              'INSERT INTO transactions (from_account_id, to_account_id, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?)',
              [fromAccountId, toAccount.id, amount, 'transfer', description || '转账'],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: '记录交易失败' });
                }

                db.run('COMMIT');
                res.json({
                  message: '转账成功',
                  transactionId: this.lastID,
                  newBalance: fromAccount.balance - amount
                });
              }
            );
          });
        });
      });
    });
  });
});

// 账单支付
router.post('/pay-bill', authenticateToken, [
  body('accountId').isInt().withMessage('账户ID无效'),
  body('billId').isInt().withMessage('账单ID无效')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountId, billId } = req.body;
  const userId = req.user.userId;
  const db = getDatabase();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // 验证账户和账单
    db.get('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [accountId, userId], (err, account) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: '数据库错误' });
      }
      if (!account) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: '账户不存在' });
      }

      db.get('SELECT * FROM bills WHERE id = ? AND user_id = ?', [billId, userId], (err, bill) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: '数据库错误' });
        }
        if (!bill) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: '账单不存在' });
        }
        if (bill.status === 'paid') {
          db.run('ROLLBACK');
          return res.status(400).json({ error: '账单已支付' });
        }
        if (account.balance < bill.amount) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: '余额不足' });
        }

        // 扣款
        db.run('UPDATE accounts SET balance = balance - ? WHERE id = ?', [bill.amount, accountId], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: '支付失败' });
          }

          // 更新账单状态
          db.run('UPDATE bills SET status = ? WHERE id = ?', ['paid', billId], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: '更新账单失败' });
            }

            // 记录交易
            db.run(
              'INSERT INTO transactions (from_account_id, amount, transaction_type, description) VALUES (?, ?, ?, ?)',
              [accountId, bill.amount, 'bill_payment', `支付账单: ${bill.description || bill.bill_type}`],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: '记录交易失败' });
                }

                db.run('COMMIT');
                res.json({
                  message: '支付成功',
                  transactionId: this.lastID,
                  newBalance: account.balance - bill.amount
                });
              }
            );
          });
        });
      });
    });
  });
});

// 获取交易历史
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { limit = 50, offset = 0 } = req.query;
  const db = getDatabase();

  db.all(`
    SELECT t.*, 
           a1.account_number as from_account_number,
           a2.account_number as to_account_number
    FROM transactions t
    LEFT JOIN accounts a1 ON t.from_account_id = a1.id
    LEFT JOIN accounts a2 ON t.to_account_id = a2.id
    WHERE a1.user_id = ? OR a2.user_id = ?
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `, [userId, userId, parseInt(limit), parseInt(offset)], (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: '查询交易历史失败' });
    }
    res.json({ transactions });
  });
});

// 获取账单列表
router.get('/bills', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const db = getDatabase();

  db.all('SELECT * FROM bills WHERE user_id = ? ORDER BY due_date ASC', [userId], (err, bills) => {
    if (err) {
      return res.status(500).json({ error: '查询账单失败' });
    }
    res.json({ bills });
  });
});

// 创建测试账单
router.post('/bills', authenticateToken, [
  body('billType').notEmpty().withMessage('账单类型不能为空'),
  body('amount').isFloat({ min: 0.01 }).withMessage('金额必须大于0'),
  body('dueDate').isISO8601().withMessage('到期日期格式无效')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { billType, amount, dueDate, description } = req.body;
  const userId = req.user.userId;
  const db = getDatabase();

  db.run(
    'INSERT INTO bills (user_id, bill_type, amount, due_date, description) VALUES (?, ?, ?, ?, ?)',
    [userId, billType, amount, dueDate, description || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '创建账单失败' });
      }
      res.status(201).json({
        message: '账单创建成功',
        billId: this.lastID
      });
    }
  );
});

module.exports = router;

