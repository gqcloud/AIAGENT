import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Bills.css';

function Bills() {
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    billType: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [billsRes, accountsRes] = await Promise.all([
        api.get('/transactions/bills'),
        api.get('/account')
      ]);
      setBills(billsRes.data.bills);
      setAccounts(accountsRes.data.accounts);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/transactions/bills', formData);
      setSuccess('账单创建成功');
      setFormData({ billType: '', amount: '', dueDate: '', description: '' });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.error || '创建账单失败');
    }
  };

  const handlePayBill = async (billId, accountId) => {
    if (!window.confirm('确认支付此账单？')) return;

    try {
      await api.post('/transactions/pay-bill', { billId, accountId });
      setSuccess('支付成功');
      fetchData();
    } catch (error) {
      setError(error.response?.data?.error || '支付失败');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">账单管理</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? '取消' : '创建账单'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card">
          <h3>创建新账单</h3>
          <form onSubmit={handleCreateBill}>
            <div className="form-group">
              <label>账单类型</label>
              <input
                type="text"
                value={formData.billType}
                onChange={(e) => setFormData({ ...formData, billType: e.target.value })}
                required
                placeholder="如：电费、水费、信用卡等"
              />
            </div>
            <div className="form-group">
              <label>金额</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>到期日期</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>描述（可选）</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <button type="submit" className="btn btn-primary">创建</button>
          </form>
        </div>
      )}

      <div className="card">
        <h3>我的账单</h3>
        {bills.length === 0 ? (
          <p>暂无账单</p>
        ) : (
          <div className="bills-table">
            <table>
              <thead>
                <tr>
                  <th>账单类型</th>
                  <th>金额</th>
                  <th>到期日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id}>
                    <td>{bill.bill_type}</td>
                    <td>¥{bill.amount.toFixed(2)}</td>
                    <td>{new Date(bill.due_date).toLocaleDateString('zh-CN')}</td>
                    <td>
                      <span className={`status-badge ${bill.status === 'paid' ? 'paid' : 'pending'}`}>
                        {bill.status === 'paid' ? '已支付' : '待支付'}
                      </span>
                    </td>
                    <td>
                      {bill.status === 'pending' && accounts.length > 0 && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handlePayBill(bill.id, accounts[0].id)}
                        >
                          支付
                        </button>
                      )}
                    </td>
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

export default Bills;
