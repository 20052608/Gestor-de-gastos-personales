<<template>
  <div class="chart-container">
    <Line v-if="chartData" :data="chartData" :options="options" />
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
        gradient.addColorStop(0, 'rgba(43, 123, 187, 0.25)');
        gradient.addColorStop(1, 'rgba(43, 123, 187, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.45,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#2B7BBB',
      pointBorderWidth: 2.5,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#2B7BBB',
      pointHoverBorderColor: '#FFFFFF',
      pointHoverBorderWidth: 3,
      borderWidth: 2.5
    }]
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
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
        label: (context) => ` Balance: $${context.raw.toLocaleString()}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#94A3B8', font: { size: 11, family: 'Inter' } }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(43, 123, 187, 0.06)', drawBorder: false },
      ticks: { color: '#94A3B8', font: { size: 11, family: 'Inter' }, callback: (value) => `$${value}` }
    }
  }
};
</script>

<style scoped>
.chart-container {
  height: 280px;
  position: relative;
}
</style>