// 全局变量
let medicines = [];
let suppliers = [];
let currentTaxRate = 6;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initForms();
  initDateDefaults();
  loadSettings();
  loadDashboard();
  loadMedicines();
  loadSuppliers();
  initReportYear();
});

// 初始化导航
function initNavigation() {
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.dataset.page;
      showPage(page);
    });
  });
}

// 显示页面
function showPage(pageName) {
  // 更新导航样式
  document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
  document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

  // 显示对应页面
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageName).classList.add('active');

  // 加载页面数据
  switch(pageName) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'medicines':
      loadMedicines();
      break;
    case 'sales':
      loadSales();
      break;
    case 'purchases':
      loadPurchases();
      break;
    case 'suppliers':
      loadSuppliers();
      break;
    case 'reports':
      loadTaxReport();
      break;
    case 'settings':
      loadSettings();
      break;
  }
}

// 初始化日期默认值
function initDateDefaults() {
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  document.getElementById('sale-date').value = today;
  document.getElementById('purchase-date').value = today;
  document.getElementById('sales-start-date').value = firstDayOfMonth;
  document.getElementById('sales-end-date').value = today;
  document.getElementById('purchases-start-date').value = firstDayOfMonth;
  document.getElementById('purchases-end-date').value = today;
}

// 初始化报表年份选择
function initReportYear() {
  const select = document.getElementById('report-year');
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 5; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year + '年';
    select.appendChild(option);
  }
}

// 初始化表单
function initForms() {
  // 药品表单
  document.getElementById('medicine-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveMedicine();
  });

  // 销售表单
  document.getElementById('sale-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSale();
  });

  // 进货表单
  document.getElementById('purchase-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await savePurchase();
  });

  // 供应商表单
  document.getElementById('supplier-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSupplier();
  });
}

// ============ 仪表板 ============

async function loadDashboard() {
  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();

    document.getElementById('today-sales').textContent = `RM ${data.today.total.toFixed(2)}`;
    document.getElementById('today-tax').textContent = `RM ${data.today.tax.toFixed(2)}`;
    document.getElementById('month-sales').textContent = `RM ${data.month.total.toFixed(2)}`;
    document.getElementById('month-tax').textContent = `RM ${data.month.tax.toFixed(2)}`;
    document.getElementById('year-sales').textContent = `RM ${data.year.total.toFixed(2)}`;
    document.getElementById('year-tax').textContent = `RM ${data.year.tax.toFixed(2)}`;
    document.getElementById('low-stock-count').textContent = data.lowStockCount;

    // 加载低库存列表
    const lowStockResponse = await fetch('/api/medicines/low-stock');
    const lowStockMedicines = await lowStockResponse.json();
    const tbody = document.querySelector('#low-stock-table tbody');
    tbody.innerHTML = lowStockMedicines.map(m => `
      <tr class="low-stock">
        <td>${m.name}</td>
        <td>${m.stock_quantity}</td>
        <td>${m.low_stock_threshold}</td>
        <td>${m.unit}</td>
      </tr>
    `).join('') || '<tr><td colspan="4">暂无低库存药品</td></tr>';

  } catch (error) {
    console.error('加载仪表板失败:', error);
  }
}

// ============ 系统设置 ============

async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    const settings = await response.json();
    document.getElementById('tax-rate').value = settings.tax_rate;
    document.getElementById('low-stock-warning').value = settings.low_stock_warning;
    currentTaxRate = settings.tax_rate;
  } catch (error) {
    console.error('加载设置失败:', error);
  }
}

async function saveSettings() {
  try {
    const tax_rate = parseFloat(document.getElementById('tax-rate').value);
    const low_stock_warning = parseInt(document.getElementById('low-stock-warning').value);

    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tax_rate, low_stock_warning })
    });

    currentTaxRate = tax_rate;
    alert('设置已保存！');
  } catch (error) {
    console.error('保存设置失败:', error);
    alert('保存失败，请重试');
  }
}

// ============ 药品管理 ============

async function loadMedicines() {
  try {
    const response = await fetch('/api/medicines');
    medicines = await response.json();
    renderMedicinesTable(medicines);
    updateMedicineSelects();
  } catch (error) {
    console.error('加载药品失败:', error);
  }
}

function renderMedicinesTable(medicineList) {
  const tbody = document.querySelector('#medicines-table tbody');
  tbody.innerHTML = medicineList.map(m => `
    <tr class="${m.stock_quantity <= m.low_stock_threshold ? 'low-stock' : ''}">
      <td>${m.name}</td>
      <td>${m.unit}</td>
      <td>${m.selling_price.toFixed(2)}</td>
      <td>${m.stock_quantity}</td>
      <td>${m.low_stock_threshold}</td>
      <td>
        <button class="btn btn-small" onclick="editMedicine(${m.id})">编辑</button>
        <button class="btn btn-small btn-danger" onclick="deleteMedicine(${m.id})">删除</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6">暂无药品数据</td></tr>';
}

function searchMedicines() {
  const keyword = document.getElementById('medicine-search').value.toLowerCase();
  const filtered = medicines.filter(m => m.name.toLowerCase().includes(keyword));
  renderMedicinesTable(filtered);
}

function updateMedicineSelects() {
  const options = '<option value="">请选择药品</option>' +
    medicines.map(m => `<option value="${m.id}" data-price="${m.selling_price}">${m.name} (库存: ${m.stock_quantity} ${m.unit})</option>`).join('');

  document.getElementById('sale-medicine').innerHTML = options;
  document.getElementById('purchase-medicine').innerHTML = options;
}

async function saveMedicine() {
  const id = document.getElementById('medicine-id').value;
  const data = {
    name: document.getElementById('medicine-name').value,
    unit: document.getElementById('medicine-unit').value,
    selling_price: parseFloat(document.getElementById('medicine-price').value),
    stock_quantity: parseFloat(document.getElementById('medicine-stock').value),
    low_stock_threshold: parseFloat(document.getElementById('medicine-threshold').value)
  };

  try {
    if (id) {
      await fetch(`/api/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    hideModal('medicine-modal');
    loadMedicines();
    alert('药品保存成功！');
  } catch (error) {
    console.error('保存药品失败:', error);
    alert('保存失败，请重试');
  }
}

function editMedicine(id) {
  const medicine = medicines.find(m => m.id === id);
  if (medicine) {
    document.getElementById('medicine-id').value = medicine.id;
    document.getElementById('medicine-name').value = medicine.name;
    document.getElementById('medicine-unit').value = medicine.unit;
    document.getElementById('medicine-price').value = medicine.selling_price;
    document.getElementById('medicine-stock').value = medicine.stock_quantity;
    document.getElementById('medicine-threshold').value = medicine.low_stock_threshold;
    showModal('medicine-modal');
  }
}

async function deleteMedicine(id) {
  if (confirm('确定要删除这个药品吗？')) {
    try {
      await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
      loadMedicines();
    } catch (error) {
      console.error('删除药品失败:', error);
      alert('删除失败，请重试');
    }
  }
}

// ============ 供应商管理 ============

async function loadSuppliers() {
  try {
    const response = await fetch('/api/suppliers');
    suppliers = await response.json();
    renderSuppliersTable();
    updateSupplierSelect();
  } catch (error) {
    console.error('加载供应商失败:', error);
  }
}

function renderSuppliersTable() {
  const tbody = document.querySelector('#suppliers-table tbody');
  tbody.innerHTML = suppliers.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.contact || '-'}</td>
      <td>${s.phone || '-'}</td>
      <td>${s.address || '-'}</td>
      <td>
        <button class="btn btn-small" onclick="editSupplier(${s.id})">编辑</button>
        <button class="btn btn-small btn-danger" onclick="deleteSupplier(${s.id})">删除</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="5">暂无供应商数据</td></tr>';
}

function updateSupplierSelect() {
  const options = '<option value="">请选择供应商</option>' +
    suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.getElementById('purchase-supplier').innerHTML = options;
}

async function saveSupplier() {
  const id = document.getElementById('supplier-id').value;
  const data = {
    name: document.getElementById('supplier-name').value,
    contact: document.getElementById('supplier-contact').value,
    phone: document.getElementById('supplier-phone').value,
    address: document.getElementById('supplier-address').value
  };

  try {
    if (id) {
      await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    hideModal('supplier-modal');
    loadSuppliers();
    alert('供应商保存成功！');
  } catch (error) {
    console.error('保存供应商失败:', error);
    alert('保存失败，请重试');
  }
}

function editSupplier(id) {
  const supplier = suppliers.find(s => s.id === id);
  if (supplier) {
    document.getElementById('supplier-id').value = supplier.id;
    document.getElementById('supplier-name').value = supplier.name;
    document.getElementById('supplier-contact').value = supplier.contact || '';
    document.getElementById('supplier-phone').value = supplier.phone || '';
    document.getElementById('supplier-address').value = supplier.address || '';
    showModal('supplier-modal');
  }
}

async function deleteSupplier(id) {
  if (confirm('确定要删除这个供应商吗？')) {
    try {
      await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      loadSuppliers();
    } catch (error) {
      console.error('删除供应商失败:', error);
      alert('删除失败，请重试');
    }
  }
}

// ============ 销售管理 ============

async function loadSales() {
  try {
    const startDate = document.getElementById('sales-start-date').value;
    const endDate = document.getElementById('sales-end-date').value;
    let url = '/api/sales';
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await fetch(url);
    const sales = await response.json();
    renderSalesTable(sales);
  } catch (error) {
    console.error('加载销售记录失败:', error);
  }
}

function renderSalesTable(sales) {
  const tbody = document.querySelector('#sales-table tbody');
  tbody.innerHTML = sales.map(s => `
    <tr>
      <td>${s.sale_date}</td>
      <td>${s.medicine_name}</td>
      <td>${s.quantity} ${s.unit}</td>
      <td>RM ${s.unit_price.toFixed(2)}</td>
      <td>RM ${s.subtotal.toFixed(2)}</td>
      <td>RM ${s.tax_amount.toFixed(2)}</td>
      <td>RM ${s.total_amount.toFixed(2)}</td>
      <td>
        <button class="btn btn-small btn-danger" onclick="deleteSale(${s.id})">删除</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8">暂无销售记录</td></tr>';
}

function updateSalePrice() {
  const select = document.getElementById('sale-medicine');
  const option = select.options[select.selectedIndex];
  if (option && option.dataset.price) {
    document.getElementById('sale-price').value = option.dataset.price;
    calculateSaleTotal();
  }
}

function calculateSaleTotal() {
  const quantity = parseFloat(document.getElementById('sale-quantity').value) || 0;
  const price = parseFloat(document.getElementById('sale-price').value) || 0;
  const subtotal = quantity * price;
  const tax = subtotal * (currentTaxRate / 100);
  const total = subtotal + tax;

  document.getElementById('sale-subtotal').textContent = `RM ${subtotal.toFixed(2)}`;
  document.getElementById('sale-tax').textContent = `RM ${tax.toFixed(2)}`;
  document.getElementById('sale-total').textContent = `RM ${total.toFixed(2)}`;
}

async function saveSale() {
  const data = {
    medicine_id: parseInt(document.getElementById('sale-medicine').value),
    quantity: parseFloat(document.getElementById('sale-quantity').value),
    unit_price: parseFloat(document.getElementById('sale-price').value),
    sale_date: document.getElementById('sale-date').value,
    notes: document.getElementById('sale-notes').value
  };

  try {
    await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    hideModal('sale-modal');
    loadSales();
    loadMedicines();
    loadDashboard();
    alert('销售记录已保存！');

    // 重置表单
    document.getElementById('sale-form').reset();
    document.getElementById('sale-date').value = new Date().toISOString().split('T')[0];
  } catch (error) {
    console.error('保存销售记录失败:', error);
    alert('保存失败，请重试');
  }
}

async function deleteSale(id) {
  if (confirm('确定要删除这条销售记录吗？库存将会恢复。')) {
    try {
      await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      loadSales();
      loadMedicines();
      loadDashboard();
    } catch (error) {
      console.error('删除销售记录失败:', error);
      alert('删除失败，请重试');
    }
  }
}

// ============ 进货管理 ============

async function loadPurchases() {
  try {
    const startDate = document.getElementById('purchases-start-date').value;
    const endDate = document.getElementById('purchases-end-date').value;
    let url = '/api/purchases';
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await fetch(url);
    const purchases = await response.json();
    renderPurchasesTable(purchases);
  } catch (error) {
    console.error('加载进货记录失败:', error);
  }
}

function renderPurchasesTable(purchases) {
  const tbody = document.querySelector('#purchases-table tbody');
  tbody.innerHTML = purchases.map(p => `
    <tr>
      <td>${p.purchase_date}</td>
      <td>${p.supplier_name || '-'}</td>
      <td>${p.medicine_name}</td>
      <td>${p.quantity} ${p.unit}</td>
      <td>RM ${p.unit_price.toFixed(2)}</td>
      <td>RM ${p.total_price.toFixed(2)}</td>
      <td>
        <button class="btn btn-small btn-danger" onclick="deletePurchase(${p.id})">删除</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7">暂无进货记录</td></tr>';
}

async function savePurchase() {
  const data = {
    supplier_id: parseInt(document.getElementById('purchase-supplier').value),
    medicine_id: parseInt(document.getElementById('purchase-medicine').value),
    quantity: parseFloat(document.getElementById('purchase-quantity').value),
    unit_price: parseFloat(document.getElementById('purchase-price').value),
    purchase_date: document.getElementById('purchase-date').value,
    notes: document.getElementById('purchase-notes').value
  };

  try {
    await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    hideModal('purchase-modal');
    loadPurchases();
    loadMedicines();
    loadDashboard();
    alert('进货记录已保存！');

    // 重置表单
    document.getElementById('purchase-form').reset();
    document.getElementById('purchase-date').value = new Date().toISOString().split('T')[0];
  } catch (error) {
    console.error('保存进货记录失败:', error);
    alert('保存失败，请重试');
  }
}

async function deletePurchase(id) {
  if (confirm('确定要删除这条进货记录吗？库存将会减少。')) {
    try {
      await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
      loadPurchases();
      loadMedicines();
      loadDashboard();
    } catch (error) {
      console.error('删除进货记录失败:', error);
      alert('删除失败，请重试');
    }
  }
}

// ============ 税务报表 ============

async function loadTaxReport() {
  try {
    const year = document.getElementById('report-year').value;
    const month = document.getElementById('report-month').value;

    const response = await fetch(`/api/reports/tax?year=${year}&month=${month}`);
    const data = await response.json();

    // 更新汇总
    document.getElementById('report-subtotal').textContent = `RM ${data.totals.subtotal.toFixed(2)}`;
    document.getElementById('report-tax').textContent = `RM ${data.totals.tax_amount.toFixed(2)}`;
    document.getElementById('report-total').textContent = `RM ${data.totals.total_amount.toFixed(2)}`;

    // 渲染表格
    const tbody = document.querySelector('#report-table tbody');
    tbody.innerHTML = data.report.map(r => `
      <tr>
        <td>${r.sale_date || r.month}</td>
        <td>RM ${r.subtotal.toFixed(2)}</td>
        <td>RM ${r.tax_amount.toFixed(2)}</td>
        <td>RM ${r.total_amount.toFixed(2)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4">暂无数据</td></tr>';

  } catch (error) {
    console.error('加载税务报表失败:', error);
  }
}

function exportReport(type) {
  const year = document.getElementById('report-year').value;
  const month = document.getElementById('report-month').value;
  window.location.href = `/api/reports/export?year=${year}&month=${month}&type=${type}`;
}

// ============ 弹窗控制 ============

function showModal(modalId) {
  // 如果是新增，清空表单
  if (modalId === 'medicine-modal') {
    document.getElementById('medicine-id').value = '';
    document.getElementById('medicine-form').reset();
    document.getElementById('medicine-unit').value = '克';
    document.getElementById('medicine-stock').value = '0';
    document.getElementById('medicine-threshold').value = '100';
  } else if (modalId === 'supplier-modal') {
    document.getElementById('supplier-id').value = '';
    document.getElementById('supplier-form').reset();
  } else if (modalId === 'sale-modal') {
    document.getElementById('sale-form').reset();
    document.getElementById('sale-date').value = new Date().toISOString().split('T')[0];
    calculateSaleTotal();
  } else if (modalId === 'purchase-modal') {
    document.getElementById('purchase-form').reset();
    document.getElementById('purchase-date').value = new Date().toISOString().split('T')[0];
  }

  document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// 点击弹窗外部关闭
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});
