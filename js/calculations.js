/**
 * MMS - Financial Formulas & Formatters
 */

const FinanceCalc = {
  // Format VND currency with dots: 15.351.500 ₫
  formatVND(value) {
    if (value === null || value === undefined || isNaN(value)) return "0 ₫";
    return new Intl.NumberFormat('vi-VN').format(Math.round(value)) + " ₫";
  },

  // Format VND in millions/billions for compact badges
  formatVNDCompact(value) {
    if (value === null || value === undefined || isNaN(value)) return "0 ₫";
    const absVal = Math.abs(value);
    if (absVal >= 1000000000) {
      return (value / 1000000000).toFixed(2).replace(/\.00$/, '') + " tỷ";
    }
    if (absVal >= 1000000) {
      return (value / 1000000).toFixed(2).replace(/\.00$/, '') + " tr";
    }
    if (absVal >= 1000) {
      return (value / 1000).toFixed(0) + " k";
    }
    return this.formatVND(value);
  },

  // Format percentage with + or - sign
  formatPercent(value, showPlus = true) {
    if (value === null || value === undefined || isNaN(value)) return "0%";
    const sign = (showPlus && value > 0) ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  },

  // Parse raw text or number to safe float
  toNumber(val) {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleanStr = String(val).replace(/[^0-9.-]+/g, "");
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  },

  /**
   * CÔNG THỨC 1: Thực nhận (Net Salary)
   * Thực nhận = Lương Gross - Thuế & Các khoản khấu trừ + Thưởng & Khoản thêm
   */
  calcNetSalary(salary, tax, bonus) {
    const s = this.toNumber(salary);
    const t = this.toNumber(tax);
    const b = this.toNumber(bonus);
    return s - t + b;
  },

  /**
   * CÔNG THỨC 2: Tổng Nhu cầu thiết yếu
   * Tổng cộng danh mục chi tiết (ChatGPT, Cắt tóc, Mạng, BCS, ...)
   */
  calcEssentialTotal(items = []) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + this.toNumber(item.amount), 0);
  },

  /**
   * CÔNG THỨC 3: Tiền tiêu còn lại (Free Spending Money)
   * Tiền tiêu = Thực nhận - (Học + Gửi bố mẹ + Tiết kiệm + Đầu tư + Nhu cầu thiết yếu)
   */
  calcFreeMoney(netSalary, study, parents, saving, investment, essentialTotal) {
    const net = this.toNumber(netSalary);
    const st = this.toNumber(study);
    const pa = this.toNumber(parents);
    const sa = this.toNumber(saving);
    const inv = this.toNumber(investment);
    const ess = this.toNumber(essentialTotal);
    
    return net - (st + pa + sa + inv + ess);
  },

  /**
   * CÔNG THỨC 4: Tỷ lệ Tích lũy (Tiết kiệm & Đầu tư trên Thu nhập)
   * Rate = ((Tiết kiệm + Đầu tư) / Thực nhận) * 100%
   */
  calcSaveInvestRate(saving, investment, netSalary) {
    const totalAccumulate = this.toNumber(saving) + this.toNumber(investment);
    const net = this.toNumber(netSalary);
    if (net <= 0) return 0;
    return (totalAccumulate / net) * 100;
  },

  /**
   * CÔNG THỨC 5: Tổng phân bổ & chi phí sinh hoạt
   * Tổng chi = Học + Gửi bố mẹ + Thiết yếu + Tiền tiêu
   */
  calcTotalSpending(study, parents, essentialTotal, freeMoney) {
    return this.toNumber(study) + this.toNumber(parents) + this.toNumber(essentialTotal) + Math.max(0, this.toNumber(freeMoney));
  },

  /**
   * TÍNH TOÁN DANH MỤC ĐẦU TƯ
   */
  calcPortfolioMetrics(baskets = []) {
    let totalCapital = 0;
    let totalCurrentValue = 0;

    baskets.forEach(b => {
      totalCapital += this.toNumber(b.capital);
      totalCurrentValue += this.toNumber(b.currentValue);
    });

    const pnlAmount = totalCurrentValue - totalCapital;
    const pnlPercent = totalCapital > 0 ? (pnlAmount / totalCapital) * 100 : 0;

    return {
      totalCapital,
      totalCurrentValue,
      pnlAmount,
      pnlPercent
    };
  }
};

window.FinanceCalc = FinanceCalc;
