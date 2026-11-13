/**
 * MMS - Storage & Persistence Engine
 * Supports GitHub Pages hosting via LocalStorage + JSON Export / Import
 */

const STORAGE_KEY = 'mms_finance_vault_v2';

// Seed Record directly derived from user's Excel file (Month 9/2026)
const SEED_MONTHLY_RECORD = {
  id: 'month_2026_09',
  company: 'MB - IT Risk - CV lv1',
  year: 2026,
  month: 9,
  type: 'Thử việc',
  salary: 13351500,
  tax: 0,
  bonus: 2000000,
  netSalary: 15351500, // 13,351,500 - 0 + 2,000,000
  study: 3000000,
  parents: 3500000,
  saving: 2000000,
  investment: 0,
  essentialsList: [
    { name: 'ChatGPT', amount: 340000 },
    { name: 'cut toc', amount: 100000 },
    { name: 'old spice', amount: 50000 },
    { name: 'mạng', amount: 90000 },
    { name: 'BCS', amount: 300000 }
  ],
  essentialTotal: 880000,
  freeMoney: 5971500, // 15,351,500 - (3tr + 3.5tr + 2tr + 0 + 880k)
  expectedBalance: 5000000,
  actualBalance: 5000000,
  updatedAt: new Date().toISOString()
};

// Danh mục đầu tư khởi đầu để trống hoàn toàn theo yêu cầu người dùng
const SEED_BASKETS = [];

// Sổ thu chi linh hoạt khởi đầu để trống để người dùng tự do nhập
const SEED_CASHFLOWS = [];

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      const initialData = {
        months: [SEED_MONTHLY_RECORD],
        baskets: SEED_BASKETS,
        cashflows: SEED_CASHFLOWS,
        lastBackup: new Date().toISOString()
      };
      this.save(initialData);
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { months: [], baskets: [], cashflows: [] };
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return { months: [], baskets: [], cashflows: [] };
    }
  }

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  }

  // Monthly Records Methods
  getMonths() {
    const data = this.getAll();
    // Sort descending by Year and Month
    return (data.months || []).sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });
  }

  getMonthById(id) {
    const months = this.getMonths();
    return months.find(m => m.id === id);
  }

  saveMonth(record) {
    const data = this.getAll();
    if (!data.months) data.months = [];

    const index = data.months.findIndex(m => m.id === record.id);
    if (index >= 0) {
      data.months[index] = { ...record, updatedAt: new Date().toISOString() };
    } else {
      if (!record.id) {
        record.id = `month_${record.year}_${String(record.month).padStart(2, '0')}_${Date.now()}`;
      }
      record.updatedAt = new Date().toISOString();
      data.months.push(record);
    }

    this.save(data);
    return record;
  }

  deleteMonth(id) {
    const data = this.getAll();
    data.months = (data.months || []).filter(m => m.id !== id);
    this.save(data);
  }

  // Investment Baskets Methods
  getBaskets() {
    const data = this.getAll();
    return data.baskets || [];
  }

  saveBasket(basket) {
    const data = this.getAll();
    if (!data.baskets) data.baskets = [];

    const index = data.baskets.findIndex(b => b.id === basket.id);
    if (index >= 0) {
      data.baskets[index] = basket;
    } else {
      if (!basket.id) {
        basket.id = `basket_${Date.now()}`;
      }
      data.baskets.push(basket);
    }
    this.save(data);
    return basket;
  }

  deleteBasket(id) {
    const data = this.getAll();
    data.baskets = (data.baskets || []).filter(b => b.id !== id);
    this.save(data);
  }

  // Cashflow Transactions Methods
  getCashflows() {
    const data = this.getAll();
    return (data.cashflows || []).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  saveCashflow(tx) {
    const data = this.getAll();
    if (!data.cashflows) data.cashflows = [];

    if (!tx.id) {
      tx.id = `tx_${Date.now()}`;
    }
    const index = data.cashflows.findIndex(t => t.id === tx.id);
    if (index >= 0) {
      data.cashflows[index] = tx;
    } else {
      data.cashflows.unshift(tx);
    }
    this.save(data);
    return tx;
  }

  deleteCashflow(id) {
    const data = this.getAll();
    data.cashflows = (data.cashflows || []).filter(t => t.id !== id);
    this.save(data);
  }

  // Export / Import / Backup
  exportJSON() {
    const data = this.getAll();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mms_finance_backup_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        if (!parsed.months) parsed.months = [];
        if (!parsed.baskets) parsed.baskets = [];
        if (!parsed.cashflows) parsed.cashflows = [];
        this.save(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Lỗi khi đọc JSON import:", e);
      return false;
    }
  }

  resetSeedData() {
    const initialData = {
      months: [JSON.parse(JSON.stringify(SEED_MONTHLY_RECORD))],
      baskets: JSON.parse(JSON.stringify(SEED_BASKETS)),
      cashflows: JSON.parse(JSON.stringify(SEED_CASHFLOWS)),
      lastBackup: new Date().toISOString()
    };
    this.save(initialData);
  }
}

// Global instance
window.storage = new StorageService();
