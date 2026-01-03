import React, { useState, useEffect } from "react";
import api from "../services/api";

function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toAccountNumber: "",
    amount: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get("/account");
      setAccounts(response.data.accounts);
      if (response.data.accounts.length > 0) {
        setFormData((prev) => ({
          ...prev,
          fromAccountId: response.data.accounts[0].id,
        }));
      }
    } catch (error) {
      console.error("获取账户失败:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/transactions/transfer", {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setSuccess(`转账成功！新余额: ¥${response.data.newBalance.toFixed(2)}`);
      setFormData({
        fromAccountId: formData.fromAccountId,
        toAccountNumber: "",
        amount: "",
        description: "",
      });
      fetchAccounts();
    } catch (error) {
      setError(error.response?.data?.error || "转账失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">转账</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>从账户</label>
            <select
              value={formData.fromAccountId}
              onChange={(e) =>
                setFormData({ ...formData, fromAccountId: e.target.value })
              }
              required
            >
              <option value="">选择账户</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_number} (余额: ¥{account.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>目标账户号</label>
            <input
              type="text"
              value={formData.toAccountNumber}
              onChange={(e) =>
                setFormData({ ...formData, toAccountNumber: e.target.value })
              }
              required
              placeholder="输入目标账户号"
            />
          </div>
          <div className="form-group">
            <label>转账金额</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>备注（可选）</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
            />
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "转账中..." : "确认转账"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Transfer;
