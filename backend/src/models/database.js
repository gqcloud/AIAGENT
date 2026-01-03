const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const DB_PATH =
  process.env.DATABASE_PATH || path.join(__dirname, "../../bank.db");

let db = null;

function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("数据库连接错误:", err.message);
      } else {
        console.log("数据库连接成功");
      }
    });
  }
  return db;
}

function initDatabase() {
  const db = getDatabase();

  // 用户表
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 账户表
    db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_number TEXT UNIQUE NOT NULL,
        balance REAL DEFAULT 0.0,
        account_type TEXT DEFAULT 'checking',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 交易表
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_account_id INTEGER,
        to_account_id INTEGER,
        amount REAL NOT NULL,
        transaction_type TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_account_id) REFERENCES accounts(id),
        FOREIGN KEY (to_account_id) REFERENCES accounts(id)
      )
    `);

    // 账单表
    db.run(`
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        bill_type TEXT NOT NULL,
        amount REAL NOT NULL,
        due_date DATE NOT NULL,
        status TEXT DEFAULT 'pending',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_user_id ON accounts(user_id)`);
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_from_account ON transactions(from_account_id)`
    );
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_to_account ON transactions(to_account_id)`
    );
    db.run(`CREATE INDEX IF NOT EXISTS idx_user_bills ON bills(user_id)`);

    console.log("数据库表初始化完成");
  });
}

function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error("关闭数据库连接错误:", err.message);
      } else {
        console.log("数据库连接已关闭");
      }
    });
  }
}

module.exports = {
  getDatabase,
  initDatabase,
  closeDatabase,
};
