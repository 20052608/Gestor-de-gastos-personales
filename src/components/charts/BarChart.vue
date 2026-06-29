<template>
  <div class="chart-wrapper">
    <div v-if="!chartData || chartData.labels.length === 0" class="chart-empty">
      <div class="empty-bars">
        <div class="empty-bar" style="height: 30%"></div>
        <div class="empty-bar" style="height: 60%"></div>
        <div class="empty-bar" style="height: 45%"></div>
        <div class="empty-bar" style="height: 80%"></div>
        <div class="empty-bar" style="height: 55%"></div>
        <div class="empty-bar" style="height: 40%"></div>
      </div>
      <p class="empty-title">Sin datos históricos</p>
      <p class="empty-desc">Los ingresos y gastos aparecerán aquí</p>
    </div>

    <div v-else class="chart-container">
      <Bar :data="chartData" :options="options" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({
  data: { type: Array, required: true }
});

const chartData = computed(() => {
  if (props.data.length === 0) return null;

  return {
    labels: props.data.map(d => {
      const [year, month] = d.month.split('-');
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`;
    }),
    datasets: [
      {
        label: 'Ingresos',
        data: props.data.map(d => d.income),
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, '#2B7BBB');
          gradient.addColorStop(1, '#5692C2');
          return gradient;
        },
        borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barThickness: 24,
        hoverBackgroundColor: '#0064B2',
        hoverBorderWidth: 0,
        hoverBorderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 }
      },
      {
        label: 'Gastos',
        data: props.data.map(d => d.expense),
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, '#ACC0D0');
          gradient.addColorStop(1, '#D7D7D7');
          return gradient;
        },
        borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        barThickness: 24,
        hoverBackgroundColor: '#81A9C9',
        hoverBorderWidth: 0,
        hoverBorderRadius: { topLeft: 12, topRight: 12, bottomLeft: 0, bottomRight: 0 }
      }
    ]
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
    delay: (context) => {
      let delay = 0;
      if (context.type === 'data' && context.mode === 'default') {
        delay = context.dataIndex * 100 + context.datasetIndex * 150;
      }
      return delay;
    }
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        pointRadius: 6,
        padding: 20,
        color: '#475569',
        font: { size: 12, family: 'Plus Jakarta Sans', weight: '600' }
      }
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#0F172A',
      bodyColor: '#475569',
      borderColor: 'rgba(43, 123, 187, 0.15)',
      borderWidth: 1,
      padding: 14,
      cornerRadius: 12,
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: (context) => ` ${context.dataset.label}: $${context.raw.toLocaleString()}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { 
        color: '#94A3B8', 
        font: { size: 11, family: 'Plus Jakarta Sans', weight: '500' },
        padding: 8
      },
      border: { display: false }
    },
    y: {
      beginAtZero: true,
      grid: { 
        color: 'rgba(43, 123, 187, 0.06)', 
        drawBorder: false,
        lineWidth: 1
      },
      ticks: { 
        color: '#94A3B8', 
        font: { size: 11, family: 'Plus Jakarta Sans' }, 
        callback: (value) => `$${value}`,
        padding: 8
      },
      border: { display: false }
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  }
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
}

.chart-container {
  height: 280px;
  position: relative;
}

/* Empty State */
.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-10) var(--space-6);
  gap: var(--space-4);
  text-align: center;
  height: 280px;
}

.empty-bars {
  display: flex;
  align-items: flex-end;
  gap: var(--space-3);
  height: 80px;
  padding: 0 var(--space-4);
}

.empty-bar {
  width: 24px;
  background: linear-gradient(180deg, var(--blue-very-light), var(--bg-tertiary));
  border-radius: 6px 6px 0 0;
  animation: barPulse 1.5s ease-in-out infinite;
  opacity: 0.4;
}

.empty-bar:nth-child(1) { animation-delay: 0s; }
.empty-bar:nth-child(2) { animation-delay: 0.2s; }
.empty-bar:nth-child(3) { animation-delay: 0.4s; }
.empty-bar:nth-child(4) { animation-delay: 0.6s; }
.empty-bar:nth-child(5) { animation-delay: 0.8s; }
.empty-bar:nth-child(6) { animation-delay: 1s; }

.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

@keyframes barPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 0.6; transform: scaleY(1.05); }
}

@media (max-width: 640px) {
  .chart-container {
    height: 220px;
  }
  .chart-empty {
    height: 220px;
  }
}
</style>
