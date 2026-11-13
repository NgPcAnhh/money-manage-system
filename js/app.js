/**
 * MMS - Main Application Controller
 */

class AppController {
  constructor() {
    this.selectedMonthId = null;
    this.activeTab = 'view-dashboard';
    this.cashflowFilter = 'all';

    this.initElements();
    this.bindEvents();
    this.initApp();
  }

  initElements() {
    // Navigation
    this.navTabs = document.querySelectorAll('.nav-tab');
    this.viewSections = document.querySelectorAll('.view-section');

    // Dashboard elements
    this.dashboardMonthSelect = document.getElementById('dashboardMonthSelect');
    this.kpiNetSalary = document.getElementById('kpiNetSalary');
    this.kpiGrossSalary = document.getElementById('kpiGrossSalary');
    this.kpiTotalExpense = document.getElementById('kpiTotalExpense');
    this.kpiExpenseRatio = document.getElementById('kpiExpenseRatio');
    this.kpiSaveInvest = document.getElementById('kpiSaveInvest');
    this.kpiSaveInvestRate = document.getElementById('kpiSaveInvestRate');
    this.kpiFreeMoney = document.getElementById('kpiFreeMoney');
    this.kpiActualBalance = document.getElementById('kpiActualBalance');
    this.pieMonthLabel = document.getElementById('pieMonthLabel');
    this.essentialTotalText = document.getElementById('essentialTotalText');
    this.essentialsPreviewList = document.getElementById('essentialsPreviewList');
    this.btnEditCurrentEssentials = document.getElementById('btnEditCurrentEssentials');

    // Monthly view
    this.monthlyRecordsContainer = document.getElementById('monthlyRecordsContainer');
    this.btnOpenNewMonthModal = document.getElementById('btnOpenNewMonthModal');
    this.modalMonthly = document.getElementById('modalMonthly');
    this.formMonthly = document.getElementById('formMonthly');
    this.btnCloseModalMonthly = document.getElementById('btnCloseModalMonthly');
    this.btnCancelMonthly = document.getElementById('btnCancelMonthly');
    this.btnAddEssentialItemModal = document.getElementById('btnAddEssentialItemModal');
    this.modalEssentialsList = document.getElementById('modalEssentialsList');

    // Monthly Form Fields (for live formulas)
    this.monthRecordId = document.getElementById('monthRecordId');
    this.mCompany = document.getElementById('mCompany');
    this.mType = document.getElementById('mType');
    this.mYear = document.getElementById('mYear');
    this.mMonth = document.getElementById('mMonth');
    this.mSalary = document.getElementById('mSalary');
    this.mTax = document.getElementById('mTax');
    this.mBonus = document.getElementById('mBonus');
    this.mNetSalary = document.getElementById('mNetSalary');
    this.mStudy = document.getElementById('mStudy');
    this.mParents = document.getElementById('mParents');
    this.mSaving = document.getElementById('mSaving');
    this.mInvestment = document.getElementById('mInvestment');
    this.mEssentialTotal = document.getElementById('mEssentialTotal');
    this.mFreeMoney = document.getElementById('mFreeMoney');
    this.mExpectedBalance = document.getElementById('mExpectedBalance');
    this.mActualBalance = document.getElementById('mActualBalance');

    // Cashflow view
    this.btnOpenQuickTxModal = document.getElementById('btnOpenQuickTxModal');
    this.modalCashflow = document.getElementById('modalCashflow');
    this.formCashflow = document.getElementById('formCashflow');
    this.btnCloseModalCashflow = document.getElementById('btnCloseModalCashflow');
    this.btnCancelCashflow = document.getElementById('btnCancelCashflow');
    this.cfTotalIncome = document.getElementById('cfTotalIncome');
    this.cfTotalExpense = document.getElementById('cfTotalExpense');
    this.cfNetBalance = document.getElementById('cfNetBalance');
    this.txListContainer = document.getElementById('txListContainer');
    this.cfFilterPills = document.querySelectorAll('#cfFilterPills .pill');

    // Investment view
    this.btnOpenAddBasketModal = document.getElementById('btnOpenAddBasketModal');
    this.modalBasket = document.getElementById('modalBasket');
    this.formBasket = document.getElementById('formBasket');
    this.btnCloseModalBasket = document.getElementById('btnCloseModalBasket');
    this.btnCancelBasket = document.getElementById('btnCancelBasket');
    this.portfolioTotalValue = document.getElementById('portfolioTotalValue');
    this.portfolioTotalCapital = document.getElementById('portfolioTotalCapital');
    this.portfolioTotalPnL = document.getElementById('portfolioTotalPnL');
    this.portfolioPnLBadge = document.getElementById('portfolioPnLBadge');
    this.basketsContainer = document.getElementById('basketsContainer');
    this.basketsCountBadge = document.getElementById('basketsCountBadge');

    // Settings & Persistence
    this.btnExportJSON = document.getElementById('btnExportJSON');
    this.inputImportJSON = document.getElementById('inputImportJSON');
    this.btnCopyJSON = document.getElementById('btnCopyJSON');
    this.btnResetSeedData = document.getElementById('btnResetSeedData');
    this.btnQuickBackup = document.getElementById('btnQuickBackup');
    this.btnToggleTheme = document.getElementById('btnToggleTheme');
    this.toastNotification = document.getElementById('toastNotification');
    this.toastMessage = document.getElementById('toastMessage');
  }

  bindEvents() {
    // Tab switching
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.getAttribute('data-target');
        this.switchTab(targetView);
      });
    });

    // Theme toggle
    this.btnToggleTheme.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      const isLight = document.body.classList.contains('theme-light');
      localStorage.setItem('mms_theme', isLight ? 'light' : 'dark');
      this.showToast(isLight ? 'Đã chuyển sang giao diện Sáng' : 'Đã chuyển sang giao diện Tối');
    });

    // Quick backup button on top header
    this.btnQuickBackup.addEventListener('click', () => {
      storage.exportJSON();
      this.showToast('Đã tải xuống file sao lưu JSON!');
    });

    // Month Selector on Dashboard
    this.dashboardMonthSelect.addEventListener('change', (e) => {
      this.selectedMonthId = e.target.value;
      this.renderDashboard();
    });

    // Edit Essentials from Dashboard
    if (this.btnEditCurrentEssentials) {
      this.btnEditCurrentEssentials.addEventListener('click', () => {
        if (this.selectedMonthId) {
          this.openEditMonthModal(this.selectedMonthId);
        }
      });
    }

    // Modal Monthly Events
    this.btnOpenNewMonthModal.addEventListener('click', () => this.openNewMonthModal());
    this.btnCloseModalMonthly.addEventListener('click', () => this.closeModal(this.modalMonthly));
    this.btnCancelMonthly.addEventListener('click', () => this.closeModal(this.modalMonthly));
    this.btnAddEssentialItemModal.addEventListener('click', () => this.addEssentialItemRow());

    // Formula Triggers on Monthly Form (Live Calculation!)
    const formulaInputs = [
      this.mSalary, this.mTax, this.mBonus,
      this.mStudy, this.mParents, this.mSaving, this.mInvestment
    ];
    formulaInputs.forEach(input => {
      input.addEventListener('input', () => this.recalculateMonthlyFormulas());
    });

    this.formMonthly.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveMonth();
    });

    // Cashflow Type Toggle (Income / Expense)
    const typeButtons = document.querySelectorAll('.type-toggle-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('cfType').value = btn.getAttribute('data-type');
      });
    });

    // Cashflow Filter Pills
    this.cfFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.cfFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.cashflowFilter = pill.getAttribute('data-filter');
        this.renderCashflow();
      });
    });

    // Cashflow Modal
    this.btnOpenQuickTxModal.addEventListener('click', () => this.openCashflowModal());
    this.btnCloseModalCashflow.addEventListener('click', () => this.closeModal(this.modalCashflow));
    this.btnCancelCashflow.addEventListener('click', () => this.closeModal(this.modalCashflow));
    this.formCashflow.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveCashflow();
    });

    // Basket Modal
    this.btnOpenAddBasketModal.addEventListener('click', () => this.openBasketModal());
    this.btnCloseModalBasket.addEventListener('click', () => this.closeModal(this.modalBasket));
    this.btnCancelBasket.addEventListener('click', () => this.closeModal(this.modalBasket));
    this.formBasket.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveBasket();
    });

    // Settings actions
    this.btnExportJSON.addEventListener('click', () => {
      storage.exportJSON();
      this.showToast('Đã xuất file sao lưu JSON thành công!');
    });

    this.inputImportJSON.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target.result;
        const success = storage.importJSON(content);
        if (success) {
          this.showToast('Đã khôi phục dữ liệu từ JSON thành công!');
          this.refreshAll();
        } else {
          this.showToast('File JSON không hợp lệ!', false);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    this.btnCopyJSON.addEventListener('click', () => {
      const dataStr = JSON.stringify(storage.getAll(), null, 2);
      navigator.clipboard.writeText(dataStr).then(() => {
        this.showToast('Đã copy chuỗi dữ liệu JSON vào Clipboard!');
      }).catch(() => {
        this.showToast('Không thể copy vào clipboard!', false);
      });
    });

    this.btnResetSeedData.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đặt lại dữ liệu gốc từ file Excel (Tháng 9/2026)?')) {
        storage.resetSeedData();
        this.showToast('Đã đặt lại dữ liệu mẫu gốc ban đầu!');
        this.refreshAll();
      }
    });
  }

  initApp() {
    // Restore theme preference
    const savedTheme = localStorage.getItem('mms_theme');
    if (savedTheme === 'light') {
      document.body.classList.add('theme-light');
    }

    // Set today's date on cashflow modal
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('cfDate').value = today;

    this.refreshAll();
  }

  refreshAll() {
    const months = storage.getMonths();
    if (months.length > 0) {
      if (!this.selectedMonthId || !months.some(m => m.id === this.selectedMonthId)) {
        this.selectedMonthId = months[0].id;
      }
    } else {
      this.selectedMonthId = null;
    }

    this.populateMonthDropdown();
    this.renderDashboard();
    this.renderMonthlyList();
    this.renderCashflow();
    this.renderPortfolio();
    lucide.createIcons();
  }

  switchTab(targetViewId) {
    this.activeTab = targetViewId;
    this.navTabs.forEach(tab => {
      if (tab.getAttribute('data-target') === targetViewId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    this.viewSections.forEach(section => {
      if (section.id === targetViewId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Re-render specific views on switch
    if (targetViewId === 'view-dashboard') {
      this.renderDashboard();
    } else if (targetViewId === 'view-monthly') {
      this.renderMonthlyList();
    } else if (targetViewId === 'view-cashflow') {
      this.renderCashflow();
    } else if (targetViewId === 'view-invest') {
      this.renderPortfolio();
    }

    lucide.createIcons();
  }

  // ================= VIEW: DASHBOARD =================
  populateMonthDropdown() {
    const months = storage.getMonths();
    this.dashboardMonthSelect.innerHTML = '';

    if (months.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Chưa có bản ghi nào';
      this.dashboardMonthSelect.appendChild(opt);
      return;
    }

    months.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `Tháng ${m.month}/${m.year} (${m.type || 'Chính thức'}) - ${m.company}`;
      if (m.id === this.selectedMonthId) {
        opt.selected = true;
      }
      this.dashboardMonthSelect.appendChild(opt);
    });
  }

  renderDashboard() {
    const months = storage.getMonths();
    const currentMonth = months.find(m => m.id === this.selectedMonthId) || months[0];

    if (!currentMonth) {
      this.kpiNetSalary.textContent = '0 ₫';
      this.kpiGrossSalary.textContent = 'Lương gốc: 0 ₫';
      this.kpiTotalExpense.textContent = '0 ₫';
      this.kpiSaveInvest.textContent = '0 ₫';
      this.kpiFreeMoney.textContent = '0 ₫';
      return;
    }

    // 1. Calculate KPI Metrics
    const netSalary = FinanceCalc.calcNetSalary(currentMonth.salary, currentMonth.tax, currentMonth.bonus);
    const saveInvestTotal = FinanceCalc.toNumber(currentMonth.saving) + FinanceCalc.toNumber(currentMonth.investment);
    const totalSpending = FinanceCalc.calcTotalSpending(
      currentMonth.study,
      currentMonth.parents,
      currentMonth.essentialTotal,
      currentMonth.freeMoney
    );
    const saveRate = FinanceCalc.calcSaveInvestRate(currentMonth.saving, currentMonth.investment, netSalary);
    const expenseRatio = netSalary > 0 ? ((totalSpending / netSalary) * 100).toFixed(0) : 0;

    // 2. Set Big Numbers
    this.kpiNetSalary.textContent = FinanceCalc.formatVND(netSalary);
    this.kpiGrossSalary.textContent = `Lương: ${FinanceCalc.formatVND(currentMonth.salary)} | Thưởng: ${FinanceCalc.formatVND(currentMonth.bonus)}`;
    
    this.kpiTotalExpense.textContent = FinanceCalc.formatVND(totalSpending);
    this.kpiExpenseRatio.textContent = `${expenseRatio}% trên tổng thu nhập`;

    this.kpiSaveInvest.textContent = FinanceCalc.formatVND(saveInvestTotal);
    this.kpiSaveInvestRate.textContent = `Tỷ lệ tích lũy: ${saveRate.toFixed(1)}%`;

    this.kpiFreeMoney.textContent = FinanceCalc.formatVND(currentMonth.freeMoney);
    this.kpiActualBalance.textContent = `Số dư thực tế: ${FinanceCalc.formatVND(currentMonth.actualBalance || 0)}`;

    this.pieMonthLabel.textContent = `T${currentMonth.month}/${currentMonth.year}`;

    // 3. Render Essentials Breakdown
    this.essentialTotalText.textContent = `Tổng: ${FinanceCalc.formatVND(currentMonth.essentialTotal || 0)}`;
    const items = currentMonth.essentialsList || [];
    if (items.length === 0) {
      this.essentialsPreviewList.innerHTML = `<div class="text-caption text-center py-2">Chưa có mục thiết yếu chi tiết</div>`;
    } else {
      this.essentialsPreviewList.innerHTML = items.map(item => `
        <div class="essential-preview-row">
          <span class="essential-preview-name">${this.escapeHTML(item.name)}</span>
          <span class="essential-preview-amount">${FinanceCalc.formatVND(item.amount)}</span>
        </div>
      `).join('');
    }

    // 4. Render Charts
    FinanceCharts.renderExpensePieChart('expensePieChart', currentMonth);
    FinanceCharts.renderHistoryLineChart('historyLineChart', months);
  }

  // ================= VIEW: MONTHLY RECORDS =================
  renderMonthlyList() {
    const months = storage.getMonths();
    if (months.length === 0) {
      this.monthlyRecordsContainer.innerHTML = `
        <div class="card-box text-center py-4">
          <p class="text-muted">Chưa có bản ghi kì lương nào.</p>
          <button class="btn btn-primary btn-sm mt-2" onclick="app.openNewMonthModal()">
            <i data-lucide="plus-circle"></i> Thêm kì lương đầu tiên
          </button>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    this.monthlyRecordsContainer.innerHTML = months.map(m => {
      const net = FinanceCalc.calcNetSalary(m.salary, m.tax, m.bonus);
      const isTrial = m.type === 'Thử việc';
      const badgeClass = isTrial ? 'badge-primary' : 'badge-success';

      return `
        <div class="month-record-card">
          <div class="m-header">
            <div class="m-period">
              <div>
                <span class="m-period-tag">Tháng ${m.month}/${m.year}</span>
                <span class="m-company">${this.escapeHTML(m.company)}</span>
              </div>
              <span class="badge ${badgeClass}">${m.type || 'Chính thức'}</span>
            </div>
            <div class="m-actions">
              <button class="icon-btn" onclick="app.openEditMonthModal('${m.id}')" title="Sửa">
                <i data-lucide="edit-2"></i>
              </button>
              <button class="icon-btn" onclick="app.deleteMonthRecord('${m.id}')" title="Xóa" style="color: var(--danger);">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>

          <div class="m-grid-stats">
            <div class="m-stat-row">
              <span class="m-stat-label">Thực nhận</span>
              <span class="m-stat-val primary">${FinanceCalc.formatVND(net)}</span>
            </div>
            <div class="m-stat-row">
              <span class="m-stat-label">Tiền tiêu còn lại</span>
              <span class="m-stat-val success">${FinanceCalc.formatVND(m.freeMoney)}</span>
            </div>
            <div class="m-stat-row">
              <span class="m-stat-label">Tiết kiệm & Đầu tư</span>
              <span class="m-stat-val">${FinanceCalc.formatVND(FinanceCalc.toNumber(m.saving) + FinanceCalc.toNumber(m.investment))}</span>
            </div>
            <div class="m-stat-row">
              <span class="m-stat-label">Gửi bố mẹ & Học</span>
              <span class="m-stat-val">${FinanceCalc.formatVND(FinanceCalc.toNumber(m.parents) + FinanceCalc.toNumber(m.study))}</span>
            </div>
          </div>

          <div class="m-essentials-summary">
            <span>Nhu cầu thiết yếu (${(m.essentialsList || []).length} mục): <strong>${FinanceCalc.formatVND(m.essentialTotal || 0)}</strong></span>
            <span>Số dư thực tế: <strong>${FinanceCalc.formatVND(m.actualBalance || 0)}</strong></span>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons();
  }

  openNewMonthModal() {
    document.getElementById('modalMonthlyTitle').textContent = 'Thêm Kì Lương & Phân Bổ Mới';
    this.formMonthly.reset();
    this.monthRecordId.value = '';

    // Suggest next month based on latest record
    const months = storage.getMonths();
    if (months.length > 0) {
      const latest = months[0];
      let nextMonth = latest.month + 1;
      let nextYear = latest.year;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
      }
      this.mYear.value = nextYear;
      this.mMonth.value = nextMonth;
      this.mCompany.value = latest.company;
      this.mType.value = 'Chính thức';
      this.mSalary.value = 18970380; // Official salary default
      this.mTax.value = 0;
      this.mBonus.value = 0;
      this.mStudy.value = 5000000;
      this.mParents.value = 3500000;
      this.mSaving.value = 0;
      this.mInvestment.value = 1000000;
      this.mExpectedBalance.value = latest.actualBalance || 5000000;
      this.mActualBalance.value = latest.actualBalance || 5000000;

      // Copy previous essentials as base
      this.renderModalEssentialsRows(latest.essentialsList || []);
    } else {
      this.mYear.value = 2026;
      this.mMonth.value = 9;
      this.mCompany.value = 'MB - IT Risk - CV lv1';
      this.mType.value = 'Thử việc';
      this.mSalary.value = 13351500;
      this.renderModalEssentialsRows([
        { name: 'ChatGPT', amount: 340000 },
        { name: 'cut toc', amount: 100000 },
        { name: 'old spice', amount: 50000 },
        { name: 'mạng', amount: 90000 },
        { name: 'BCS', amount: 300000 }
      ]);
    }

    this.recalculateMonthlyFormulas();
    this.openModal(this.modalMonthly);
  }

  openEditMonthModal(monthId) {
    const record = storage.getMonthById(monthId);
    if (!record) return;

    document.getElementById('modalMonthlyTitle').textContent = `Sửa Kì Lương T${record.month}/${record.year}`;
    this.monthRecordId.value = record.id;
    this.mCompany.value = record.company || '';
    this.mType.value = record.type || 'Chính thức';
    this.mYear.value = record.year;
    this.mMonth.value = record.month;
    this.mSalary.value = record.salary || 0;
    this.mTax.value = record.tax || 0;
    this.mBonus.value = record.bonus || 0;
    this.mStudy.value = record.study || 0;
    this.mParents.value = record.parents || 0;
    this.mSaving.value = record.saving || 0;
    this.mInvestment.value = record.investment || 0;
    this.mExpectedBalance.value = record.expectedBalance || 0;
    this.mActualBalance.value = record.actualBalance || 0;

    this.renderModalEssentialsRows(record.essentialsList || []);
    this.recalculateMonthlyFormulas();
    this.openModal(this.modalMonthly);
  }

  renderModalEssentialsRows(items = []) {
    this.modalEssentialsList.innerHTML = '';
    items.forEach(item => {
      this.addEssentialItemRow(item.name, item.amount);
    });
    this.recalculateMonthlyFormulas();
  }

  addEssentialItemRow(name = '', amount = 0) {
    const row = document.createElement('div');
    row.className = 'subitem-row';
    row.innerHTML = `
      <input type="text" class="form-input subitem-name" placeholder="Tên mục (Ví dụ: Tiền mạng)" value="${this.escapeHTML(name)}">
      <input type="number" class="form-input subitem-amount formula-trigger" placeholder="Số tiền" value="${amount || ''}">
      <button type="button" class="btn-remove-subitem" title="Xóa mục"><i data-lucide="minus-circle"></i></button>
    `;

    // Event listeners for recalculation
    const amountInput = row.querySelector('.subitem-amount');
    amountInput.addEventListener('input', () => this.recalculateMonthlyFormulas());

    const removeBtn = row.querySelector('.btn-remove-subitem');
    removeBtn.addEventListener('click', () => {
      row.remove();
      this.recalculateMonthlyFormulas();
    });

    this.modalEssentialsList.appendChild(row);
    lucide.createIcons();
    this.recalculateMonthlyFormulas();
  }

  // LIVE FORMULA CALCULATION
  recalculateMonthlyFormulas() {
    // 1. Thực nhận = Lương - Khấu trừ + Thưởng
    const netSalary = FinanceCalc.calcNetSalary(
      this.mSalary.value,
      this.mTax.value,
      this.mBonus.value
    );
    this.mNetSalary.value = netSalary;

    // 2. Tổng Nhu cầu thiết yếu = Tổng các dòng con
    const subitemAmounts = this.modalEssentialsList.querySelectorAll('.subitem-amount');
    let essentialSum = 0;
    subitemAmounts.forEach(input => {
      essentialSum += FinanceCalc.toNumber(input.value);
    });
    this.mEssentialTotal.value = essentialSum;

    // 3. Tiền tiêu còn lại = Thực nhận - (Học + Gửi bố mẹ + Tiết kiệm + Đầu tư + Thiết yếu)
    const freeMoney = FinanceCalc.calcFreeMoney(
      netSalary,
      this.mStudy.value,
      this.mParents.value,
      this.mSaving.value,
      this.mInvestment.value,
      essentialSum
    );
    this.mFreeMoney.value = freeMoney;
  }

  handleSaveMonth() {
    // Collect essentials
    const rows = this.modalEssentialsList.querySelectorAll('.subitem-row');
    const essentialsList = [];
    rows.forEach(row => {
      const name = row.querySelector('.subitem-name').value.trim();
      const amount = FinanceCalc.toNumber(row.querySelector('.subitem-amount').value);
      if (name) {
        essentialsList.push({ name, amount });
      }
    });

    const netSalary = FinanceCalc.calcNetSalary(this.mSalary.value, this.mTax.value, this.mBonus.value);
    const essentialTotal = FinanceCalc.calcEssentialTotal(essentialsList);
    const freeMoney = FinanceCalc.calcFreeMoney(
      netSalary,
      this.mStudy.value,
      this.mParents.value,
      this.mSaving.value,
      this.mInvestment.value,
      essentialTotal
    );

    const record = {
      id: this.monthRecordId.value || undefined,
      company: this.mCompany.value.trim(),
      type: this.mType.value,
      year: parseInt(this.mYear.value, 10),
      month: parseInt(this.mMonth.value, 10),
      salary: FinanceCalc.toNumber(this.mSalary.value),
      tax: FinanceCalc.toNumber(this.mTax.value),
      bonus: FinanceCalc.toNumber(this.mBonus.value),
      netSalary: netSalary,
      study: FinanceCalc.toNumber(this.mStudy.value),
      parents: FinanceCalc.toNumber(this.mParents.value),
      saving: FinanceCalc.toNumber(this.mSaving.value),
      investment: FinanceCalc.toNumber(this.mInvestment.value),
      essentialsList: essentialsList,
      essentialTotal: essentialTotal,
      freeMoney: freeMoney,
      expectedBalance: FinanceCalc.toNumber(this.mExpectedBalance.value),
      actualBalance: FinanceCalc.toNumber(this.mActualBalance.value)
    };

    const saved = storage.saveMonth(record);
    this.selectedMonthId = saved.id;
    this.closeModal(this.modalMonthly);
    this.showToast('Đã lưu dữ liệu kì lương thành công!');
    this.refreshAll();
  }

  deleteMonthRecord(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bản ghi kì lương này không?')) {
      storage.deleteMonth(id);
      this.showToast('Đã xóa kì lương!');
      this.refreshAll();
    }
  }

  // ================= VIEW: SỔ THU CHI LINH HOẠT =================
  renderCashflow() {
    const allTxs = storage.getCashflows();
    
    // Calculate total summary
    let totalIncome = 0;
    let totalExpense = 0;
    allTxs.forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount || 0);
      else totalExpense += Number(t.amount || 0);
    });

    this.cfTotalIncome.textContent = `+${FinanceCalc.formatVNDCompact(totalIncome)}`;
    this.cfTotalExpense.textContent = `-${FinanceCalc.formatVNDCompact(totalExpense)}`;
    const diff = totalIncome - totalExpense;
    this.cfNetBalance.textContent = FinanceCalc.formatVNDCompact(diff);

    // Apply Filter
    let filtered = allTxs;
    if (this.cashflowFilter !== 'all') {
      filtered = allTxs.filter(t => t.type === this.cashflowFilter);
    }

    if (filtered.length === 0) {
      this.txListContainer.innerHTML = `
        <div class="card-box text-center py-4">
          <p class="text-muted">Không có giao dịch nào phù hợp.</p>
        </div>
      `;
      return;
    }

    const categoryIcons = {
      'Ăn uống': '🍜',
      'Thiết yếu': '🛒',
      'Học tập': '📚',
      'Mua sắm': '🛍️',
      'Đi lại': '🛵',
      'Bố mẹ': '👨‍👩‍👦',
      'Đầu tư': '📈',
      'Lương thưởng': '💰',
      'Khác': '✨'
    };

    this.txListContainer.innerHTML = filtered.map(t => {
      const isExpense = t.type === 'expense';
      const sign = isExpense ? '-' : '+';
      const amtClass = isExpense ? 'expense' : 'income';
      const icon = categoryIcons[t.category] || '💸';

      return `
        <div class="tx-card">
          <div class="tx-left">
            <div class="tx-icon-circle">${icon}</div>
            <div class="tx-details">
              <span class="tx-title">${this.escapeHTML(t.note || t.category)}</span>
              <span class="tx-date-category">${t.date} • ${t.category}</span>
            </div>
          </div>
          <div class="tx-right">
            <span class="tx-amount ${amtClass}">${sign}${FinanceCalc.formatVND(t.amount)}</span>
            <button class="btn-link" onclick="app.deleteCashflowTx('${t.id}')" style="color: var(--text-dim); font-size: 11px;">Xóa</button>
          </div>
        </div>
      `;
    }).join('');
  }

  openCashflowModal() {
    this.formCashflow.reset();
    document.getElementById('cfTxId').value = '';
    document.getElementById('cfDate').value = new Date().toISOString().split('T')[0];
    this.openModal(this.modalCashflow);
  }

  handleSaveCashflow() {
    const tx = {
      id: document.getElementById('cfTxId').value || undefined,
      type: document.getElementById('cfType').value,
      amount: FinanceCalc.toNumber(document.getElementById('cfAmount').value),
      date: document.getElementById('cfDate').value,
      category: document.getElementById('cfCategory').value,
      note: document.getElementById('cfNote').value.trim()
    };

    storage.saveCashflow(tx);
    this.closeModal(this.modalCashflow);
    this.showToast('Đã ghi nhận dòng tiền mới!');
    this.renderCashflow();
  }

  deleteCashflowTx(id) {
    storage.deleteCashflow(id);
    this.showToast('Đã xóa khoản dòng tiền!');
    this.renderCashflow();
  }

  // ================= VIEW: DANH MỤC ĐẦU TƯ =================
  renderPortfolio() {
    const baskets = storage.getBaskets();
    const metrics = FinanceCalc.calcPortfolioMetrics(baskets);

    this.portfolioTotalValue.textContent = FinanceCalc.formatVND(metrics.totalCurrentValue);
    this.portfolioTotalCapital.textContent = FinanceCalc.formatVND(metrics.totalCapital);
    this.portfolioTotalPnL.textContent = `${metrics.pnlAmount >= 0 ? '+' : ''}${FinanceCalc.formatVND(metrics.pnlAmount)}`;
    
    this.portfolioPnLBadge.textContent = FinanceCalc.formatPercent(metrics.pnlPercent);
    if (metrics.pnlPercent < 0) {
      this.portfolioPnLBadge.classList.add('negative');
    } else {
      this.portfolioPnLBadge.classList.remove('negative');
    }

    this.basketsCountBadge.textContent = `${baskets.length} rỏ tài sản`;

    // Render Baskets List
    if (baskets.length === 0) {
      this.basketsContainer.innerHTML = `
        <div class="text-center py-3 text-muted">Chưa có rỏ đầu tư nào được tạo.</div>
      `;
    } else {
      this.basketsContainer.innerHTML = baskets.map(b => {
        const capital = FinanceCalc.toNumber(b.capital);
        const current = FinanceCalc.toNumber(b.currentValue);
        const pnlAmt = current - capital;
        const pnlPct = capital > 0 ? (pnlAmt / capital) * 100 : 0;
        const isPos = pnlAmt >= 0;

        return `
          <div class="basket-card">
            <div class="b-top">
              <div class="b-identity">
                <span class="b-color-dot" style="background-color: ${b.color || '#3b82f6'};"></span>
                <div>
                  <h4 class="b-title">${this.escapeHTML(b.name)}</h4>
                  <span class="b-type-badge">${b.type}</span>
                </div>
              </div>
              <div class="m-actions">
                <button class="icon-btn" onclick="app.openEditBasketModal('${b.id}')" title="Sửa"><i data-lucide="edit-2"></i></button>
                <button class="icon-btn" onclick="app.deleteBasketItem('${b.id}')" title="Xóa" style="color: var(--danger);"><i data-lucide="trash-2"></i></button>
              </div>
            </div>

            <div class="b-grid">
              <div class="b-col">
                <span class="b-lbl">Vốn đã bỏ vào</span>
                <span class="b-val">${FinanceCalc.formatVND(capital)}</span>
              </div>
              <div class="b-col">
                <span class="b-lbl">Giá trị hiện tại</span>
                <span class="b-val">${FinanceCalc.formatVND(current)}</span>
              </div>
              <div class="b-col">
                <span class="b-lbl">Lợi nhuận (P&L)</span>
                <span class="b-pnl ${isPos ? 'positive' : 'negative'}">
                  ${isPos ? '+' : ''}${FinanceCalc.formatVND(pnlAmt)} (${FinanceCalc.formatPercent(pnlPct)})
                </span>
              </div>
              <div class="b-col">
                <span class="b-lbl">Ghi chú</span>
                <span class="text-caption">${this.escapeHTML(b.note || 'Không có')}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    FinanceCharts.renderPortfolioChart('portfolioChart', baskets);
    lucide.createIcons();
  }

  openBasketModal() {
    document.getElementById('modalBasketTitle').textContent = 'Khai Báo Rỏ Đầu Tư Mới';
    this.formBasket.reset();
    document.getElementById('basketId').value = '';
    document.getElementById('basketColor').value = '#3b82f6';
    this.openModal(this.modalBasket);
  }

  openEditBasketModal(id) {
    const baskets = storage.getBaskets();
    const basket = baskets.find(b => b.id === id);
    if (!basket) return;

    document.getElementById('modalBasketTitle').textContent = `Sửa Rỏ: ${basket.name}`;
    document.getElementById('basketId').value = basket.id;
    document.getElementById('basketName').value = basket.name;
    document.getElementById('basketType').value = basket.type || 'Chứng khoán';
    document.getElementById('basketColor').value = basket.color || '#3b82f6';
    document.getElementById('basketCapital').value = basket.capital;
    document.getElementById('basketCurrentValue').value = basket.currentValue;
    document.getElementById('basketNote').value = basket.note || '';

    this.openModal(this.modalBasket);
  }

  handleSaveBasket() {
    const basket = {
      id: document.getElementById('basketId').value || undefined,
      name: document.getElementById('basketName').value.trim(),
      type: document.getElementById('basketType').value,
      color: document.getElementById('basketColor').value,
      capital: FinanceCalc.toNumber(document.getElementById('basketCapital').value),
      currentValue: FinanceCalc.toNumber(document.getElementById('basketCurrentValue').value),
      note: document.getElementById('basketNote').value.trim()
    };

    storage.saveBasket(basket);
    this.closeModal(this.modalBasket);
    this.showToast('Đã lưu rỏ đầu tư thành công!');
    this.renderPortfolio();
  }

  deleteBasketItem(id) {
    if (confirm('Bạn có chắc muốn xóa rỏ đầu tư này?')) {
      storage.deleteBasket(id);
      this.showToast('Đã xóa rỏ đầu tư!');
      this.renderPortfolio();
    }
  }

  // ================= MODAL & TOAST HELPERS =================
  openModal(modalEl) {
    modalEl.classList.add('open');
    lucide.createIcons();
  }

  closeModal(modalEl) {
    modalEl.classList.remove('open');
  }

  showToast(message, isSuccess = true) {
    this.toastMessage.textContent = message;
    this.toastNotification.classList.add('show');
    setTimeout(() => {
      this.toastNotification.classList.remove('show');
    }, 2800);
  }

  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Instantiate global app
window.app = new AppController();
