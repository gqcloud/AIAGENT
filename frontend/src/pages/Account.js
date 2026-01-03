import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Account.css';

function Account() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/account');
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error('获取账户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">我的账户</h1>
      <div className="card">
        {accounts.length === 0 ? (
          <p>暂无账户</p>
        ) : (
          <div className="accounts-table">
            <table>
              <thead>
                <tr>
                  <th>账户号</th>
                  <th>账户类型</th>
                  <th>余额</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(account => (
                  <tr key={account.id}>
                    <td>{account.account_number}</td>
                    <td>{account.account_type}</td>
                    <td>¥{account.balance.toFixed(2)}</td>
                    <td>{new Date(account.created_at).toLocaleString('zh-CN')}</td>
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

export default Account;
