import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './History.css';

function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/transactions/history');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('获取交易历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">交易历史</h1>
      <div className="card">
        {transactions.length === 0 ? (
          <p>暂无交易记录</p>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>交易类型</th>
                  <th>金额</th>
                  <th>描述</th>
                  <th>状态</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.transaction_type === 'transfer' ? '转账' : '账单支付'}</td>
                    <td className={transaction.transaction_type === 'transfer' ? 'negative' : 'positive'}>
                      {transaction.transaction_type === 'transfer' ? '-' : ''}¥{transaction.amount.toFixed(2)}
                    </td>
                    <td>{transaction.description || '-'}</td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status === 'completed' ? '已完成' : transaction.status}
                      </span>
                    </td>
                    <td>{new Date(transaction.created_at).toLocaleString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
