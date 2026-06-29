<template>
  <div class="chart-wrapper">
    <div v-if="!chartData || chartData.labels.length === 0" class="chart-empty">
      <div class="empty-illustration">
        <svg viewBox="0 0 120 120" class="empty-pie">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" stroke-width="12"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue-light)" stroke-width="12" 
                  stroke-dasharray="78.5 235.5" stroke-dashoffset="0" stroke-linecap="round"
                  class="empty-pie-segment"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue-very-light)" stroke-width="12" 
                  stroke-dasharray="52.3 261.7" stroke-dashoffset="-78.5" stroke-linecap="round"
                  class="empty-pie-segment"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue-medium)" stroke-width="12" 
                  stroke-dasharray="26.1 287.9" stroke-dashoffset="-130.8" stroke-linecap="round"
                  class="empty-pie-segment"/>
        </svg>
      </div>
      <p class="empty-title">Sin datos de gastos</p>
      <p class="empty-desc">Registra transacciones para visualizar tu distribución</p>
    </div>

    <template v-else>
      <div class="chart-container" ref="chartContainer">
        <Pie :data="chartData" :options="options" />
        <div class="chart-center-label" v-if="totalAmount > 0">
          <span class="center-total">${{ totalAmount.toLocaleString() }}</span>
          <span class="center-label">Total</span>
        </div>
      </div>
      <div class="chart-legend">
        <div 
          v-for="(label, i) in chartData.labels" 
          :key="label" 
          class="legend-item"
          :class="{ active: activeIndex === i }"
          @mouseenter="activeIndex = i"
          @mouseleave="activeIndex = null"
        >
          <span class="legend-dot" :style="{ background: chartData.datasets[0].backgroundColor[i] }"></span>
          <div class="legend-info">
            <span class="legend-label">{{ label }}</span>
            <span class="legend-percent">{{ getPercentage(i) }}%</span>
          </div>
          <span class="legend-value">${{ chartData.datasets[0].data[i].toLocaleString() }}</span>
          <div class="legend-bar" :style="{ width: getPercentage(i) + '%', background: chartData.datasets[0].backgroundColor[i] }"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: { type: Object, required: true }
});

const activeIndex = ref(null);
const chartContainer = ref(null);

const colors = [
  '#0064B2', '#2B7BBB', '#5692C2', '#81A9C9',
  '#ACC0D0', '#D7D7D7', '#475569', '#94A3B8'
];

const chartData = computed(() => {
  const labels = Object.keys(props.data);
  const values = Object.values(props.data);
  if (labels.length === 0) return null;

  return {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors.slice(0, labels.length),
      borderWidth: 3,
      borderColor: '#FFFFFF',
      hoverOffset: 14,
      hoverBorderWidth: 0
    }]
  };
});

const totalAmount = computed(() => {
  if (!chartData.value) return 0;
  return chartData.value.datasets[0].data.reduce((a, b) => a + b, 0);
});

const getPercentage = (index) => {
  if (!chartData.value) return 0;
  const total = chartData.value.datasets[0].data.reduce((a, b) => a + b, 0);
  return ((chartData.value.datasets[0].data[index] / total) * 100).toFixed(1);
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeOutQuart'
  },
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
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.raw / total) * 100).toFixed(1);
          return ` $${context.raw.toLocaleString()} (${percentage}%)`;
        }
      }
    }
  },
  onHover: (event, elements) => {
    if (elements.length > 0) {
      activeIndex.value = elements[0].index;
    } else {
      activeIndex.value = null;
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.chart-container {
  height: 220px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  z-index: 1;
}

.center-total {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  font-family: var(--font-mono);
  letter-spacing: -0.02em;
}

.center-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.85rem;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.legend-item:hover,
.legend-item.active {
  background: var(--bg-tertiary);
  transform: translateX(4px);
}

.legend-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: background var(--transition-fast);
  border-radius: 0 var(--radius-full) var(--radius-full) 0;
}

.legend-item.active::after {
  background: var(--blue);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.legend-item:hover .legend-dot,
.legend-item.active .legend-dot {
  transform: scale(1.2);
}

.legend-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1px;
}

.legend-label {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.85rem;
}

.legend-percent {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-mono);
}

.legend-value {
  color: var(--text-primary);
  font-weight: 700;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  min-width: 60px;
  text-align: right;
}

.legend-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: var(--radius-full);
  opacity: 0.3;
  transition: opacity var(--transition-fast), width 0.5s ease;
}

.legend-item:hover .legend-bar,
.legend-item.active .legend-bar {
  opacity: 0.6;
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
}

.empty-illustration {
  width: 120px;
  height: 120px;
  position: relative;
}

.empty-pie {
  width: 100%;
  height: 100%;
  animation: float 3s ease-in-out infinite;
}

.empty-pie-segment {
  animation: piePulse 2s ease-in-out infinite;
}

.empty-pie-segment:nth-child(2) { animation-delay: 0.2s; }
.empty-pie-segment:nth-child(3) { animation-delay: 0.4s; }
.empty-pie-segment:nth-child(4) { animation-delay: 0.6s; }

.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  max-width: 240px;
}

@keyframes piePulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@media (max-width: 640px) {
  .chart-container {
    height: 180px;
  }
  .legend-value {
    font-size: 0.8rem;
  }
}
</style>
