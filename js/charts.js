/**
 * MMS - Chart.js Visualizations
 * Pie/Doughnut Chart for Spending Breakdown
 * Line Chart for Savings & Spending History
 * Doughnut Chart for Portfolio Allocation
 */

const FinanceCharts = {
  pieChartInstance: null,
  lineChartInstance: null,
  portfolioChartInstance: null,

  // Render Spending Breakdown Pie Chart
  renderExpensePieChart(canvasId, monthRecord) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }

    if (!monthRecord) {
      return;
    }

    const labels = ['Học tập', 'Gửi bố mẹ', 'Nhu cầu thiết yếu', 'Tiền tiêu', 'Tiết kiệm', 'Đầu tư'];
    const dataValues = [
      Number(monthRecord.study || 0),
      Number(monthRecord.parents || 0),
      Number(monthRecord.essentialTotal || 0),
      Math.max(0, Number(monthRecord.freeMoney || 0)),
      Number(monthRecord.saving || 0),
      Number(monthRecord.investment || 0)
    ];

    const backgroundColors = [
      '#a855f7', // Học tập - tím
      '#f97316', // Bố mẹ - cam
      '#06b6d4', // Thiết yếu - cyan
      '#3b82f6', // Tiền tiêu - blue
      '#10b981', // Tiết kiệm - emerald
      '#f59e0b'  // Đầu tư - amber
    ];

    this.pieChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: '#111726',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            display: false // We use our own custom HTML legend below
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const val = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${label}: ${FinanceCalc.formatVND(val)} (${percent}%)`;
              }
            }
          }
        }
      }
    });

    // Populate Custom HTML Legend
    const legendEl = document.getElementById('pieChartLegend');
    if (legendEl) {
      const total = dataValues.reduce((a, b) => a + b, 0);
      legendEl.innerHTML = labels.map((label, idx) => {
        const val = dataValues[idx];
        const pct = total > 0 ? ((val / total) * 100).toFixed(0) : 0;
        return `
          <div class="legend-item">
            <span class="legend-dot" style="background-color: ${backgroundColors[idx]};"></span>
            <div class="legend-info">
              <span class="legend-label">${label} (${pct}%)</span>
              <span class="legend-val">${FinanceCalc.formatVNDCompact(val)}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  },

  // Render Savings & Spending Trends Line Chart
  renderHistoryLineChart(canvasId, monthlyRecords = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }

    if (!monthlyRecords || monthlyRecords.length === 0) return;

    // Sort chronologically for historical graph
    const sorted = [...monthlyRecords].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    const labels = sorted.map(m => `T${m.month}/${m.year}`);
    const netSalaryData = sorted.map(m => Number(m.netSalary || 0));
    const savingData = sorted.map(m => Number(m.saving || 0) + Number(m.investment || 0));
    const expenseData = sorted.map(m => {
      return Number(m.study || 0) + Number(m.parents || 0) + Number(m.essentialTotal || 0) + Math.max(0, Number(m.freeMoney || 0));
    });

    this.lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Thực nhận',
            data: netSalaryData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.35,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6'
          },
          {
            label: 'Tiết kiệm & Đầu tư',
            data: savingData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.35,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#10b981'
          },
          {
            label: 'Chi tiêu sinh hoạt',
            data: expenseData,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
            tension: 0.35,
            fill: false,
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 4,
            pointBackgroundColor: '#f43f5e'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.06)'
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 10 },
              callback: function(val) {
                return (val / 1000000).toFixed(0) + 'tr';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 11, weight: '600' }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              color: '#94a3b8',
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f1f5f9',
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${FinanceCalc.formatVND(context.raw)}`;
              }
            }
          }
        }
      }
    });
  },

  // Render Investment Portfolio Allocation Chart
  renderPortfolioChart(canvasId, baskets = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.portfolioChartInstance) {
      this.portfolioChartInstance.destroy();
      this.portfolioChartInstance = null;
    }

    const wrapper = canvas.parentElement;
    let emptyNotice = wrapper.querySelector('.portfolio-chart-empty');

    if (!baskets || baskets.length === 0) {
      canvas.style.display = 'none';
      if (!emptyNotice) {
        emptyNotice = document.createElement('div');
        emptyNotice.className = 'portfolio-chart-empty text-center text-muted py-4';
        emptyNotice.style.fontSize = '12.5px';
        emptyNotice.innerHTML = `
          <div style="font-size: 24px; margin-bottom: 6px;">📊</div>
          <div>Chưa có dữ liệu danh mục để vẽ biểu đồ tỷ trọng.</div>
          <div class="text-caption mt-1">Hãy bấm "Thêm Rỏ Mới" để bắt đầu khai báo.</div>
        `;
        wrapper.appendChild(emptyNotice);
      } else {
        emptyNotice.style.display = 'block';
      }
      return;
    }

    // Has baskets
    canvas.style.display = 'block';
    if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }

    const labels = baskets.map(b => b.name);
    const dataValues = baskets.map(b => Number(b.currentValue || 0));
    const colors = baskets.map(b => b.color || '#3b82f6');

    this.portfolioChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#111726'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              color: '#94a3b8',
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${FinanceCalc.formatVND(val)} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }
};

window.FinanceCharts = FinanceCharts;
