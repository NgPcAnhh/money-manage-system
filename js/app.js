/**
 * MMS - Main Application Controller
 * Features:
 * - Swipe Carousel Navigation (5 slides)
 * - Compact Dynamic Slim Bottom Bar (Active tab enlarged, inactive scaled down)
 * - Modern Dashboard Mode Toggles (Kì mới nhất / Tổng các kì / Filter Sheet)
 * - Truy Vấn Số Liệu (Deep Dive Query with Time Filters)
 * - Anti-text-overflow layout for iPhone 15 Pro Max
 */

class AppController {
  constructor() {
    this.currentSlide = 0; // 0: Dashboard, 1: Monthly, 2: Cashflow, 3: Invest, 4: Query
    this.totalSlides = 5;
    
    // Dashboard Filter State
    this.dashboardMode = 'latest'; // 'latest' | 'all' | 'custom'
    this.customSelectedMonthId = null;
    this.cashflowFilter = 'all';

    // Query Filter State
    this.queryRange = 'all'; // 'all' | 'year_2026' | 'custom'
    this.queryStartMonthVal = null;
    this.queryEndMonthVal = null;

    this.initElements();
    this.bindEvents();
    this.initSwipeGesture();
    this.initApp();
  }

  initElements() {
    // Carousel
    this.swipeViewport = document.getElementById('swipeViewport');
    this.swipeTrack = document.getElementById('swipeTrack');
    this.slimTabs = document.querySelectorAll('.bottom-slim-bar .slim-tab');

    // Dashboard View Elements
    this.btnModeLatest = document.getElementById('btnModeLatest');
    this.btnModeAll = document.getElementById('btnModeAll');
    this.labelLatestMonth = document.getElementById('labelLatestMonth');
    this.btnOpenFilterSheet = document.getElementById('btnOpenFilterSheet');
    this.modalFilterSheet = document.getElementById('modalFilterSheet');
    this.btnCloseFilterSheet = document.getElementById('btnCloseFilterSheet');
    this.filterMonthOptions = document.getElementById('filterMonthOptions');
    this.currentFilterBadge = document.getElementById('currentFilterBadge');
    this.currentFilterText = document.getElementById('currentFilterText');
    this.btnClearCustomFilter = document.getElementById('btnClearCustomFilter');

    // KPI Elements (Dashboard)
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

    // Monthly View Elements
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

    // Cashflow View Elements
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

    // Investment View Elements
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

    // Query View Elements (MỚI)
    this.quickRangeChips = document.querySelectorAll('#quickRangeChips .chip');
    this.customRangeInputs = document.getElementById('customRangeInputs');
    this.queryStartMonth = document.getElementById('queryStartMonth');
    this.queryEndMonth = document.getElementById('queryEndMonth');
    this.queryResultRangeBadge = document.getElementById('queryResultRangeBadge');
    this.queryAvgRateBadge = document.getElementById('queryAvgRateBadge');
    this.qTotalIncome = document.getElementById('qTotalIncome');
    this.qAvgMonthlyIncome = document.getElementById('qAvgMonthlyIncome');
    this.qTotalExpense = document.getElementById('qTotalExpense');
    this.qAvgMonthlyExpense = document.getElementById('qAvgMonthlyExpense');
    this.qTotalSavings = document.getElementById('qTotalSavings');
    this.qTotalInvested = document.getElementById('qTotalInvested');
    this.qTotalFreeMoney = document.getElementById('qTotalFreeMoney');
    this.qActualEndBalance = document.getElementById('qActualEndBalance');
    this.queryBreakdownList = document.getElementById('queryBreakdownList');
    this.queryMonthsTable = document.getElementById('queryMonthsTable');
    this.queryMonthsCount = document.getElementById('queryMonthsCount');

    // Header & Theme Elements
    this.paydayCountdownText = document.getElementById('paydayCountdownText');
    this.paydayTargetDate = document.getElementById('paydayTargetDate');
    this.btnToggleTheme = document.getElementById('btnToggleTheme');
    this.themeIcon = document.getElementById('themeIcon');
    this.toastNotification = document.getElementById('toastNotification');
    this.toastMessage = document.getElementById('toastMessage');
  }

  bindEvents() {
    // 1. Bottom Tab Clicks
    this.slimTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const slideIndex = parseInt(tab.getAttribute('data-slide'), 10);
        this.goToSlide(slideIndex);
      });
    });

    // 2. Theme Toggle Switch
    this.btnToggleTheme.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      const isLight = document.body.classList.contains('theme-light');
      localStorage.setItem('mms_theme', isLight ? 'light' : 'dark');
      this.updateThemeIcon(isLight);
      this.showToast(isLight ? 'Đã đổi sang giao diện Sáng' : 'Đã đổi sang giao diện Tối');
    });

    // 4. Dashboard Quick Toggles
    this.btnModeLatest.addEventListener('click', () => {
      this.dashboardMode = 'latest';
      this.customSelectedMonthId = null;
      this.updateDashboardFilterUI();
      this.renderDashboard();
    });

    this.btnModeAll.addEventListener('click', () => {
      this.dashboardMode = 'all';
      this.customSelectedMonthId = null;
      this.updateDashboardFilterUI();
      this.renderDashboard();
    });

    // 5. Dashboard Filter Sheet
    this.btnOpenFilterSheet.addEventListener('click', () => {
      this.renderFilterMonthOptions();
      this.openModal(this.modalFilterSheet);
    });

    this.btnCloseFilterSheet.addEventListener('click', () => {
      this.closeModal(this.modalFilterSheet);
    });

    this.btnClearCustomFilter.addEventListener('click', () => {
      this.dashboardMode = 'latest';
      this.customSelectedMonthId = null;
      this.updateDashboardFilterUI();
      this.renderDashboard();
    });

    // Edit Essentials button on Dashboard
    if (this.btnEditCurrentEssentials) {
      this.btnEditCurrentEssentials.addEventListener('click', () => {
        const months = storage.getMonths();
        let targetId = this.customSelectedMonthId || (months[0] ? months[0].id : null);
        if (targetId) {
          this.openEditMonthModal(targetId);
        }
      });
    }

    // Monthly Modal Events
    this.btnOpenNewMonthModal.addEventListener('click', () => this.openNewMonthModal());
    this.btnCloseModalMonthly.addEventListener('click', () => this.closeModal(this.modalMonthly));
    this.btnCancelMonthly.addEventListener('click', () => this.closeModal(this.modalMonthly));
    this.btnAddEssentialItemModal.addEventListener('click', () => this.addEssentialItemRow());

    // Formula Triggers
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

    // Cashflow Type Toggle
    const typeButtons = document.querySelectorAll('.type-toggle-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('cfType').value = btn.getAttribute('data-type');
      });
    });

    // Cashflow Filters
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

    // Query Range Chips
    this.quickRangeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.quickRangeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.queryRange = chip.getAttribute('data-range');
        if (this.queryRange === 'custom') {
          this.customRangeInputs.style.display = 'block';
        } else {
          this.customRangeInputs.style.display = 'none';
        }
        this.renderQueryView();
      });
    });

    this.queryStartMonth.addEventListener('change', () => this.renderQueryView());
    this.queryEndMonth.addEventListener('change', () => this.renderQueryView());

    // Backup & Restore
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
  }

  // ================= SWIPE GESTURE ENGINE (FLAWLESS TOUCH & MOUSE) =================
  initSwipeGesture() {
    const viewport = this.swipeViewport;
    const track = this.swipeTrack;
    if (!viewport || !track) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isHorizontal = null; // null = undecided, true = horizontal swipe, false = vertical scroll

    // Prevent default browser dragging on images/canvas
    viewport.addEventListener('dragstart', (e) => e.preventDefault());

    const onStart = (clientX, clientY, target) => {
      // Don't start drag if interacting with buttons, inputs, dropdowns
      if (target && target.closest('button, input, select, textarea, .btn, .icon-btn, .pill, .chip, .toggle-pill, .filter-round-btn, .filter-option-item')) {
        return false;
      }

      isDragging = true;
      isHorizontal = null;
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      track.style.transition = 'none'; // Live follow without lag
      return true;
    };

    const onMove = (clientX, clientY, e) => {
      if (!isDragging) return;

      const diffX = clientX - startX;
      const diffY = clientY - startY;

      // Determine swipe direction after small initial movement
      if (isHorizontal === null) {
        if (Math.abs(diffX) > 7 || Math.abs(diffY) > 7) {
          isHorizontal = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      // If horizontal swipe: prevent vertical scroll and follow finger live!
      if (isHorizontal === true) {
        if (e && e.cancelable) {
          e.preventDefault();
        }
        currentX = clientX;

        // Calculate dynamic real-time percentage offset
        const baseOffsetPercent = -this.currentSlide * 20; // 20% per slide (5 slides)
        const viewportWidth = viewport.offsetWidth || 430;
        const diffPercent = (diffX / viewportWidth) * 20;

        // Add elastic resistance at start and end
        let finalPercent = baseOffsetPercent + diffPercent;
        if (this.currentSlide === 0 && diffX > 0) {
          finalPercent = baseOffsetPercent + diffPercent * 0.3;
        } else if (this.currentSlide === this.totalSlides - 1 && diffX < 0) {
          finalPercent = baseOffsetPercent + diffPercent * 0.3;
        }

        track.style.transform = `translateX(${finalPercent}%)`;
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';

      if (isHorizontal === true) {
        const diffX = currentX - startX;
        const threshold = 35; // Minimum drag distance to switch tab

        if (diffX < -threshold && this.currentSlide < this.totalSlides - 1) {
          // Vuốt từ phải qua trái (drag left) -> Chuyển sang tab KẾ TIẾP
          this.goToSlide(this.currentSlide + 1);
        } else if (diffX > threshold && this.currentSlide > 0) {
          // Vuốt từ trái qua phải (drag right) -> Chuyển sang tab TRƯỚC ĐÓ
          this.goToSlide(this.currentSlide - 1);
        } else {
          // Chưa đủ lực vuốt -> Snap trở lại tab hiện tại
          this.goToSlide(this.currentSlide);
        }
      } else {
        this.goToSlide(this.currentSlide);
      }

      isHorizontal = null;
    };

    // --- MOBILE TOUCH LISTENERS (iOS Safari / Android) ---
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false }); // CRITICAL: passive: false allows e.preventDefault() to lock horizontal swipe!

    viewport.addEventListener('touchend', () => {
      onEnd();
    }, { passive: true });

    viewport.addEventListener('touchcancel', () => {
      onEnd();
    }, { passive: true });

    // --- DESKTOP MOUSE DRAG LISTENERS (Click & drag to test) ---
    viewport.addEventListener('mousedown', (e) => {
      if (onStart(e.clientX, e.clientY, e.target)) {
        e.preventDefault();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        onMove(e.clientX, e.clientY, e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        onEnd();
      }
    });
  }

  goToSlide(slideIndex) {
    if (slideIndex < 0) slideIndex = 0;
    if (slideIndex >= this.totalSlides) slideIndex = this.totalSlides - 1;

    this.currentSlide = slideIndex;
    this.swipeTrack.style.transform = `translateX(-${slideIndex * 20}%)`;

    // Update Bottom Bar
    this.slimTabs.forEach((tab, idx) => {
      if (idx === slideIndex) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Refresh content for active slide
    if (slideIndex === 0) {
      this.renderDashboard();
    } else if (slideIndex === 1) {
      this.renderMonthlyList();
    } else if (slideIndex === 2) {
      this.renderCashflow();
    } else if (slideIndex === 3) {
      this.renderPortfolio();
    } else if (slideIndex === 4) {
      this.renderQueryView();
    }

    lucide.createIcons();
  }

  // ================= APP INITIALIZATION =================
  initApp() {
    const savedTheme = localStorage.getItem('mms_theme');
    const isLight = savedTheme === 'light';
    if (isLight) {
      document.body.classList.add('theme-light');
    }
    this.updateThemeIcon(isLight);

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('cfDate').value = today;

    this.refreshAll();
  }

  updateThemeIcon(isLight) {
    if (!this.themeIcon) return;
    this.themeIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }

  updatePaydayCountdown(record) {
    const now = new Date();
    const todayDate = now.getDate();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    let refYear = currentYear;
    let refMonth = currentMonth;

    if (record && typeof record.month === 'number' && typeof record.year === 'number') {
      refYear = record.year;
      refMonth = record.month;
    }

    const todayZero = new Date(currentYear, now.getMonth(), todayDate);
    const targetPayDate = new Date(refYear, refMonth - 1, 28);
    const diffTime = targetPayDate.getTime() - todayZero.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (!this.paydayCountdownText || !this.paydayTargetDate) return;

    if (diffDays > 0) {
      this.paydayCountdownText.innerHTML = `Còn <strong>${diffDays} ngày</strong> nhận lương`;
      this.paydayTargetDate.textContent = `So với ngày 28/${String(refMonth).padStart(2, '0')}/${refYear}`;
    } else if (diffDays === 0) {
      this.paydayCountdownText.innerHTML = `🎉 <strong>Hôm nay ngày 28 nhận lương!</strong>`;
      this.paydayTargetDate.textContent = `Kì lương 28/${String(refMonth).padStart(2, '0')}/${refYear}`;
    } else {
      // If viewed month's 28th has passed relative to today, show days to the upcoming 28th
      let nextPayDate = new Date(currentYear, now.getMonth(), 28);
      if (todayDate > 28) {
        nextPayDate = new Date(currentYear, now.getMonth() + 1, 28);
      }
      const daysToNext = Math.round((nextPayDate.getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24));
      const nextMonthNum = nextPayDate.getMonth() + 1;

      if (daysToNext === 0) {
        this.paydayCountdownText.innerHTML = `🎉 <strong>Hôm nay nhận lương!</strong>`;
        this.paydayTargetDate.textContent = `Ngày 28/${String(nextMonthNum).padStart(2, '0')}`;
      } else {
        this.paydayCountdownText.innerHTML = `Còn <strong>${daysToNext} ngày</strong> nhận lương`;
        this.paydayTargetDate.textContent = `Kì tới: Ngày 28/${String(nextMonthNum).padStart(2, '0')}`;
      }
    }
  }

  refreshAll() {
    this.updateDashboardFilterUI();
    this.renderDashboard();
    this.renderMonthlyList();
    this.renderCashflow();
    this.renderPortfolio();
    this.populateQueryMonthSelects();
    this.renderQueryView();
    lucide.createIcons();
  }

  updateDashboardFilterUI() {
    const months = storage.getMonths();
    const latest = months[0];

    if (latest) {
      this.labelLatestMonth.textContent = `Kì mới nhất (T${latest.month}/${String(latest.year).slice(-2)})`;
    } else {
      this.labelLatestMonth.textContent = 'Kì mới nhất';
    }

    if (this.dashboardMode === 'latest') {
      this.btnModeLatest.classList.add('active');
      this.btnModeAll.classList.remove('active');
      this.currentFilterBadge.style.display = 'none';
    } else if (this.dashboardMode === 'all') {
      this.btnModeLatest.classList.remove('active');
      this.btnModeAll.classList.add('active');
      this.currentFilterBadge.style.display = 'none';
    } else if (this.dashboardMode === 'custom') {
      this.btnModeLatest.classList.remove('active');
      this.btnModeAll.classList.remove('active');
      const selected = storage.getMonthById(this.customSelectedMonthId);
      if (selected) {
        this.currentFilterText.textContent = `Đang xem: T${selected.month}/${selected.year} (${selected.company})`;
        this.currentFilterBadge.style.display = 'flex';
      } else {
        this.currentFilterBadge.style.display = 'none';
      }
    }
  }

  // ================= VIEW: DASHBOARD =================
  renderDashboard() {
    const months = storage.getMonths();
    if (months.length === 0) {
      this.kpiNetSalary.textContent = '0 ₫';
      this.kpiGrossSalary.textContent = 'Lương gốc: 0 ₫';
      this.kpiTotalExpense.textContent = '0 ₫';
      this.kpiSaveInvest.textContent = '0 ₫';
      this.kpiFreeMoney.textContent = '0 ₫';
      return;
    }

    let displayRecord = null;
    let isAggregated = false;

    if (this.dashboardMode === 'all') {
      isAggregated = true;
      // Aggregate across ALL months
      let totalSalary = 0, totalTax = 0, totalBonus = 0, totalNet = 0;
      let totalStudy = 0, totalParents = 0, totalSaving = 0, totalInvestment = 0;
      let totalEssential = 0, totalFree = 0;
      const combinedEssentials = [];

      months.forEach(m => {
        totalSalary += FinanceCalc.toNumber(m.salary);
        totalTax += FinanceCalc.toNumber(m.tax);
        totalBonus += FinanceCalc.toNumber(m.bonus);
        totalNet += FinanceCalc.calcNetSalary(m.salary, m.tax, m.bonus);
        totalStudy += FinanceCalc.toNumber(m.study);
        totalParents += FinanceCalc.toNumber(m.parents);
        totalSaving += FinanceCalc.toNumber(m.saving);
        totalInvestment += FinanceCalc.toNumber(m.investment);
        totalEssential += FinanceCalc.toNumber(m.essentialTotal);
        totalFree += FinanceCalc.toNumber(m.freeMoney);

        (m.essentialsList || []).forEach(item => {
          const exist = combinedEssentials.find(e => e.name.toLowerCase() === item.name.toLowerCase());
          if (exist) {
            exist.amount += FinanceCalc.toNumber(item.amount);
          } else {
            combinedEssentials.push({ name: item.name, amount: FinanceCalc.toNumber(item.amount) });
          }
        });
      });

      displayRecord = {
        month: 'Tất cả',
        year: `${months.length} kì`,
        salary: totalSalary,
        bonus: totalBonus,
        netSalary: totalNet,
        study: totalStudy,
        parents: totalParents,
        saving: totalSaving,
        investment: totalInvestment,
        essentialTotal: totalEssential,
        freeMoney: totalFree,
        actualBalance: months[0] ? months[0].actualBalance : 0,
        essentialsList: combinedEssentials
      };
    } else if (this.dashboardMode === 'custom' && this.customSelectedMonthId) {
      displayRecord = storage.getMonthById(this.customSelectedMonthId) || months[0];
    } else {
      // Default: Latest month
      displayRecord = months[0];
    }

    // 1. Calculations & Payday Countdown
    this.updatePaydayCountdown(displayRecord);

    const netSalary = FinanceCalc.toNumber(displayRecord.netSalary);
    const saveInvestTotal = FinanceCalc.toNumber(displayRecord.saving) + FinanceCalc.toNumber(displayRecord.investment);
    const totalSpending = FinanceCalc.calcTotalSpending(
      displayRecord.study,
      displayRecord.parents,
      displayRecord.essentialTotal,
      displayRecord.freeMoney
    );
    const saveRate = FinanceCalc.calcSaveInvestRate(displayRecord.saving, displayRecord.investment, netSalary);
    const expenseRatio = netSalary > 0 ? ((totalSpending / netSalary) * 100).toFixed(0) : 0;

    // 2. Set Safe KPI Big Numbers (Compact, no overflow)
    this.kpiNetSalary.textContent = FinanceCalc.formatVND(netSalary);
    this.kpiGrossSalary.textContent = isAggregated
      ? `Lương: ${FinanceCalc.formatVNDCompact(displayRecord.salary)} | Thưởng: ${FinanceCalc.formatVNDCompact(displayRecord.bonus)}`
      : `Lương: ${FinanceCalc.formatVNDCompact(displayRecord.salary)} | Thưởng: ${FinanceCalc.formatVNDCompact(displayRecord.bonus)}`;

    this.kpiTotalExpense.textContent = FinanceCalc.formatVND(totalSpending);
    this.kpiExpenseRatio.textContent = `${expenseRatio}% trên tổng thu nhập`;

    this.kpiSaveInvest.textContent = FinanceCalc.formatVND(saveInvestTotal);
    this.kpiSaveInvestRate.textContent = `Tích lũy: ${saveRate.toFixed(1)}%`;

    this.kpiFreeMoney.textContent = FinanceCalc.formatVND(displayRecord.freeMoney);
    this.kpiActualBalance.textContent = `Số dư thực tế: ${FinanceCalc.formatVND(displayRecord.actualBalance || 0)}`;

    this.pieMonthLabel.textContent = isAggregated ? `Tổng ${months.length} kì` : `T${displayRecord.month}/${displayRecord.year}`;

    // 3. Render Essentials Breakdown
    this.essentialTotalText.textContent = `Tổng: ${FinanceCalc.formatVND(displayRecord.essentialTotal || 0)}`;
    const items = displayRecord.essentialsList || [];
    if (items.length === 0) {
      this.essentialsPreviewList.innerHTML = `<div class="text-caption text-center py-2">Chưa có mục thiết yếu chi tiết</div>`;
    } else {
      this.essentialsPreviewList.innerHTML = items.slice(0, 6).map(item => `
        <div class="essential-preview-row">
          <span class="essential-preview-name">${this.escapeHTML(item.name)}</span>
          <span class="essential-preview-amount">${FinanceCalc.formatVND(item.amount)}</span>
        </div>
      `).join('');
    }

    // 4. Render Charts
    FinanceCharts.renderExpensePieChart('expensePieChart', displayRecord);
    FinanceCharts.renderHistoryLineChart('historyLineChart', months);
  }

  renderFilterMonthOptions() {
    const months = storage.getMonths();
    if (months.length === 0) {
      this.filterMonthOptions.innerHTML = `<p class="text-muted text-center py-2">Chưa có kì lương nào.</p>`;
      return;
    }

    this.filterMonthOptions.innerHTML = months.map(m => {
      const isSelected = this.dashboardMode === 'custom' && this.customSelectedMonthId === m.id;
      return `
        <div class="filter-option-item ${isSelected ? 'selected' : ''}" onclick="app.selectCustomMonth('${m.id}')">
          <div>
            <strong>Tháng ${m.month}/${m.year}</strong>
            <span class="text-caption" style="display: block;">${this.escapeHTML(m.company)} • ${m.type || 'Chính thức'}</span>
          </div>
          <span style="font-weight: 700; color: #60a5fa;">${FinanceCalc.formatVND(m.netSalary)}</span>
        </div>
      `;
    }).join('');
  }

  selectCustomMonth(monthId) {
    this.dashboardMode = 'custom';
    this.customSelectedMonthId = monthId;
    this.closeModal(this.modalFilterSheet);
    this.updateDashboardFilterUI();
    this.renderDashboard();
    this.showToast('Đã lọc theo kì bạn chọn!');
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
      this.mSalary.value = 18970380;
      this.mTax.value = 0;
      this.mBonus.value = 0;
      this.mStudy.value = 5000000;
      this.mParents.value = 3500000;
      this.mSaving.value = 0;
      this.mInvestment.value = 1000000;
      this.mExpectedBalance.value = latest.actualBalance || 5000000;
      this.mActualBalance.value = latest.actualBalance || 5000000;

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

  recalculateMonthlyFormulas() {
    const netSalary = FinanceCalc.calcNetSalary(
      this.mSalary.value,
      this.mTax.value,
      this.mBonus.value
    );
    this.mNetSalary.value = netSalary;

    const subitemAmounts = this.modalEssentialsList.querySelectorAll('.subitem-amount');
    let essentialSum = 0;
    subitemAmounts.forEach(input => {
      essentialSum += FinanceCalc.toNumber(input.value);
    });
    this.mEssentialTotal.value = essentialSum;

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

    storage.saveMonth(record);
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

    let filtered = allTxs;
    if (this.cashflowFilter !== 'all') {
      filtered = allTxs.filter(t => t.type === this.cashflowFilter);
    }

    if (filtered.length === 0) {
      this.txListContainer.innerHTML = `
        <div class="card-box text-center py-4" style="border: 1px dashed var(--border-subtle); background: transparent;">
          <p class="text-muted" style="font-size: 13px; margin-bottom: 10px;">Chưa có khoản thu/chi nào được ghi nhận.</p>
          <button class="btn btn-outline btn-sm" onclick="app.openCashflowModal()">
            <i data-lucide="plus"></i> Ghi khoản phát sinh mới
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
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

    if (baskets.length === 0) {
      this.basketsContainer.innerHTML = `
        <div class="text-center py-4 text-muted" style="border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg); padding: 24px 16px;">
          <div style="font-size: 28px; margin-bottom: 8px;">💼</div>
          <p style="font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Chưa có rỏ đầu tư nào</p>
          <p class="text-caption mb-3">Khai báo danh mục và số tiền bạn đang bỏ vào các rỏ đầu tư.</p>
          <button class="btn btn-primary btn-sm" onclick="app.openBasketModal()">
            <i data-lucide="plus-circle"></i> Khai Báo Rỏ Đầu Tiên
          </button>
        </div>
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

  // ================= VIEW: TRUY VẤN SỐ LIỆU (MỚI) =================
  populateQueryMonthSelects() {
    const months = storage.getMonths();
    this.queryStartMonth.innerHTML = '';
    this.queryEndMonth.innerHTML = '';

    if (months.length === 0) return;

    // Sort ascending for range dropdowns
    const ascending = [...months].sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));

    ascending.forEach((m, idx) => {
      const val = `${m.year}-${String(m.month).padStart(2, '0')}`;
      const text = `T${m.month}/${m.year}`;

      const optStart = document.createElement('option');
      optStart.value = val;
      optStart.textContent = text;
      if (idx === 0) optStart.selected = true;
      this.queryStartMonth.appendChild(optStart);

      const optEnd = document.createElement('option');
      optEnd.value = val;
      optEnd.textContent = text;
      if (idx === ascending.length - 1) optEnd.selected = true;
      this.queryEndMonth.appendChild(optEnd);
    });
  }

  renderQueryView() {
    const allMonths = storage.getMonths();
    if (allMonths.length === 0) {
      this.qTotalIncome.textContent = '0 ₫';
      this.qTotalExpense.textContent = '0 ₫';
      this.qTotalSavings.textContent = '0 ₫';
      this.qTotalFreeMoney.textContent = '0 ₫';
      return;
    }

    // Filter months according to queryRange
    let filteredMonths = allMonths;

    if (this.queryRange === 'year_2026') {
      filteredMonths = allMonths.filter(m => m.year === 2026);
      this.queryResultRangeBadge.textContent = `Năm 2026 (${filteredMonths.length} kì)`;
    } else if (this.queryRange === 'custom') {
      const start = this.queryStartMonth.value;
      const end = this.queryEndMonth.value;
      filteredMonths = allMonths.filter(m => {
        const key = `${m.year}-${String(m.month).padStart(2, '0')}`;
        return (!start || key >= start) && (!end || key <= end);
      });
      this.queryResultRangeBadge.textContent = `Tùy chọn (${filteredMonths.length} kì)`;
    } else {
      this.queryResultRangeBadge.textContent = `Toàn bộ (${filteredMonths.length} kì)`;
    }

    this.queryMonthsCount.textContent = `${filteredMonths.length} kì`;

    // Aggregates
    let totalIncome = 0;
    let totalStudy = 0;
    let totalParents = 0;
    let totalSaving = 0;
    let totalInvestment = 0;
    let totalEssential = 0;
    let totalFree = 0;

    filteredMonths.forEach(m => {
      totalIncome += FinanceCalc.calcNetSalary(m.salary, m.tax, m.bonus);
      totalStudy += FinanceCalc.toNumber(m.study);
      totalParents += FinanceCalc.toNumber(m.parents);
      totalSaving += FinanceCalc.toNumber(m.saving);
      totalInvestment += FinanceCalc.toNumber(m.investment);
      totalEssential += FinanceCalc.toNumber(m.essentialTotal);
      totalFree += FinanceCalc.toNumber(m.freeMoney);
    });

    const totalSpending = totalStudy + totalParents + totalEssential + Math.max(0, totalFree);
    const count = Math.max(1, filteredMonths.length);
    const avgIncome = totalIncome / count;
    const avgExpense = totalSpending / count;
    const totalAccumulate = totalSaving + totalInvestment;
    const avgRate = totalIncome > 0 ? (totalAccumulate / totalIncome) * 100 : 0;

    this.queryAvgRateBadge.textContent = `Tích lũy TB: ${avgRate.toFixed(1)}%`;
    this.qTotalIncome.textContent = FinanceCalc.formatVND(totalIncome);
    this.qAvgMonthlyIncome.textContent = `TB: ${FinanceCalc.formatVNDCompact(avgIncome)}/tháng`;

    this.qTotalExpense.textContent = FinanceCalc.formatVND(totalSpending);
    this.qAvgMonthlyExpense.textContent = `TB: ${FinanceCalc.formatVNDCompact(avgExpense)}/tháng`;

    this.qTotalSavings.textContent = FinanceCalc.formatVND(totalAccumulate);
    this.qTotalInvested.textContent = `Đầu tư: ${FinanceCalc.formatVND(totalInvestment)}`;

    this.qTotalFreeMoney.textContent = FinanceCalc.formatVND(totalFree);
    const lastMonth = filteredMonths[0];
    this.qActualEndBalance.textContent = `Số dư cuối: ${FinanceCalc.formatVND(lastMonth ? lastMonth.actualBalance : 0)}`;

    // Breakdown Ranking
    const breakdown = [
      { name: 'Tiền tiêu còn lại', val: Math.max(0, totalFree), color: '#3b82f6' },
      { name: 'Gửi bố mẹ', val: totalParents, color: '#f97316' },
      { name: 'Học tập', val: totalStudy, color: '#a855f7' },
      { name: 'Nhu cầu thiết yếu', val: totalEssential, color: '#06b6d4' },
      { name: 'Tiết kiệm', val: totalSaving, color: '#10b981' },
      { name: 'Đầu tư', val: totalInvestment, color: '#f59e0b' }
    ].sort((a, b) => b.val - a.val);

    const maxVal = Math.max(1, ...breakdown.map(b => b.val));

    this.queryBreakdownList.innerHTML = breakdown.map(item => {
      const pctBar = ((item.val / maxVal) * 100).toFixed(0);
      const pctTotal = totalIncome > 0 ? ((item.val / totalIncome) * 100).toFixed(1) : 0;
      return `
        <div class="qb-row">
          <div class="qb-header">
            <span class="qb-name">${item.name} (${pctTotal}%)</span>
            <span class="qb-val">${FinanceCalc.formatVND(item.val)}</span>
          </div>
          <div class="qb-bar-track">
            <div class="qb-bar-fill" style="width: ${pctBar}%; background-color: ${item.color};"></div>
          </div>
        </div>
      `;
    }).join('');

    // Detailed Months Table
    this.queryMonthsTable.innerHTML = filteredMonths.map(m => {
      const net = FinanceCalc.calcNetSalary(m.salary, m.tax, m.bonus);
      const acc = FinanceCalc.toNumber(m.saving) + FinanceCalc.toNumber(m.investment);
      return `
        <div class="qm-row">
          <span class="qm-col-month">T${m.month}/${m.year}</span>
          <span class="qm-col-net">Thu: ${FinanceCalc.formatVNDCompact(net)}</span>
          <span class="qm-col-save">Tích lũy: ${FinanceCalc.formatVNDCompact(acc)}</span>
        </div>
      `;
    }).join('');
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
