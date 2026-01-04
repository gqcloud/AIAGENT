const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { getDatabase } = require('../models/database');
const OpenAI = require('openai');

const router = express.Router();

const openai = new OpenAI({
  apiKey: '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'
});

// AI 对话接口
router.post('/chat', authenticateToken, [
  body('message').notEmpty().withMessage('消息不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const userId = req.user.userId;
    const db = getDatabase();

    // 获取用户账户信息用于上下文
    db.all('SELECT * FROM accounts WHERE user_id = ?', [userId], async (err, accounts) => {
      if (err) {
        return res.status(500).json({ error: '获取账户信息失败' });
      }

      // 获取最近的交易记录
      db.all(`
        SELECT t.*, 
               a1.account_number as from_account_number,
               a2.account_number as to_account_number
        FROM transactions t
        LEFT JOIN accounts a1 ON t.from_account_id = a1.id
        LEFT JOIN accounts a2 ON t.to_account_id = a2.id
        WHERE a1.user_id = ? OR a2.user_id = ?
        ORDER BY t.created_at DESC
        LIMIT 5
      `, [userId, userId], async (err, recentTransactions) => {
        if (err) {
          return res.status(500).json({ error: '获取交易记录失败' });
        }

        // 构建上下文信息
        const accountInfo = accounts.map(acc => ({
          accountNumber: acc.account_number,
          balance: acc.balance,
          type: acc.account_type
        })).join('\n');

        const systemPrompt = `你是一个银行智能助手，可以帮助用户查询账户信息、进行转账、支付账单等操作。

用户账户信息：
${accountInfo}

最近交易记录：
${recentTransactions.length > 0 ? recentTransactions.map(t => 
  `${t.transaction_type}: ${t.amount}元 ${t.description || ''}`
).join('\n') : '暂无交易记录'}

请用友好、专业的方式回答用户的问题。如果用户询问账户余额、交易历史等，请基于上述信息回答。
如果用户想要进行转账或支付账单，请告知他们需要使用相应的API接口。`;

        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
          });

          const aiResponse = completion.choices[0].message.content;

          res.json({
            response: aiResponse,
            timestamp: new Date().toISOString()
          });
        } catch (openaiError) {
          console.error('OpenAI API 错误:', openaiError);
          res.status(500).json({ 
            error: 'AI服务暂时不可用',
            fallback: '抱歉，AI助手暂时无法响应。请直接使用账户查询、转账等功能。'
          });
        }
      });
    });
  } catch (error) {
    console.error('AI对话错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

