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

    try {
      this.initElements();
      this.bindEvents();
      this.initSwipeGesture();
      this.initApp();
    } catch (err) {
      console.error('Lỗi khi khởi tạo AppController:', err);
    }
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

    // Funnel Elements (Dashboard)
    this.funnelMonthLabel = document.getElementById('funnelMonthLabel');
    this.funnelIncomeVal = document.getElementById('funnelIncomeVal');
    this.funnelIncomeSub = document.getElementById('funnelIncomeSub');
    this.funnelFixedVal = document.getElementById('funnelFixedVal');
    this.funnelFixedPct = document.getElementById('funnelFixedPct');
    this.funnelFixedSub = document.getElementById('funnelFixedSub');
    this.funnelSavingsVal = document.getElementById('funnelSavingsVal');
    this.funnelSavingsPct = document.getElementById('funnelSavingsPct');
    this.funnelSavingsSub = document.getElementById('funnelSavingsSub');
    this.funnelFreeVal = document.getElementById('funnelFreeVal');
    this.funnelFreePct = document.getElementById('funnelFreePct');
    this.funnelFreeSub = document.getElementById('funnelFreeSub');

    // Detail Table Elements (Dashboard)
    this.tableStatusBadge = document.getElementById('tableStatusBadge');
    this.tblNetSalary = document.getElementById('tblNetSalary');
    this.tblGrossSalary = document.getElementById('tblGrossSalary');
    this.tblBonus = document.getElementById('tblBonus');
    this.tblFixedTotal = document.getElementById('tblFixedTotal');
    this.tblFixedItemsList = document.getElementById('tblFixedItemsList');
    this.tblSavingsTotal = document.getElementById('tblSavingsTotal');
    this.tblSaving = document.getElementById('tblSaving');
    this.tblInvestment = document.getElementById('tblInvestment');
    this.tblFreeMoney = document.getElementById('tblFreeMoney');
    this.tblFreePct = document.getElementById('tblFreePct');
    this.tblActualBalance = document.getElementById('tblActualBalance');

    // Pie Chart
    this.pieMonthLabel = document.getElementById('pieMonthLabel');
    this.pieChartLegend = document.getElementById('pieChartLegend');

    // Monthly View Elements
    this.monthlyRecordsContainer = document.getElementById('monthlyRecordsContainer');
    this.btnOpenNewMonthModal = document.getElementById('btnOpenNewMonthModal');
    this.modalMonthly = document.getElementById('modalMonthly');
    this.formMonthly = document.getElementById('formMonthly');
    this.btnCloseModalMonthly = document.getElementById('btnCloseModalMonthly');
    this.btnCancelMonthly = document.getElementById('btnCancelMonthly');
    
    // Accordion in Monthly Modal
    this.accordionItems = document.querySelectorAll('#modalMonthly .accordion-item');
    this.accordionHeaders = document.querySelectorAll('#modalMonthly .accordion-header');
    this.accBadgeIncome = document.getElementById('accBadgeIncome');
    this.accBadgeFunds = document.getElementById('accBadgeFunds');
    this.accBadgeEssentials = document.getElementById('accBadgeEssentials');
    this.accBadgeFreeMoney = document.getElementById('accBadgeFreeMoney');

    // Dynamic Lists in Monthly Modal
    this.btnAddFundItemModal = document.getElementById('btnAddFundItemModal');
    this.modalFundsList = document.getElementById('modalFundsList');
    this.mFundTotal = document.getElementById('mFundTotal');

    this.btnAddEssentialItemModal = document.getElementById('btnAddEssentialItemModal');
    this.modalEssentialsList = document.getElementById('modalEssentialsList');
    this.mEssentialTotal = document.getElementById('mEssentialTotal');

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

    // Persistence & Backup
    this.btnExportJSON = document.getElementById('btnExportJSON');
    this.inputImportJSON = document.getElementById('inputImportJSON');
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
    
    // Accordion Toggle Handlers
    if (this.accordionHeaders) {
      this.accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const accItem = header.closest('.accordion-item');
          if (accItem) {
            accItem.classList.toggle('expanded');
            if (window.lucide) lucide.createIcons();
          }
        });
      });
    }

    if (this.btnAddFundItemModal) {
      this.btnAddFundItemModal.addEventListener('click', () => this.addFundItemRow());
    }

    if (this.btnAddEssentialItemModal) {
      this.btnAddEssentialItemModal.addEventListener('click', () => this.addEssentialItemRow());
    }

    // Formula Triggers on Salary & Bonus
    const formulaInputs = [this.mSalary, this.mTax, this.mBonus];
    formulaInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.recalculateMonthlyFormulas());
      }
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
    if (this.btnExportJSON) {
      this.btnExportJSON.addEventListener('click', () => {
        storage.exportJSON();
        this.showToast('Đã xuất file sao lưu JSON thành công!');
      });
    }

    if (this.inputImportJSON) {
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

  // ================= VIEW: DASHBOARD (ĐƠN GIẢN: PHỄU TIỀN RA + BẢNG SỐ LIỆU + PIE CHART) =================
  renderDashboard() {
    const months = storage.getMonths();
    if (months.length === 0) {
      if (this.funnelIncomeVal) this.funnelIncomeVal.textContent = '0 ₫';
      if (this.funnelFixedVal) this.funnelFixedVal.textContent = '0 ₫';
      if (this.funnelSavingsVal) this.funnelSavingsVal.textContent = '0 ₫';
      if (this.funnelFreeVal) this.funnelFreeVal.textContent = '0 ₫';
      if (this.tblNetSalary) this.tblNetSalary.textContent = '0 ₫';
      return;
    }

    let displayRecord = null;
    let isAggregated = false;

    if (this.dashboardMode === 'all') {
      isAggregated = true;
      let totalSalary = 0, totalTax = 0, totalBonus = 0, totalNet = 0;
      let totalStudy = 0, totalParents = 0, totalSaving = 0, totalInvestment = 0;
      let totalEssential = 0, totalFree = 0, totalFunds = 0;
      const combinedFunds = [];
      const combinedEssentials = [];

      months.forEach(m => {
        totalSalary += FinanceCalc.toNumber(m.salary);
        totalTax += FinanceCalc.toNumber(m.tax);
        totalBonus += FinanceCalc.toNumber(m.bonus);
        totalNet += FinanceCalc.calcNetSalary(m.salary, m.tax, m.bonus);

        if (m.fundsList && m.fundsList.length > 0) {
          m.fundsList.forEach(f => {
            const exist = combinedFunds.find(cf => cf.name.toLowerCase() === f.name.toLowerCase());
            if (exist) {
              exist.amount += FinanceCalc.toNumber(f.amount);
            } else {
              combinedFunds.push({ name: f.name, amount: FinanceCalc.toNumber(f.amount) });
            }
            totalFunds += FinanceCalc.toNumber(f.amount);
          });
        } else {
          totalStudy += FinanceCalc.toNumber(m.study);
          totalParents += FinanceCalc.toNumber(m.parents);
          totalFunds += FinanceCalc.toNumber(m.study) + FinanceCalc.toNumber(m.parents);
        }

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

      if (combinedFunds.length === 0) {
        if (totalStudy > 0) combinedFunds.push({ name: 'Học tập', amount: totalStudy });
        if (totalParents > 0) combinedFunds.push({ name: 'Gửi bố mẹ', amount: totalParents });
      }

      displayRecord = {
        month: 'Tất cả',
        year: `${months.length} kì`,
        salary: totalSalary,
        bonus: totalBonus,
        netSalary: totalNet,
        study: totalStudy,
        parents: totalParents,
        fundsList: combinedFunds,
        calculatedFunds: totalFunds,
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
      displayRecord = months[0];
    }

    // 1. Countdown to Day 28
    this.updatePaydayCountdown(displayRecord);

    const netSalary = FinanceCalc.toNumber(displayRecord.netSalary);
    const salary = FinanceCalc.toNumber(displayRecord.salary);
    const bonus = FinanceCalc.toNumber(displayRecord.bonus);

    // Dynamic funds
    let fundsList = [];
    if (displayRecord.fundsList && displayRecord.fundsList.length > 0) {
      fundsList = displayRecord.fundsList;
    } else {
      if (displayRecord.study) fundsList.push({ name: 'Học tập', amount: FinanceCalc.toNumber(displayRecord.study) });
      if (displayRecord.parents) fundsList.push({ name: 'Gửi bố mẹ', amount: FinanceCalc.toNumber(displayRecord.parents) });
    }
    const fundsTotal = fundsList.reduce((sum, f) => sum + FinanceCalc.toNumber(f.amount), 0);
    const essentialTotal = FinanceCalc.toNumber(displayRecord.essentialTotal);
    const fixedTotal = fundsTotal + essentialTotal;

    const saving = FinanceCalc.toNumber(displayRecord.saving);
    const investment = FinanceCalc.toNumber(displayRecord.investment);
    const savingsTotal = saving + investment;
    const freeMoney = FinanceCalc.toNumber(displayRecord.freeMoney);

    const pctFixed = netSalary > 0 ? ((fixedTotal / netSalary) * 100).toFixed(1) : '0';
    const pctSavings = netSalary > 0 ? ((savingsTotal / netSalary) * 100).toFixed(1) : '0';
    const pctFree = netSalary > 0 ? ((freeMoney / netSalary) * 100).toFixed(1) : '0';

    const monthLabel = isAggregated ? `Tổng ${months.length} kì` : `T${displayRecord.month}/${displayRecord.year}`;

    // 2. Render Funnel (Phễu Dòng Tiền Ra)
    if (this.funnelMonthLabel) this.funnelMonthLabel.textContent = monthLabel;
    if (this.funnelIncomeVal) this.funnelIncomeVal.textContent = FinanceCalc.formatVND(netSalary);
    if (this.funnelIncomeSub) {
      this.funnelIncomeSub.textContent = `Lương: ${FinanceCalc.formatVNDCompact(salary)} | Thưởng: ${FinanceCalc.formatVNDCompact(bonus)}`;
    }

    if (this.funnelFixedVal) this.funnelFixedVal.textContent = `- ${FinanceCalc.formatVND(fixedTotal)}`;
    if (this.funnelFixedPct) this.funnelFixedPct.textContent = `${pctFixed}%`;
    if (this.funnelFixedSub) this.funnelFixedSub.textContent = `Học tập, Bố mẹ & Thiết yếu`;

    if (this.funnelSavingsVal) this.funnelSavingsVal.textContent = `- ${FinanceCalc.formatVND(savingsTotal)}`;
    if (this.funnelSavingsPct) this.funnelSavingsPct.textContent = `${pctSavings}%`;
    if (this.funnelSavingsSub) this.funnelSavingsSub.textContent = `Tiết kiệm & Đầu tư`;

    if (this.funnelFreeVal) this.funnelFreeVal.textContent = FinanceCalc.formatVND(freeMoney);
    if (this.funnelFreePct) this.funnelFreePct.textContent = `${pctFree}%`;
    if (this.funnelFreeSub) this.funnelFreeSub.textContent = `Sinh hoạt cá nhân khả dụng`;

    // 3. Render Detail Table (Bảng Số Liệu Chi Tiết)
    if (this.tblNetSalary) this.tblNetSalary.textContent = FinanceCalc.formatVND(netSalary);
    if (this.tblGrossSalary) this.tblGrossSalary.textContent = FinanceCalc.formatVND(salary);
    if (this.tblBonus) this.tblBonus.textContent = FinanceCalc.formatVND(bonus);

    if (this.tblFixedTotal) this.tblFixedTotal.textContent = FinanceCalc.formatVND(fixedTotal);
    if (this.tblFixedItemsList) {
      let fixedHtml = '';
      fundsList.forEach(f => {
        fixedHtml += `
          <div class="detail-subrow">
            <span>• ${this.escapeHTML(f.name)}</span>
            <span class="subrow-val">${FinanceCalc.formatVND(f.amount)}</span>
          </div>
        `;
      });
      // Essentials total
      fixedHtml += `
        <div class="detail-subrow">
          <span>• Nhu cầu thiết yếu (${(displayRecord.essentialsList || []).length} mục)</span>
          <span class="subrow-val">${FinanceCalc.formatVND(essentialTotal)}</span>
        </div>
      `;
      // Detailed essentials breakdown
      const essentials = displayRecord.essentialsList || [];
      if (essentials.length > 0) {
        essentials.forEach(item => {
          fixedHtml += `
            <div class="detail-subrow" style="opacity: 0.72; font-size: 11px;">
              <span style="padding-left: 24px;">↳ ${this.escapeHTML(item.name)}</span>
              <span class="subrow-val">${FinanceCalc.formatVND(item.amount)}</span>
            </div>
          `;
        });
      }
      this.tblFixedItemsList.innerHTML = fixedHtml;
    }

    if (this.tblSavingsTotal) this.tblSavingsTotal.textContent = FinanceCalc.formatVND(savingsTotal);
    if (this.tblSaving) this.tblSaving.textContent = FinanceCalc.formatVND(saving);
    if (this.tblInvestment) this.tblInvestment.textContent = FinanceCalc.formatVND(investment);

    if (this.tblFreeMoney) this.tblFreeMoney.textContent = FinanceCalc.formatVND(freeMoney);
    if (this.tblFreePct) this.tblFreePct.textContent = `${pctFree}% trên thu nhập`;
    if (this.tblActualBalance) this.tblActualBalance.textContent = FinanceCalc.formatVND(displayRecord.actualBalance || 0);

    // 4. Render Pie Chart (Phân Bổ Chi Phí)
    if (this.pieMonthLabel) this.pieMonthLabel.textContent = monthLabel;
    FinanceCharts.renderExpensePieChart('expensePieChart', displayRecord);
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

    // Mặc định thu gọn tất cả các mục
    if (this.accordionItems) {
      this.accordionItems.forEach(item => item.classList.remove('expanded'));
    }

    const months = storage.getMonths();
    const defaultFunds = [
      { name: 'Học tập', amount: 3000000 },
      { name: 'Tiền gửi bố mẹ', amount: 3500000 },
      { name: 'Tiền Tiết kiệm', amount: 2000000 },
      { name: 'Tiền đầu tư', amount: 0 }
    ];
    const defaultEssentials = [
      { name: 'ChatGPT', amount: 340000 },
      { name: 'cut toc', amount: 100000 },
      { name: 'old spice', amount: 50000 },
      { name: 'mạng', amount: 90000 },
      { name: 'BCS', amount: 300000 }
    ];

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
      this.mExpectedBalance.value = latest.actualBalance || 5000000;
      this.mActualBalance.value = latest.actualBalance || 5000000;

      const fundsToUse = latest.fundsList && latest.fundsList.length > 0 ? latest.fundsList : defaultFunds;
      this.renderModalFundsRows(fundsToUse);
      this.renderModalEssentialsRows(latest.essentialsList || defaultEssentials);
    } else {
      this.mYear.value = 2026;
      this.mMonth.value = 9;
      this.mCompany.value = 'MB - IT Risk - CV lv1';
      this.mType.value = 'Thử việc';
      this.mSalary.value = 13351500;
      this.renderModalFundsRows(defaultFunds);
      this.renderModalEssentialsRows(defaultEssentials);
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
    this.mExpectedBalance.value = record.expectedBalance || 0;
    this.mActualBalance.value = record.actualBalance || 0;

    // Mặc định thu gọn tất cả các mục
    if (this.accordionItems) {
      this.accordionItems.forEach(item => item.classList.remove('expanded'));
    }

    let funds = record.fundsList;
    if (!funds || funds.length === 0) {
      funds = [
        { name: 'Học tập', amount: record.study || 0 },
        { name: 'Tiền gửi bố mẹ', amount: record.parents || 0 },
        { name: 'Tiền Tiết kiệm', amount: record.saving || 0 },
        { name: 'Tiền đầu tư', amount: record.investment || 0 }
      ];
    }
    this.renderModalFundsRows(funds);
    this.renderModalEssentialsRows(record.essentialsList || []);
    this.recalculateMonthlyFormulas();
    this.openModal(this.modalMonthly);
  }

  renderModalFundsRows(items = []) {
    if (!this.modalFundsList) return;
    this.modalFundsList.innerHTML = '';
    items.forEach(item => {
      this.addFundItemRow(item.name, item.amount);
    });
    this.recalculateMonthlyFormulas();
  }

  addFundItemRow(name = '', amount = 0) {
    if (!this.modalFundsList) return;
    const row = document.createElement('div');
    row.className = 'dynamic-item-card';
    row.innerHTML = `
      <input type="text" class="form-input item-name" placeholder="Tên quỹ (Ví dụ: Tiền tiết kiệm)" value="${this.escapeHTML(name)}">
      <input type="number" class="form-input item-amount formula-trigger" placeholder="Số tiền" value="${amount !== 0 ? amount : ''}">
      <button type="button" class="btn-remove-item" title="Xóa quỹ"><i data-lucide="trash-2"></i></button>
    `;

    const amountInput = row.querySelector('.item-amount');
    const nameInput = row.querySelector('.item-name');
    amountInput.addEventListener('input', () => this.recalculateMonthlyFormulas());
    nameInput.addEventListener('input', () => this.recalculateMonthlyFormulas());

    const removeBtn = row.querySelector('.btn-remove-item');
    removeBtn.addEventListener('click', () => {
      row.remove();
      this.recalculateMonthlyFormulas();
    });

    this.modalFundsList.appendChild(row);
    if (window.lucide) lucide.createIcons();
    this.recalculateMonthlyFormulas();
  }

  renderModalEssentialsRows(items = []) {
    if (!this.modalEssentialsList) return;
    this.modalEssentialsList.innerHTML = '';
    items.forEach(item => {
      this.addEssentialItemRow(item.name, item.amount);
    });
    this.recalculateMonthlyFormulas();
  }

  addEssentialItemRow(name = '', amount = 0) {
    if (!this.modalEssentialsList) return;
    const row = document.createElement('div');
    row.className = 'dynamic-item-card';
    row.innerHTML = `
      <input type="text" class="form-input item-name" placeholder="Tên mục (Ví dụ: Tiền mạng)" value="${this.escapeHTML(name)}">
      <input type="number" class="form-input item-amount formula-trigger" placeholder="Số tiền" value="${amount !== 0 ? amount : ''}">
      <button type="button" class="btn-remove-item" title="Xóa mục"><i data-lucide="trash-2"></i></button>
    `;

    const amountInput = row.querySelector('.item-amount');
    const nameInput = row.querySelector('.item-name');
    amountInput.addEventListener('input', () => this.recalculateMonthlyFormulas());
    nameInput.addEventListener('input', () => this.recalculateMonthlyFormulas());

    const removeBtn = row.querySelector('.btn-remove-item');
    removeBtn.addEventListener('click', () => {
      row.remove();
      this.recalculateMonthlyFormulas();
    });

    this.modalEssentialsList.appendChild(row);
    if (window.lucide) lucide.createIcons();
    this.recalculateMonthlyFormulas();
  }

  recalculateMonthlyFormulas() {
    // 1. Thực nhận
    const netSalary = FinanceCalc.calcNetSalary(
      this.mSalary ? this.mSalary.value : 0,
      this.mTax ? this.mTax.value : 0,
      this.mBonus ? this.mBonus.value : 0
    );
    if (this.mNetSalary) this.mNetSalary.value = netSalary;

    // 2. Tổng Phân Bổ Quỹ (tính tổng từ các dòng quỹ động xếp dọc)
    let fundSum = 0;
    if (this.modalFundsList) {
      const fundAmounts = this.modalFundsList.querySelectorAll('.item-amount');
      fundAmounts.forEach(input => {
        fundSum += FinanceCalc.toNumber(input.value);
      });
    }
    if (this.mFundTotal) this.mFundTotal.value = fundSum;

    // 3. Tổng Nhu Cầu Thiết Yếu (tính tổng từ các dòng thiết yếu động xếp dọc)
    let essentialSum = 0;
    if (this.modalEssentialsList) {
      const essentialAmounts = this.modalEssentialsList.querySelectorAll('.item-amount');
      essentialAmounts.forEach(input => {
        essentialSum += FinanceCalc.toNumber(input.value);
      });
    }
    if (this.mEssentialTotal) this.mEssentialTotal.value = essentialSum;

    // 4. Tiền Tiêu Còn Lại = Thực nhận - (Tổng quỹ + Tổng thiết yếu)
    const freeMoney = netSalary - (fundSum + essentialSum);
    if (this.mFreeMoney) this.mFreeMoney.value = freeMoney;

    // 5. Cập nhật Badge tóm tắt trên từng Header Accordion khi thu gọn
    if (this.accBadgeIncome) this.accBadgeIncome.textContent = FinanceCalc.formatVNDCompact(netSalary);
    if (this.accBadgeFunds) this.accBadgeFunds.textContent = FinanceCalc.formatVNDCompact(fundSum);
    if (this.accBadgeEssentials) this.accBadgeEssentials.textContent = FinanceCalc.formatVNDCompact(essentialSum);
    if (this.accBadgeFreeMoney) this.accBadgeFreeMoney.textContent = FinanceCalc.formatVNDCompact(freeMoney);
  }

  handleSaveMonth() {
    // Collect funds
    const fundsList = [];
    let fundTotal = 0;
    let study = 0;
    let parents = 0;
    let saving = 0;
    let investment = 0;

    if (this.modalFundsList) {
      const fundRows = this.modalFundsList.querySelectorAll('.dynamic-item-card');
      fundRows.forEach(row => {
        const name = row.querySelector('.item-name').value.trim();
        const amount = FinanceCalc.toNumber(row.querySelector('.item-amount').value);
        if (name) {
          fundsList.push({ name, amount });
          fundTotal += amount;
          const lower = name.toLowerCase();
          if (lower.includes('học')) study += amount;
          else if (lower.includes('bố') || lower.includes('mẹ') || lower.includes('ba')) parents += amount;
          else if (lower.includes('tiết kiệm')) saving += amount;
          else if (lower.includes('đầu tư')) investment += amount;
        }
      });
    }

    // Collect essentials
    const essentialsList = [];
    let essentialTotal = 0;
    if (this.modalEssentialsList) {
      const essRows = this.modalEssentialsList.querySelectorAll('.dynamic-item-card');
      essRows.forEach(row => {
        const name = row.querySelector('.item-name').value.trim();
        const amount = FinanceCalc.toNumber(row.querySelector('.item-amount').value);
        if (name) {
          essentialsList.push({ name, amount });
          essentialTotal += amount;
        }
      });
    }

    const netSalary = FinanceCalc.calcNetSalary(this.mSalary.value, this.mTax.value, this.mBonus.value);
    const freeMoney = netSalary - (fundTotal + essentialTotal);

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
      fundsList: fundsList,
      fundTotal: fundTotal,
      study: study,
      parents: parents,
      saving: saving,
      investment: investment,
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

// Instantiate global app safely when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
  });
} else {
  window.app = new AppController();
}
