const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../models/database');

const router = express.Router();

// 用户注册
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('用户名至少3个字符'),
  body('email').isEmail().withMessage('无效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const db = getDatabase();

    // 检查用户是否已存在
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: '数据库错误' });
      }
      if (user) {
        return res.status(400).json({ error: '用户名或邮箱已存在' });
      }

      // 创建用户
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, hashedPassword], function(err) {
        if (err) {
          return res.status(500).json({ error: '注册失败' });
        }

        // 为新用户创建默认账户
        const accountNumber = `ACC${Date.now()}${this.lastID}`;
        db.run('INSERT INTO accounts (user_id, account_number, balance, account_type) VALUES (?, ?, ?, ?)',
          [this.lastID, accountNumber, 10000.0, 'checking'], (err) => {
          if (err) {
            console.error('创建账户失败:', err);
          }
        });

        res.status(201).json({ 
          message: '注册成功',
          userId: this.lastID 
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 用户登录
router.post('/login', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const db = getDatabase();

    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: '数据库错误' });
      }
      if (!user) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

