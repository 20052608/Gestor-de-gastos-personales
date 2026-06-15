<<template>
  <div class="chart-container">
    <Bar v-if="chartData" :data="chartData" :options="options" />
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
        backgroundColor: '#2B7BBB',
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 24,
        hoverBackgroundColor: '#0064B2',
      },
      {
        label: 'Gastos',
        data: props.data.map(d => d.expense),
        backgroundColor: '#ACC0D0',
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 24,
        hoverBackgroundColor: '#81A9C9',
      }
    ]
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        color: '#475569',
        font: { size: 12, family: 'Inter', weight: '500' }
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
      callbacks: {
        label: (context) => ` ${context.dataset.label}: $${context.raw.toLocaleString()}`
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