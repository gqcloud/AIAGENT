const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");
const accountRoutes = require("./src/routes/account");
const transactionRoutes = require("./src/routes/transaction");
const aiRoutes = require("./src/routes/ai");
const { initDatabase } = require("./src/models/database");

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 初始化数据库
initDatabase();

// 路由
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "内部服务器错误",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: "接口不存在" });
});

// app.listen(PORT, () => {
//   console.log(`服务器运行在端口 ${PORT}`);
// });

module.exports = app;
