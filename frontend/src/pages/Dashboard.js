import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, accountsRes] = await Promise.all([
        api.get("/account/balance"),
        api.get("/account"),
      ]);
      setBalance(balanceRes.data.balance);
      setAccounts(accountsRes.data.accounts);
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">欢迎使用银行智能体</h1>

      <div className="dashboard-grid">
        <div className="card balance-card">
          <h2>总余额</h2>
          <div className="balance-amount">¥{balance.toFixed(2)}</div>
        </div>

        <div className="card">
          <h3>快速操作</h3>
          <div className="quick-actions">
            <Link to="/transfer" className="action-btn">
              <span className="action-icon">💸</span>
              <span>转账</span>
            </Link>
            <Link to="/bills" className="action-btn">
              <span className="action-icon">📄</span>
              <span>账单支付</span>
            </Link>
            <Link to="/history" className="action-btn">
              <span className="action-icon">📊</span>
              <span>交易历史</span>
            </Link>
            <Link to="/ai-chat" className="action-btn">
              <span className="action-icon">🤖</span>
              <span>AI助手</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>我的账户</h3>
          {accounts.length === 0 ? (
            <p>暂无账户</p>
          ) : (
            <div className="accounts-list">
              {accounts.map((account) => (
                <div key={account.id} className="account-item">
                  <div>
                    <strong>{account.account_number}</strong>
                    <span className="account-type">{account.account_type}</span>
                  </div>
                  <div className="account-balance">
                    ¥{account.balance.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
