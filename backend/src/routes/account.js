const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getDatabase } = require('../models/database');

const router = express.Router();

// 获取用户账户信息
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = req.user.userId;

  db.all('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, accounts) => {
    if (err) {
      return res.status(500).json({ error: '查询账户失败' });
    }
    res.json({ accounts });
  });
});

// 获取账户余额
router.get('/balance', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = req.user.userId;

  db.get('SELECT SUM(balance) as totalBalance FROM accounts WHERE user_id = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '查询余额失败' });
    }
    res.json({ balance: result.totalBalance || 0 });
  });
});

// 获取特定账户详情
router.get('/:accountId', authenticateToken, (req, res) => {
  const db = getDatabase();
  const { accountId } = req.params;
  const userId = req.user.userId;

  db.get('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [accountId, userId], (err, account) => {
    if (err) {
      return res.status(500).json({ error: '查询账户失败' });
    }
    if (!account) {
      return res.status(404).json({ error: '账户不存在' });
    }
    res.json({ account });
  });
});

module.exports = router;

