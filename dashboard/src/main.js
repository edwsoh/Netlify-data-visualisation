import './style.css';
import { loadData, calculateMetrics } from './data/dataLoader.js';
import { createScatterPlot } from './components/ScatterPlot.js';
import { createBarChart } from './components/BarChart.js';
import { createHistogram } from './components/Histogram.js';

async function init() {
  const loading = document.getElementById('loading');

  try {
    const data = await loadData();

    // KPI Updates
    const metrics = calculateMetrics(data);
    document.getElementById('kpi-count').textContent = metrics.total.toLocaleString();
    document.getElementById('kpi-avg').textContent = `$${Math.round(metrics.avgCharge).toLocaleString()}`;
    document.getElementById('kpi-smoker').textContent = `+$${Math.round(metrics.smokerDifference).toLocaleString()}`;

    // Render Charts
    renderCharts(data);

    // Resize Handler (Debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderCharts(data);
      }, 300);
    });

    // Hide Loading
    loading.style.opacity = '0';
    setTimeout(() => loading.remove(), 500);

  } catch (err) {
    loading.innerHTML = `<p style="color:red">Error loading data: ${err.message}</p>`;
    console.error(err);
  }
}

function renderCharts(data) {
  createScatterPlot('scatter-container', data);
  createBarChart('bar-container', data);
  createHistogram('hist-container', data);
}

init();
