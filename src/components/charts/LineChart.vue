<<<<<<< HEAD
<template>
  <div class="chart-wrapper">
    <div v-if="!chartData || chartData.labels.length === 0" class="chart-empty">
      <div class="empty-line">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none">
          <path d="M0,50 Q50,45 100,30 T200,20" 
                fill="none" 
                stroke="var(--blue-light)" 
                stroke-width="2" 
                stroke-dasharray="8,4"
                class="empty-line-path"/>
          <circle cx="0" cy="50" r="3" fill="var(--blue-light)" class="empty-dot"/>
          <circle cx="100" cy="30" r="3" fill="var(--blue-light)" class="empty-dot" style="animation-delay: 0.3s"/>
          <circle cx="200" cy="20" r="3" fill="var(--blue-light)" class="empty-dot" style="animation-delay: 0.6s"/>
        </svg>
      </div>
      <p class="empty-title">Sin tendencias disponibles</p>
      <p class="empty-desc">El balance mensual se mostrará aquí</p>
    </div>

    <div v-else class="chart-container">
      <Line :data="chartData" :options="options" />
    </div>
=======
<<template>
  <div class="chart-container">
    <Line v-if="chartData" :data="chartData" :options="options" />
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps({
  data: { type: Array, required: true }
});

const chartData = computed(() => {
<<<<<<< HEAD
  if (props.data.length === 0) return null;

=======
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  return {
    labels: props.data.map(d => {
      const [year, month] = d.month.split('-');
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`;
    }),
    datasets: [{
      label: 'Balance Neto',
      data: props.data.map(d => d.balance),
      borderColor: '#2B7BBB',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
<<<<<<< HEAD
        gradient.addColorStop(0, 'rgba(43, 123, 187, 0.3)');
        gradient.addColorStop(0.5, 'rgba(43, 123, 187, 0.1)');
=======
        gradient.addColorStop(0, 'rgba(43, 123, 187, 0.25)');
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
        gradient.addColorStop(1, 'rgba(43, 123, 187, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.45,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#2B7BBB',
      pointBorderWidth: 2.5,
      pointRadius: 5,
<<<<<<< HEAD
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#2B7BBB',
      pointHoverBorderColor: '#FFFFFF',
      pointHoverBorderWidth: 3,
      borderWidth: 2.5,
      hoverOffset: 4
=======
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#2B7BBB',
      pointHoverBorderColor: '#FFFFFF',
      pointHoverBorderWidth: 3,
      borderWidth: 2.5
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
    }]
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
<<<<<<< HEAD
  animation: {
    duration: 1500,
    easing: 'easeOutQuart',
    delay: (context) => {
      let delay = 0;
      if (context.type === 'data' && context.mode === 'default') {
        delay = context.dataIndex * 100;
      }
      return delay;
    }
  },
=======
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#0F172A',
      bodyColor: '#475569',
      borderColor: 'rgba(43, 123, 187, 0.15)',
      borderWidth: 1,
      padding: 14,
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
<<<<<<< HEAD
        label: (context) => {
          const val = context.raw;
          const sign = val >= 0 ? '+' : '';
          return ` Balance: ${sign}$${val.toLocaleString()}`;
        }
=======
        label: (context) => ` Balance: $${context.raw.toLocaleString()}`
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
<<<<<<< HEAD
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
=======
      ticks: { color: '#94A3B8', font: { size: 11, family: 'Inter' } }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(43, 123, 187, 0.06)', drawBorder: false },
      ticks: { color: '#94A3B8', font: { size: 11, family: 'Inter' }, callback: (value) => `$${value}` }
    }
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  }
};
</script>

<style scoped>
<<<<<<< HEAD
.chart-wrapper {
  width: 100%;
  height: 100%;
}

=======
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
.chart-container {
  height: 280px;
  position: relative;
}
<<<<<<< HEAD

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

.empty-line {
  width: 200px;
  height: 60px;
}

.empty-line-path {
  animation: lineDash 2s ease-in-out infinite;
}

.empty-dot {
  animation: dotPulse 1.5s ease-in-out infinite;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

@keyframes lineDash {
  0%, 100% { stroke-dashoffset: 0; opacity: 0.4; }
  50% { stroke-dashoffset: -12; opacity: 0.8; }
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
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
=======
</style>
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
