/* =============================================
   BREAK-EVEN ANALYSIS DASHBOARD — app.js
   Interactive logic with Chart.js
   ============================================= */

'use strict';

// ── DOM references ──────────────────────────────────────────
const sliderFC = document.getElementById('slider-fc');
const sliderVC = document.getElementById('slider-vc');
const sliderSP = document.getElementById('slider-sp');
const sliderUS = document.getElementById('slider-us');

const inputFC = document.getElementById('input-fc');
const inputVC = document.getElementById('input-vc');
const inputSP = document.getElementById('input-sp');
const inputUS = document.getElementById('input-us');

const kpiBEPUnits = document.getElementById('kpi-bep-units');
const kpiBEPRev   = document.getElementById('kpi-bep-rev');
const kpiPnL      = document.getElementById('kpi-pnl');
const kpiPnLIcon  = document.getElementById('kpi-pnl-icon');
const kpiPnLSub   = document.getElementById('kpi-pnl-sub');
const kpiCM       = document.getElementById('kpi-cm');

const statusBanner = document.getElementById('status-banner');
const statusIcon   = document.getElementById('status-icon');
const statusText   = document.getElementById('status-text');

const insightProfit = document.getElementById('insight-profit');
const insightLoss   = document.getElementById('insight-loss');
const mosUnits      = document.getElementById('mos-units');

// ── Custom BEP vertical line plugin (must be declared FIRST) ─
const bepLinePlugin = {
  id: 'bepLine',
  afterDraw(chart) {
    const bepX = chart.options.plugins.bepLine.bepX;
    if (bepX == null) return;

    const labels = chart.data.labels.map(Number);
    let nearestIdx = 0;
    let minDiff = Infinity;
    labels.forEach((v, i) => {
      const d = Math.abs(v - bepX);
      if (d < minDiff) { minDiff = d; nearestIdx = i; }
    });

    const meta = chart.getDatasetMeta(0);
    if (!meta.data[nearestIdx]) return;

    const x = meta.data[nearestIdx].x;
    const { top, bottom } = chart.chartArea;
    const c = chart.ctx;

    // Dashed vertical line
    c.save();
    c.setLineDash([6, 4]);
    c.lineWidth = 2;
    c.strokeStyle = 'rgba(34,211,238,0.7)';
    c.beginPath();
    c.moveTo(x, top);
    c.lineTo(x, bottom);
    c.stroke();

    // BEP dot on revenue line
    const revMeta = chart.getDatasetMeta(1);
    if (revMeta.data[nearestIdx]) {
      const y = revMeta.data[nearestIdx].y;
      c.setLineDash([]);
      c.beginPath();
      c.arc(x, y, 9, 0, Math.PI * 2);
      c.fillStyle = '#22d3ee';
      c.fill();
      c.strokeStyle = '#060b14';
      c.lineWidth = 2.5;
      c.stroke();

      // "BEP" label above line
      c.fillStyle = '#22d3ee';
      c.font = 'bold 12px Inter, sans-serif';
      c.textAlign = 'center';
      c.fillText('BEP', x, top + 16);
    }
    c.restore();
  },
};

// Register the plugin globally so Chart.js picks it up
Chart.register(bepLinePlugin);

// ── Chart state ──────────────────────────────────────────────
let bepChart = null;

// ── Utility ──────────────────────────────────────────────────
function formatINR(val) {
  if (!isFinite(val)) return '—';
  const abs = Math.abs(val);
  if (abs >= 1_00_00_000) return `₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000)    return `₹${(abs / 1_00_000).toFixed(2)} L`;
  return `₹${abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function animateKPI(el, text) {
  el.classList.remove('updating');
  void el.offsetWidth;
  el.textContent = text;
  el.classList.add('updating');
}

function updateSliderFill(slider) {
  const min = Number(slider.min);
  const max = Number(slider.max);
  const val = Number(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.setProperty('--pct', pct + '%');
}

// ── Chart init / update ──────────────────────────────────────
function initChart(labels, tcData, revData) {
  const canvasCtx = document.getElementById('bepChart').getContext('2d');

  const tcGrad = canvasCtx.createLinearGradient(0, 0, 0, 420);
  tcGrad.addColorStop(0, 'rgba(249,115,22,0.4)');
  tcGrad.addColorStop(1, 'rgba(249,115,22,0.02)');

  const revGrad = canvasCtx.createLinearGradient(0, 0, 0, 420);
  revGrad.addColorStop(0, 'rgba(34,211,238,0.4)');
  revGrad.addColorStop(1, 'rgba(34,211,238,0.02)');

  bepChart = new Chart(canvasCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Cost (₹)',
          data: tcData,
          borderColor: '#f97316',
          backgroundColor: tcGrad,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#f97316',
          tension: 0.1,
          fill: true,
        },
        {
          label: 'Total Revenue (₹)',
          data: revData,
          borderColor: '#22d3ee',
          backgroundColor: revGrad,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#22d3ee',
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeInOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13,21,38,0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 14,
          titleFont: { family: 'Inter', weight: '700', size: 13 },
          bodyFont:  { family: 'JetBrains Mono', size: 12 },
          titleColor: '#f1f5f9',
          bodyColor:  '#94a3b8',
          callbacks: {
            title: (items) => `Units: ${Number(items[0].label).toLocaleString('en-IN')}`,
            label: (item) => `  ${item.dataset.label}: ${formatINR(item.raw)}`,
          },
        },
        bepLine: { bepX: null },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            color: '#475569',
            font: { family: 'JetBrains Mono', size: 10 },
            maxTicksLimit: 8,
            callback: (val) => {
              const v = Number(bepChart.data.labels[val]);
              return v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v;
            },
          },
          title: {
            display: true,
            text: 'Units Sold →',
            color: '#475569',
            font: { family: 'Inter', size: 11, weight: '600' },
          },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            color: '#475569',
            font: { family: 'JetBrains Mono', size: 10 },
            maxTicksLimit: 7,
            callback: (val) => {
              if (val >= 1_00_00_000) return '₹' + (val / 1_00_00_000).toFixed(1) + 'Cr';
              if (val >= 1_00_000)   return '₹' + (val / 1_00_000).toFixed(1) + 'L';
              if (val >= 1000)       return '₹' + (val / 1000).toFixed(0) + 'K';
              return '₹' + val;
            },
          },
          title: {
            display: true,
            text: 'Amount (₹) →',
            color: '#475569',
            font: { family: 'Inter', size: 11, weight: '600' },
          },
          beginAtZero: true,
        },
      },
    },
  });
}

function generateChartData(FC, VC, SP, bepUnits) {
  const sliderMax = Number(sliderUS.max);
  const xMax = bepUnits != null
    ? Math.max(Math.ceil(bepUnits * 2.2), sliderMax)
    : sliderMax * 1.5;

  const POINTS = 80;
  const labels = [], tcData = [], revData = [];
  for (let i = 0; i <= POINTS; i++) {
    const u = Math.round((i / POINTS) * xMax);
    labels.push(u);
    tcData.push(FC + VC * u);
    revData.push(SP * u);
  }
  return { labels, tcData, revData };
}

function updateChart(FC, VC, SP, US, bepUnits) {
  const { labels, tcData, revData } = generateChartData(FC, VC, SP, bepUnits);
  if (!bepChart) {
    initChart(labels, tcData, revData);
    bepChart.options.plugins.bepLine.bepX = bepUnits;
    bepChart.update();
  } else {
    bepChart.data.labels = labels;
    bepChart.data.datasets[0].data = tcData;
    bepChart.data.datasets[1].data = revData;
    bepChart.options.plugins.bepLine.bepX = bepUnits;
    bepChart.update();
  }
}

// ── Core calculation & render ────────────────────────────────
function calculate() {
  const FC = Number(sliderFC.value);
  const VC = Number(sliderVC.value);
  const SP = Number(sliderSP.value);
  const US = Number(sliderUS.value);
  const CM = SP - VC;

  let bepUnits = null, bepRev = null;
  if (CM > 0) {
    bepUnits = FC / CM;
    bepRev   = bepUnits * SP;
  }

  const totalRev  = US * SP;
  const totalCost = FC + US * VC;
  const pnl       = totalRev - totalCost;

  // KPIs
  animateKPI(kpiBEPUnits, bepUnits != null
    ? `${Math.ceil(bepUnits).toLocaleString('en-IN')} u` : '∞');
  animateKPI(kpiBEPRev, bepRev != null ? formatINR(bepRev) : '∞');
  animateKPI(kpiCM, CM >= 0 ? formatINR(CM) : `−${formatINR(-CM)}`);

  const pnlText = (pnl >= 0 ? '+' : '−') + formatINR(Math.abs(pnl));
  animateKPI(kpiPnL, pnlText);
  kpiPnL.style.color  = pnl > 0 ? 'var(--green)' : pnl < 0 ? 'var(--orange)' : 'var(--cyan)';
  kpiPnLIcon.textContent = pnl > 0 ? '📈' : pnl < 0 ? '📉' : '⚖️';
  kpiPnLSub.textContent  = pnl === 0 ? 'Exactly at break-even'
    : pnl > 0 ? 'Net profit at current units' : 'Net loss at current units';

  // Status banner
  statusBanner.className = 'status-banner';
  if (CM <= 0) {
    statusBanner.classList.add('loss');
    statusIcon.textContent = '⚠️';
    statusText.textContent = 'Selling price must exceed variable cost to break even!';
  } else if (pnl > 0) {
    statusBanner.classList.add('profit');
    statusIcon.textContent = '🎉';
    statusText.textContent = `Profitable! Break-even at ${Math.ceil(bepUnits).toLocaleString('en-IN')} units.`;
  } else if (pnl < 0) {
    statusBanner.classList.add('loss');
    statusIcon.textContent = '⚡';
    statusText.textContent = `Need ${Math.ceil(bepUnits - US).toLocaleString('en-IN')} more units to reach break-even.`;
  } else {
    statusBanner.classList.add('breakeven');
    statusIcon.textContent = '🎯';
    statusText.textContent = 'You are exactly at the break-even point!';
  }

  // Insights
  const mos = bepUnits != null ? Math.max(0, US - bepUnits) : 0;
  mosUnits.textContent = Math.round(mos).toLocaleString('en-IN')
    + (mos === 0 ? ' (not yet at BEP)' : ' units beyond BEP');

  insightProfit.innerHTML = bepUnits != null && US > bepUnits
    ? `You are <em>above</em> break-even by <strong>${Math.round(mos).toLocaleString('en-IN')} units</strong>. Each extra unit nets you <strong>${formatINR(CM)}</strong>.`
    : `You have <em>not yet</em> crossed the break-even point. Increase units sold or selling price.`;

  insightLoss.innerHTML = bepUnits != null
    ? `Total cost at BEP is <strong>${formatINR(bepRev)}</strong>. Fixed costs are <strong>${FC > 0 && bepRev > 0 ? Math.round((FC / bepRev) * 100) : 0}%</strong> of that.`
    : `Cannot break even — selling price (₹${SP}) ≤ variable cost (₹${VC}). Raise price or cut costs.`;

  // Chart
  updateChart(FC, VC, SP, US, bepUnits);
}

// ── Sync slider ↔ number input ───────────────────────────────
function syncSliderAndInput(slider, input) {
  slider.addEventListener('input', () => {
    input.value = slider.value;
    updateSliderFill(slider);
    calculate();
  });
  input.addEventListener('input', () => {
    let v = Number(input.value);
    v = Math.max(Number(slider.min), Math.min(Number(slider.max), v));
    slider.value = v;
    updateSliderFill(slider);
    calculate();
  });
  input.addEventListener('change', () => { input.value = slider.value; });
}

// ── Boot ─────────────────────────────────────────────────────
syncSliderAndInput(sliderFC, inputFC);
syncSliderAndInput(sliderVC, inputVC);
syncSliderAndInput(sliderSP, inputSP);
syncSliderAndInput(sliderUS, inputUS);

[sliderFC, sliderVC, sliderSP, sliderUS].forEach(updateSliderFill);

calculate();
