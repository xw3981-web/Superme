// --- server.js (修复版) ---

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// --- 中间件 ---
app.use(cors());
app.use(express.json());

// --- 数据库设置 ---
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('成功连接到 SQLite 数据库。');
    
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        dueDate TEXT
    )`);
});

// --- API 路由 ---

// 1. 添加一个新任务
app.post('/api/tasks', (req, res) => {
    const { content, dueDate } = req.body;

    if (!content) {
        return res.status(400).json({ error: '任务内容不能为空' });
    }

    const sql = `INSERT INTO tasks (content, dueDate) VALUES (?, ?)`;
    db.run(sql, [content, dueDate], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, content, dueDate });
    });
});

// 2. 随机抽取一个任务（并自动删除）🔥 关键修改
app.get('/api/tasks/random', (req, res) => {
    // 先随机选一个任务
    const selectSql = `SELECT * FROM tasks ORDER BY RANDOM() LIMIT 1`;
    
    db.get(selectSql, [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!row) {
            return res.status(404).json({ message: '盲盒还是空的，快添加一些任务吧！' });
        }
        
        // 找到任务后，立即删除它
        const deleteSql = `DELETE FROM tasks WHERE id = ?`;
        db.run(deleteSql, row.id, function(deleteErr) {
            if (deleteErr) {
                console.error('删除任务时出错:', deleteErr);
                // 即使删除失败，也返回任务（避免数据丢失）
                return res.json(row);
            }
            
            console.log(`✨ 抽中并删除了任务 ID: ${row.id}`);
            res.json(row);
        });
    });
});

// 3. 删除一个任务
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes > 0) {
            res.json({ message: '任务已删除', changes: this.changes });
        } else {
            res.status(404).json({ message: '未找到该任务' });
        }
    });
});

// 4. 更新一个任务
app.put('/api/tasks/:id', (req, res) => {
    const { content, dueDate } = req.body;
    
    if (!content) {
        return res.status(400).json({ message: '任务内容不能为空' });
    }

    // 如果提供了 dueDate，就更新；否则保持原值
    let sql, params;
    if (dueDate !== undefined) {
        sql = `UPDATE tasks SET content = ?, dueDate = ? WHERE id = ?`;
        params = [content, dueDate, req.params.id];
    } else {
        sql = `UPDATE tasks SET content = ? WHERE id = ?`;
        params = [content, req.params.id];
    }

    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: '未找到任务' });
        }
        
        // 返回更新后的任务
        db.get(`SELECT * FROM tasks WHERE id = ?`, [req.params.id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(row);
        });
    });
});

// 5. 获取所有任务
app.get('/api/tasks', (req, res) => {
    const sql = `SELECT * FROM tasks`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// --- 启动服务器 ---
app.listen(port, () => {
    console.log(`后端服务已启动，正在监听 http://localhost:${port}`);
    console.log(`API 地址: http://localhost:${port}/api/tasks`);
});