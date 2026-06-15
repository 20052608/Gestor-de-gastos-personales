<<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="brand">
        <div class="logo">
          <i class="fas fa-wallet"></i>
        </div>
        <div>
          <h1>FinTrack Pro</h1>
          <span class="subtitle">Gestor de Finanzas Personales</span>
        </div>
      </div>
      <div class="header-actions">
        <div class="date-badge">
          <i class="fas fa-calendar-alt"></i>
          {{ currentMonth }}
        </div>
      </div>
    </header>

    <!-- Stats Row -->
    <div class="stats-grid">
      <StatCard
        label="Ingresos Totales"
        :value="totalBalance.income"
        type="income"
        icon="fas fa-arrow-down"
        :trend="12"
        trendDirection="up"
      />
      <StatCard
        label="Gastos Totales"
        :value="totalBalance.expense"
        type="expense"
        icon="fas fa-arrow-up"
        :trend="5"
        trendDirection="down"
        :progress="Math.round((totalBalance.expense / (totalBalance.income || 1)) * 100)"
        progressLabel="Ratio gasto/ingreso"
      />
      <StatCard
        label="Balance Neto"
        :value="totalBalance.balance"
        type="balance"
        icon="fas fa-scale-balanced"
      />
    </div>

    <!-- Alertas -->
    <BudgetAlerts :alerts="budgetAlerts" />

    <!-- Formulario -->
    <TransactionForm 
      :categories="categories" 
      @add="addTransaction" 
    />

    <!-- Charts Grid -->
    <div class="charts-section">
      <SectionHeader 
        title="Análisis Financiero" 
        subtitle="Visualiza tus patrones de gasto e ingresos"
        icon="fas fa-chart-pie"
      />
      
      <div class="charts-grid">
        <Card class="chart-card" hoverable>
          <template #header>
            <div class="chart-header">
              <div class="chart-icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <h3>Gastos por Categoría</h3>
            </div>
          </template>
          <PieChart :data="expensesByCategory" />
        </Card>
        
        <Card class="chart-card" hoverable>
          <template #header>
            <div class="chart-header">
              <div class="chart-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <h3>Ingresos vs Gastos</h3>
            </div>
          </template>
          <BarChart :data="monthlyTrend" />
        </Card>
        
        <Card class="chart-card full-width" hoverable>
          <template #header>
            <div class="chart-header">
              <div class="chart-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <h3>Tendencia de Balance</h3>
            </div>
          </template>
          <LineChart :data="monthlyTrend" />
        </Card>
      </div>
    </div>

    <!-- Transacciones -->
    <TransactionList 
      :transactions="currentMonthTransactions" 
      @delete="deleteTransaction"
      @export="exportToCSV"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore.js';
import Card from '../components/ui/Card.vue';
import StatCard from '../components/ui/StatCard.vue';
import SectionHeader from '../components/ui/SectionHeader.vue';
import TransactionForm from '../components/TransactionForm.vue';
import TransactionList from '../components/TransactionList.vue';
import BudgetAlerts from '../components/BudgetAlerts.vue';
import PieChart from '../components/charts/PieChart.vue';
import BarChart from '../components/charts/BarChart.vue';
import LineChart from '../components/charts/LineChart.vue';

const {
  categories,
  totalBalance,
  currentMonthTransactions,
  expensesByCategory,
  budgetAlerts,
  monthlyTrend,
  addTransaction,
  deleteTransaction,
  exportToCSV
} = useFinanceStore();

const currentMonth = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
});
</script>

<style scoped>
.dashboard {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-8);
  min-height: 100vh;
  background: var(--bg-primary);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.logo {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
  box-shadow: var(--shadow-blue);
  transition: all var(--transition-fast);
}

.logo:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.brand h1 {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  color: var(--blue);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.date-badge i {
  color: var(--blue-medium);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}

.charts-section {
  margin-bottom: var(--space-6);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}

.chart-card {
  background: var(--bg-secondary);
}

.chart-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.chart-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(43, 123, 187, 0.12), rgba(0, 100, 178, 0.12));
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.chart-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: var(--space-4);
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-header {
    flex-direction: column;
    gap: var(--space-4);
    align-items: flex-start;
  }
}
</style>