<<template>
  <div class="chart-wrapper">
    <div class="chart-container">
      <Pie v-if="chartData" :data="chartData" :options="options" />
    </div>
    <div v-if="chartData" class="chart-legend">
      <div v-for="(label, i) in chartData.labels" :key="label" class="legend-item">
        <span class="legend-dot" :style="{ background: chartData.datasets[0].backgroundColor[i] }"></span>
        <span class="legend-label">{{ label }}</span>
        <span class="legend-value">${{ chartData.datasets[0].data[i].toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: { type: Object, required: true }
});

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
      borderWidth: 2,
      borderColor: '#FFFFFF',
      hoverOffset: 10
    }]
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
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
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.raw / total) * 100).toFixed(1);
          return ` $${context.raw.toLocaleString()} (${percentage}%)`;
        }
      }
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
}

.chart-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.8rem;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.legend-item:hover {
  background: var(--bg-tertiary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.legend-label {
  color: var(--text-secondary);
  flex: 1;
}

.legend-value {
  color: var(--text-primary);
  font-weight: 600;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
</style>