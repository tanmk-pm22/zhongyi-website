const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(express.static('public'));

// 初始化数据库
const db = new Database('pharmacy.db');

// 创建数据表
db.exec(`
  -- 系统设置表
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    tax_rate REAL DEFAULT 6.0,
    low_stock_warning INTEGER DEFAULT 10
  );

  -- 药品表
  CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unit TEXT DEFAULT '克',
    selling_price REAL NOT NULL,
    stock_quantity REAL DEFAULT 0,
    low_stock_threshold REAL DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 供应商表
  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 进货记录表
  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    medicine_id INTEGER,
    quantity REAL NOT NULL,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL,
    purchase_date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
  );

  -- 销售记录表
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicine_id INTEGER,
    quantity REAL NOT NULL,
    unit_price REAL NOT NULL,
    subtotal REAL NOT NULL,
    tax_amount REAL NOT NULL,
    total_amount REAL NOT NULL,
    sale_date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
  );

  -- 插入默认设置
  INSERT OR IGNORE INTO settings (id, tax_rate, low_stock_warning) VALUES (1, 6.0, 10);
`);

// ============ API 路由 ============

// 获取系统设置
app.get('/api/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  res.json(settings);
});

// 更新系统设置
app.put('/api/settings', (req, res) => {
  const { tax_rate, low_stock_warning } = req.body;
  db.prepare('UPDATE settings SET tax_rate = ?, low_stock_warning = ? WHERE id = 1')
    .run(tax_rate, low_stock_warning);
  res.json({ success: true });
});

// ============ 药品管理 ============

// 获取所有药品
app.get('/api/medicines', (req, res) => {
  const medicines = db.prepare('SELECT * FROM medicines ORDER BY name').all();
  res.json(medicines);
});

// 获取低库存药品
app.get('/api/medicines/low-stock', (req, res) => {
  const medicines = db.prepare(
    'SELECT * FROM medicines WHERE stock_quantity <= low_stock_threshold ORDER BY stock_quantity'
  ).all();
  res.json(medicines);
});

// 添加药品
app.post('/api/medicines', (req, res) => {
  const { name, unit, selling_price, stock_quantity, low_stock_threshold } = req.body;
  const result = db.prepare(
    'INSERT INTO medicines (name, unit, selling_price, stock_quantity, low_stock_threshold) VALUES (?, ?, ?, ?, ?)'
  ).run(name, unit || '克', selling_price, stock_quantity || 0, low_stock_threshold || 100);
  res.json({ id: result.lastInsertRowid, success: true });
});

// 更新药品
app.put('/api/medicines/:id', (req, res) => {
  const { name, unit, selling_price, stock_quantity, low_stock_threshold } = req.body;
  db.prepare(
    'UPDATE medicines SET name = ?, unit = ?, selling_price = ?, stock_quantity = ?, low_stock_threshold = ? WHERE id = ?'
  ).run(name, unit, selling_price, stock_quantity, low_stock_threshold, req.params.id);
  res.json({ success: true });
});

// 删除药品
app.delete('/api/medicines/:id', (req, res) => {
  db.prepare('DELETE FROM medicines WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ 供应商管理 ============

// 获取所有供应商
app.get('/api/suppliers', (req, res) => {
  const suppliers = db.prepare('SELECT * FROM suppliers ORDER BY name').all();
  res.json(suppliers);
});

// 添加供应商
app.post('/api/suppliers', (req, res) => {
  const { name, contact, phone, address } = req.body;
  const result = db.prepare(
    'INSERT INTO suppliers (name, contact, phone, address) VALUES (?, ?, ?, ?)'
  ).run(name, contact || '', phone || '', address || '');
  res.json({ id: result.lastInsertRowid, success: true });
});

// 更新供应商
app.put('/api/suppliers/:id', (req, res) => {
  const { name, contact, phone, address } = req.body;
  db.prepare(
    'UPDATE suppliers SET name = ?, contact = ?, phone = ?, address = ? WHERE id = ?'
  ).run(name, contact, phone, address, req.params.id);
  res.json({ success: true });
});

// 删除供应商
app.delete('/api/suppliers/:id', (req, res) => {
  db.prepare('DELETE FROM suppliers WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ 进货管理 ============

// 获取进货记录
app.get('/api/purchases', (req, res) => {
  const { start_date, end_date } = req.query;
  let query = `
    SELECT p.*, m.name as medicine_name, m.unit, s.name as supplier_name
    FROM purchases p
    LEFT JOIN medicines m ON p.medicine_id = m.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
  `;

  if (start_date && end_date) {
    query += ` WHERE p.purchase_date BETWEEN ? AND ? ORDER BY p.purchase_date DESC`;
    const purchases = db.prepare(query).all(start_date, end_date);
    res.json(purchases);
  } else {
    query += ` ORDER BY p.purchase_date DESC LIMIT 100`;
    const purchases = db.prepare(query).all();
    res.json(purchases);
  }
});

// 添加进货记录
app.post('/api/purchases', (req, res) => {
  const { supplier_id, medicine_id, quantity, unit_price, purchase_date, notes } = req.body;
  const total_price = quantity * unit_price;

  // 添加进货记录
  const result = db.prepare(
    'INSERT INTO purchases (supplier_id, medicine_id, quantity, unit_price, total_price, purchase_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(supplier_id, medicine_id, quantity, unit_price, total_price, purchase_date, notes || '');

  // 更新库存
  db.prepare('UPDATE medicines SET stock_quantity = stock_quantity + ? WHERE id = ?')
    .run(quantity, medicine_id);

  res.json({ id: result.lastInsertRowid, success: true });
});

// 删除进货记录
app.delete('/api/purchases/:id', (req, res) => {
  const purchase = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
  if (purchase) {
    // 减少库存
    db.prepare('UPDATE medicines SET stock_quantity = stock_quantity - ? WHERE id = ?')
      .run(purchase.quantity, purchase.medicine_id);
    db.prepare('DELETE FROM purchases WHERE id = ?').run(req.params.id);
  }
  res.json({ success: true });
});

// ============ 销售管理 ============

// 获取销售记录
app.get('/api/sales', (req, res) => {
  const { start_date, end_date } = req.query;
  let query = `
    SELECT s.*, m.name as medicine_name, m.unit
    FROM sales s
    LEFT JOIN medicines m ON s.medicine_id = m.id
  `;

  if (start_date && end_date) {
    query += ` WHERE s.sale_date BETWEEN ? AND ? ORDER BY s.sale_date DESC`;
    const sales = db.prepare(query).all(start_date, end_date);
    res.json(sales);
  } else {
    query += ` ORDER BY s.sale_date DESC LIMIT 100`;
    const sales = db.prepare(query).all();
    res.json(sales);
  }
});

// 添加销售记录
app.post('/api/sales', (req, res) => {
  const { medicine_id, quantity, unit_price, sale_date, notes } = req.body;

  // 获取税率
  const settings = db.prepare('SELECT tax_rate FROM settings WHERE id = 1').get();
  const tax_rate = settings.tax_rate / 100;

  const subtotal = quantity * unit_price;
  const tax_amount = subtotal * tax_rate;
  const total_amount = subtotal + tax_amount;

  // 添加销售记录
  const result = db.prepare(
    'INSERT INTO sales (medicine_id, quantity, unit_price, subtotal, tax_amount, total_amount, sale_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(medicine_id, quantity, unit_price, subtotal, tax_amount, total_amount, sale_date, notes || '');

  // 减少库存
  db.prepare('UPDATE medicines SET stock_quantity = stock_quantity - ? WHERE id = ?')
    .run(quantity, medicine_id);

  res.json({ id: result.lastInsertRowid, success: true });
});

// 删除销售记录
app.delete('/api/sales/:id', (req, res) => {
  const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(req.params.id);
  if (sale) {
    // 恢复库存
    db.prepare('UPDATE medicines SET stock_quantity = stock_quantity + ? WHERE id = ?')
      .run(sale.quantity, sale.medicine_id);
    db.prepare('DELETE FROM sales WHERE id = ?').run(req.params.id);
  }
  res.json({ success: true });
});

// ============ 报表统计 ============

// 获取仪表板数据
app.get('/api/dashboard', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // 今日销售
  const todaySales = db.prepare(
    'SELECT COALESCE(SUM(total_amount), 0) as total, COALESCE(SUM(tax_amount), 0) as tax FROM sales WHERE sale_date = ?'
  ).get(today);

  // 本月销售
  const monthSales = db.prepare(
    `SELECT COALESCE(SUM(total_amount), 0) as total, COALESCE(SUM(tax_amount), 0) as tax
     FROM sales WHERE strftime('%Y', sale_date) = ? AND strftime('%m', sale_date) = ?`
  ).get(currentYear.toString(), currentMonth.toString().padStart(2, '0'));

  // 本年销售
  const yearSales = db.prepare(
    `SELECT COALESCE(SUM(total_amount), 0) as total, COALESCE(SUM(tax_amount), 0) as tax
     FROM sales WHERE strftime('%Y', sale_date) = ?`
  ).get(currentYear.toString());

  // 低库存药品数量
  const lowStockCount = db.prepare(
    'SELECT COUNT(*) as count FROM medicines WHERE stock_quantity <= low_stock_threshold'
  ).get();

  // 药品总数
  const medicineCount = db.prepare('SELECT COUNT(*) as count FROM medicines').get();

  res.json({
    today: todaySales,
    month: monthSales,
    year: yearSales,
    lowStockCount: lowStockCount.count,
    medicineCount: medicineCount.count
  });
});

// 获取税务报表
app.get('/api/reports/tax', (req, res) => {
  const { year, month } = req.query;

  let query, params;
  if (month && month !== 'all') {
    query = `
      SELECT
        sale_date,
        SUM(subtotal) as subtotal,
        SUM(tax_amount) as tax_amount,
        SUM(total_amount) as total_amount
      FROM sales
      WHERE strftime('%Y', sale_date) = ? AND strftime('%m', sale_date) = ?
      GROUP BY sale_date
      ORDER BY sale_date
    `;
    params = [year, month.padStart(2, '0')];
  } else {
    query = `
      SELECT
        strftime('%Y-%m', sale_date) as month,
        SUM(subtotal) as subtotal,
        SUM(tax_amount) as tax_amount,
        SUM(total_amount) as total_amount
      FROM sales
      WHERE strftime('%Y', sale_date) = ?
      GROUP BY strftime('%Y-%m', sale_date)
      ORDER BY month
    `;
    params = [year];
  }

  const report = db.prepare(query).all(...params);

  // 计算总计
  const totalQuery = month && month !== 'all'
    ? `SELECT COALESCE(SUM(subtotal), 0) as subtotal, COALESCE(SUM(tax_amount), 0) as tax_amount, COALESCE(SUM(total_amount), 0) as total_amount FROM sales WHERE strftime('%Y', sale_date) = ? AND strftime('%m', sale_date) = ?`
    : `SELECT COALESCE(SUM(subtotal), 0) as subtotal, COALESCE(SUM(tax_amount), 0) as tax_amount, COALESCE(SUM(total_amount), 0) as total_amount FROM sales WHERE strftime('%Y', sale_date) = ?`;

  const totals = db.prepare(totalQuery).get(...params);

  res.json({ report, totals });
});

// 导出Excel报表
app.get('/api/reports/export', (req, res) => {
  const { year, month, type } = req.query;

  let data = [];
  let filename = '';

  if (type === 'sales') {
    // 销售报表
    let query = `
      SELECT s.sale_date as '日期', m.name as '药品名称', s.quantity as '数量',
             m.unit as '单位', s.unit_price as '单价', s.subtotal as '小计',
             s.tax_amount as '税金', s.total_amount as '总计'
      FROM sales s
      LEFT JOIN medicines m ON s.medicine_id = m.id
      WHERE strftime('%Y', s.sale_date) = ?
    `;
    let params = [year];

    if (month && month !== 'all') {
      query += ` AND strftime('%m', s.sale_date) = ?`;
      params.push(month.padStart(2, '0'));
      filename = `销售报表_${year}年${month}月.xlsx`;
    } else {
      filename = `销售报表_${year}年.xlsx`;
    }
    query += ` ORDER BY s.sale_date`;

    data = db.prepare(query).all(...params);
  } else if (type === 'tax') {
    // 税务报表
    let query, params;
    if (month && month !== 'all') {
      query = `
        SELECT sale_date as '日期',
               SUM(subtotal) as '销售额(不含税)',
               SUM(tax_amount) as 'SST税金',
               SUM(total_amount) as '总计(含税)'
        FROM sales
        WHERE strftime('%Y', sale_date) = ? AND strftime('%m', sale_date) = ?
        GROUP BY sale_date
        ORDER BY sale_date
      `;
      params = [year, month.padStart(2, '0')];
      filename = `SST税务报表_${year}年${month}月.xlsx`;
    } else {
      query = `
        SELECT strftime('%Y-%m', sale_date) as '月份',
               SUM(subtotal) as '销售额(不含税)',
               SUM(tax_amount) as 'SST税金',
               SUM(total_amount) as '总计(含税)'
        FROM sales
        WHERE strftime('%Y', sale_date) = ?
        GROUP BY strftime('%Y-%m', sale_date)
        ORDER BY strftime('%Y-%m', sale_date)
      `;
      params = [year];
      filename = `SST税务报表_${year}年.xlsx`;
    }
    data = db.prepare(query).all(...params);
  } else if (type === 'inventory') {
    // 库存报表
    data = db.prepare(`
      SELECT name as '药品名称', unit as '单位', stock_quantity as '库存数量',
             selling_price as '售价', low_stock_threshold as '低库存警告线'
      FROM medicines ORDER BY name
    `).all();
    filename = `库存报表_${new Date().toISOString().split('T')[0]}.xlsx`;
  }

  // 创建Excel
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
  res.send(buffer);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`药店管理系统已启动！`);
  console.log(`请在浏览器打开: http://localhost:${PORT}`);
});
