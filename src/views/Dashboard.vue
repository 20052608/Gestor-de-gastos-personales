<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-brand">
        <div class="brand-logo"><i class="fas fa-wallet"></i></div>
        <div class="brand-text" v-show="!sidebarCollapsed">
          <span class="brand-name">FinTrack</span><span class="brand-pro">Pro</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <button v-for="view in views" :key="view.id" class="nav-item" :class="{ active: currentView === view.id }" @click="currentView = view.id">
          <div class="nav-icon"><i :class="view.icon"></i></div>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ view.label }}</span>
          <div v-if="view.badge && !sidebarCollapsed" class="nav-badge">{{ view.badge }}</div>
          <div class="nav-indicator"></div>
        </button>
      </nav>
      <div class="sidebar-footer" v-show="!sidebarCollapsed">
        <div class="sidebar-user">
          <div class="user-avatar"><i class="fas fa-user"></i></div>
          <div class="user-info"><span class="user-name">Usuario</span><span class="user-role">Plan Gratuito</span></div>
        </div>
      </div>
      <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
        <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <header class="dashboard-header">
        <div class="header-left">
          <div class="view-title">
            <div class="view-icon" :style="{ background: currentViewData?.color }"><i :class="currentViewData?.icon"></i></div>
            <div><h1>{{ currentViewData?.title }}</h1><span class="subtitle">{{ currentViewData?.subtitle }}</span></div>
          </div>
        </div>
        <div class="header-right">
          <div class="date-badge"><i class="far fa-calendar-alt"></i>{{ currentMonth }}</div>
        </div>
      </header>

      <!-- VIEW: DASHBOARD -->
      <div v-if="currentView === 'dashboard'" class="view-content">
        <div class="stats-grid">
          <div class="stat-card income">
            <div class="stat-header"><div class="icon-wrapper"><i class="fas fa-arrow-down"></i></div><div class="trend up"><i class="fas fa-arrow-up"></i>12%</div></div>
            <div class="stat-content"><span class="stat-label">Ingresos Totales</span><span class="stat-value">${{ totalBalance.income.toLocaleString('es-ES',{minimumFractionDigits:2}) }}</span></div>
          </div>
          <div class="stat-card expense">
            <div class="stat-header"><div class="icon-wrapper"><i class="fas fa-arrow-up"></i></div><div class="trend down"><i class="fas fa-arrow-down"></i>5%</div></div>
            <div class="stat-content"><span class="stat-label">Gastos Totales</span><span class="stat-value">${{ totalBalance.expense.toLocaleString('es-ES',{minimumFractionDigits:2}) }}</span></div>
          </div>
          <div class="stat-card balance">
            <div class="stat-header"><div class="icon-wrapper"><i class="fas fa-scale-balanced"></i></div></div>
            <div class="stat-content"><span class="stat-label">Balance Neto</span><span class="stat-value">${{ totalBalance.balance.toLocaleString('es-ES',{minimumFractionDigits:2}) }}</span></div>
          </div>
        </div>

        <div v-if="budgetAlerts.length > 0" class="alerts-section">
          <div class="section-header"><h2><i class="fas fa-exclamation-triangle"></i> Alertas de Presupuesto</h2></div>
          <div class="alerts-grid">
            <div v-for="alert in budgetAlerts" :key="alert.category" class="alert-card">
              <div class="alert-top"><span>{{ alert.category }}</span><span class="alert-percentage">{{ alert.percentage }}%</span></div>
              <div class="progress-track"><div class="progress-fill" :style="{ width: Math.min(alert.percentage, 100) + '%' }"></div></div>
              <div class="alert-details">
                <span>Gastado: ${{ alert.spent }}</span><span>Presupuesto: ${{ alert.budget }}</span><span class="warning">Exceso: +${{ alert.spent - alert.budget }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-card">
          <div class="section-header"><h2><i class="fas fa-plus-circle"></i> Nueva Transacción</h2></div>
          <form @submit.prevent="handleSubmit" class="form-grid">
            <div class="form-group full-width">
              <label>Tipo</label>
              <div class="type-selector">
                <button type="button" :class="['type-btn', { active: form.type === 'income' }]" @click="form.type = 'income'"><i class="fas fa-arrow-down"></i> Ingreso</button>
                <button type="button" :class="['type-btn', { active: form.type === 'expense' }]" @click="form.type = 'expense'"><i class="fas fa-arrow-up"></i> Gasto</button>
              </div>
            </div>
            <div class="form-group"><label>Monto</label><input v-model.number="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" required class="input" /></div>
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="form.category" class="input select" required>
                <option value="" disabled>Selecciona</option>
                <option v-for="cat in filteredCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="form-group"><label>Fecha</label><input v-model="form.date" type="date" class="input" required /></div>
            <div class="form-group full-width"><label>Descripción (opcional)</label><input v-model="form.description" type="text" class="input" placeholder="Ej: Compra supermercado..." /></div>
            <button type="submit" class="btn btn-primary full-width"><i class="fas fa-check"></i> Guardar Transacción</button>
          </form>
        </div>

        <div class="charts-section">
          <div class="section-header"><h2><i class="fas fa-chart-pie"></i> Análisis Financiero</h2></div>
          <div class="charts-grid">
            <div class="chart-card">
              <div class="chart-header"><div class="chart-icon"><i class="fas fa-chart-pie"></i></div><div><h3>Gastos por Categoría</h3><p>Distribución mensual</p></div></div>
              <div class="chart-wrapper"><PieChart :data="expensesByCategory" /></div>
            </div>
            <div class="chart-card">
              <div class="chart-header"><div class="chart-icon"><i class="fas fa-chart-bar"></i></div><div><h3>Ingresos vs Gastos</h3><p>Comparativa mensual</p></div></div>
              <div class="chart-wrapper"><BarChart :data="monthlyTrend" /></div>
            </div>
            <div class="chart-card full-width">
              <div class="chart-header"><div class="chart-icon"><i class="fas fa-chart-line"></i></div><div><h3>Tendencia de Balance</h3><p>Evolución últimos 6 meses</p></div></div>
              <div class="chart-wrapper"><LineChart :data="monthlyTrend" /></div>
            </div>
          </div>
        </div>

        <div class="list-card">
          <div class="section-header"><h2><i class="fas fa-list-ul"></i> Historial</h2><button class="btn btn-secondary btn-sm" @click="exportToCSV"><i class="fas fa-download"></i> Exportar CSV</button></div>
          <div class="transactions-list">
            <div v-for="t in currentMonthTransactions" :key="t.id" class="transaction-row" :class="t.type">
              <div class="transaction-main">
                <div class="icon-wrapper" :class="t.type"><i :class="getCategoryIcon(t.category)"></i></div>
                <div class="transaction-info"><span class="transaction-category">{{ t.category }}</span><span class="transaction-desc">{{ t.description || 'Sin descripción' }}</span></div>
              </div>
              <div class="transaction-meta">
                <span class="transaction-date">{{ formatDate(t.date) }}</span>
                <span class="transaction-amount" :class="t.type">{{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toLocaleString('es-ES',{minimumFractionDigits:2}) }}</span>
                <button @click="deleteTransaction(t.id)" class="btn-delete"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
            <div v-if="currentMonthTransactions.length === 0" class="empty-state"><i class="fas fa-inbox"></i><p>No hay transacciones este mes</p><span>Agrega tu primer movimiento arriba</span></div>
          </div>
        </div>
      </div>

      <!-- VIEW: TRANSACCIONES -->
      <div v-else-if="currentView === 'transactions'" class="view-content">
        <div class="section-header"><h2><i class="fas fa-exchange-alt"></i> Transacciones</h2></div>
        <div class="form-card">
          <div class="section-header"><h2><i class="fas fa-plus-circle"></i> Nueva Transacción</h2></div>
          <form @submit.prevent="handleSubmit" class="form-grid">
            <div class="form-group full-width">
              <label>Tipo</label>
              <div class="type-selector">
                <button type="button" :class="['type-btn', { active: form.type === 'income' }]" @click="form.type = 'income'"><i class="fas fa-arrow-down"></i> Ingreso</button>
                <button type="button" :class="['type-btn', { active: form.type === 'expense' }]" @click="form.type = 'expense'"><i class="fas fa-arrow-up"></i> Gasto</button>
              </div>
            </div>
            <div class="form-group"><label>Monto</label><input v-model.number="form.amount" type="number" min="0.01" step="0.01" placeholder="0.00" required class="input" /></div>
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="form.category" class="input select" required>
                <option value="" disabled>Selecciona</option>
                <option v-for="cat in filteredCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="form-group"><label>Fecha</label><input v-model="form.date" type="date" class="input" required /></div>
            <div class="form-group full-width"><label>Descripción (opcional)</label><input v-model="form.description" type="text" class="input" placeholder="Ej: Compra supermercado..." /></div>
            <button type="submit" class="btn btn-primary full-width"><i class="fas fa-check"></i> Guardar Transacción</button>
          </form>
        </div>
        <div class="list-card">
          <div class="section-header"><h2><i class="fas fa-list-ul"></i> Historial</h2><button class="btn btn-secondary btn-sm" @click="exportToCSV"><i class="fas fa-download"></i> Exportar CSV</button></div>
          <div class="transactions-list">
            <div v-for="t in currentMonthTransactions" :key="t.id" class="transaction-row" :class="t.type">
              <div class="transaction-main">
                <div class="icon-wrapper" :class="t.type"><i :class="getCategoryIcon(t.category)"></i></div>
                <div class="transaction-info"><span class="transaction-category">{{ t.category }}</span><span class="transaction-desc">{{ t.description || 'Sin descripción' }}</span></div>
              </div>
              <div class="transaction-meta">
                <span class="transaction-date">{{ formatDate(t.date) }}</span>
                <span class="transaction-amount" :class="t.type">{{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toLocaleString('es-ES',{minimumFractionDigits:2}) }}</span>
                <button @click="deleteTransaction(t.id)" class="btn-delete"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW: ANÁLISIS -->
      <div v-else-if="currentView === 'analytics'" class="view-content">
        <div class="section-header"><h2><i class="fas fa-chart-area"></i> Análisis Detallado</h2></div>
        <div class="charts-grid single">
          <div class="chart-card full-width">
            <div class="chart-header"><div class="chart-icon"><i class="fas fa-chart-pie"></i></div><div><h3>Distribución de Gastos</h3><p>Por categoría</p></div></div>
            <div class="chart-wrapper"><PieChart :data="expensesByCategory" /></div>
          </div>
          <div class="chart-card full-width">
            <div class="chart-header"><div class="chart-icon"><i class="fas fa-chart-bar"></i></div><div><h3>Ingresos vs Gastos</h3><p>Comparativa mensual</p></div></div>
            <div class="chart-wrapper"><BarChart :data="monthlyTrend" /></div>
          </div>
          <div class="chart-card full-width">
            <div class="chart-header"><div class="chart-icon"><i class="fas fa-chart-line"></i></div><div><h3>Tendencia de Balance</h3><p>Evolución temporal</p></div></div>
            <div class="chart-wrapper"><LineChart :data="monthlyTrend" /></div>
          </div>
        </div>
      </div>

      <!-- VIEW: PRESUPUESTOS (INTERACTIVO) -->
      <div v-else-if="currentView === 'budgets'" class="view-content">
        <div class="section-header">
          <h2><i class="fas fa-piggy-bank"></i> Presupuestos</h2>
          <span class="subtitle-header">Define y controla tus límites de gasto</span>
        </div>

        <div class="budget-editor-card">
          <div class="budget-editor-header">
            <i class="fas fa-sliders-h"></i>
            <div>
              <h3>Editar Presupuestos</h3>
              <p>Ajusta el límite mensual para cada categoría</p>
            </div>
          </div>
          <div class="budget-editor-grid">
            <div v-for="(amount, category) in budgets" :key="category" class="budget-editor-item">
              <div class="budget-editor-info">
                <div class="budget-editor-icon" :class="getBudgetStatus(category)">
                  <i :class="getCategoryIcon(category)"></i>
                </div>
                <div class="budget-editor-details">
                  <span class="budget-editor-name">{{ category }}</span>
                  <span class="budget-editor-spent" :class="getBudgetStatus(category)">
                    Gastado: ${{ (expensesByCategory[category] || 0).toLocaleString() }}
                  </span>
                </div>
              </div>
              <div class="budget-editor-input-group">
                <span class="budget-editor-currency">$</span>
                <input 
                  type="number" 
                  :value="amount"
                  @input="updateBudget(category, Number($event.target.value))"
                  min="0" 
                  step="10"
                  class="budget-editor-input"
                />
              </div>
              <div class="budget-editor-bar">
                <div 
                  class="budget-editor-fill" 
                  :class="getBudgetStatus(category)"
                  :style="{ width: Math.min(getBudgetPercentage(category), 100) + '%' }"
                ></div>
              </div>
              <span class="budget-editor-percent">{{ getBudgetPercentage(category) }}%</span>
            </div>
          </div>
        </div>

        <div v-if="budgetAlerts.length > 0" class="alerts-section">
          <div class="section-header"><h2><i class="fas fa-exclamation-triangle"></i> Alertas Activas</h2></div>
          <div class="alerts-grid">
            <div v-for="alert in budgetAlerts" :key="alert.category" class="alert-card">
              <div class="alert-top">
                <span><i :class="getCategoryIcon(alert.category)"></i> {{ alert.category }}</span>
                <span class="alert-percentage">{{ alert.percentage }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: Math.min(alert.percentage, 100) + '%' }"></div>
              </div>
              <div class="alert-details">
                <span>Gastado: ${{ alert.spent }}</span>
                <span>Límite: ${{ alert.budget }}</span>
                <span class="warning">Exceso: +${{ alert.spent - alert.budget }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="budgetAlerts.length === 0" class="budget-healthy">
          <div class="healthy-icon"><i class="fas fa-check-circle"></i></div>
          <h3>¡Todo en orden!</h3>
          <p>No has superado ningún presupuesto este mes. Sigue así.</p>
        </div>
      </div>

      <!-- VIEW: CONFIGURACIÓN -->
      <div v-else-if="currentView === 'settings'" class="view-content">
        <div class="section-header"><h2><i class="fas fa-cog"></i> Configuración</h2></div>
        <div class="settings-card">
          <div class="settings-section">
            <h3>Preferencias</h3>
            <div class="setting-item"><div class="setting-info"><span class="setting-label">Moneda</span><span class="setting-desc">Símbolo de moneda para montos</span></div><div class="setting-value">$ USD</div></div>
            <div class="setting-item"><div class="setting-info"><span class="setting-label">Formato de fecha</span><span class="setting-desc">DD/MM/AAAA</span></div><div class="setting-value"><i class="fas fa-check-circle" style="color: #059669"></i></div></div>
          </div>
          <div class="settings-section">
            <h3>Datos</h3>
            <div class="setting-item"><div class="setting-info"><span class="setting-label">Exportar datos</span><span class="setting-desc">Descargar todas las transacciones</span></div><button class="btn btn-secondary btn-sm" @click="exportToCSV"><i class="fas fa-download"></i> Exportar CSV</button></div>
            <div class="setting-item"><div class="setting-info"><span class="setting-label">Total de transacciones</span><span class="setting-desc">Registros almacenados</span></div><div class="setting-value badge">{{ transactions.length }}</div></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useFinanceStore } from '../stores/financeStore.js';
import PieChart from '../components/charts/PieChart.vue';
import BarChart from '../components/charts/BarChart.vue';
import LineChart from '../components/charts/LineChart.vue';

const { transactions, budgets, totalBalance, currentMonthTransactions, expensesByCategory, budgetAlerts, monthlyTrend, addTransaction, deleteTransaction, updateBudget, exportToCSV } = useFinanceStore();

const sidebarCollapsed = ref(false);
const currentView = ref('dashboard');

const views = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', title: 'Dashboard', subtitle: 'Resumen general de tus finanzas', color: 'linear-gradient(135deg, #2B7BBB, #0064B2)' },
  { id: 'transactions', label: 'Transacciones', icon: 'fas fa-exchange-alt', title: 'Transacciones', subtitle: 'Gestiona tus movimientos', color: 'linear-gradient(135deg, #059669, #10b981)' },
  { id: 'analytics', label: 'Análisis', icon: 'fas fa-chart-area', title: 'Análisis', subtitle: 'Gráficos y métricas', color: 'linear-gradient(135deg, #D97706, #f59e0b)' },
  { id: 'budgets', label: 'Presupuestos', icon: 'fas fa-piggy-bank', title: 'Presupuestos', subtitle: 'Control de límites', color: 'linear-gradient(135deg, #DC2626, #ef4444)' },
  { id: 'settings', label: 'Configuración', icon: 'fas fa-cog', title: 'Configuración', subtitle: 'Preferencias y datos', color: 'linear-gradient(135deg, #475569, #64748b)' }
];

const currentViewData = computed(() => views.find(v => v.id === currentView.value));
const currentMonth = computed(() => new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));

const today = new Date().toISOString().split('T')[0];
const form = reactive({ type: 'expense', category: '', amount: '', date: today, description: '' });
const incomeCategories = ['Salario', 'Freelance', 'Inversiones', 'Otros Ingresos'];
const expenseCategories = ['Vivienda', 'Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Otros'];
const filteredCategories = computed(() => form.type === 'income' ? incomeCategories : expenseCategories);

const handleSubmit = () => { addTransaction({ ...form }); form.amount = ''; form.description = ''; form.category = ''; };

const getBudgetPercentage = (category) => {
  const spent = expensesByCategory.value[category] || 0;
  const limit = budgets.value[category] || 1;
  return Math.round((spent / limit) * 100);
};

const getBudgetStatus = (category) => {
  const pct = getBudgetPercentage(category);
  if (pct >= 100) return 'danger';
  if (pct >= 80) return 'warning';
  return 'good';
};

const categoryIcons = { 'Salario': 'fas fa-money-bill-wave', 'Freelance': 'fas fa-laptop-code', 'Inversiones': 'fas fa-chart-line', 'Vivienda': 'fas fa-home', 'Alimentación': 'fas fa-utensils', 'Transporte': 'fas fa-car', 'Entretenimiento': 'fas fa-film', 'Salud': 'fas fa-heartbeat', 'Educación': 'fas fa-graduation-cap', 'Otros': 'fas fa-tag' };
const getCategoryIcon = (cat) => categoryIcons[cat] || 'fas fa-tag';
const formatDate = (d) => new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
</script>

<style scoped>
.app-layout { display: flex; min-height: 100vh; background: #F0F4F8; font-family: 'Plus Jakarta Sans', sans-serif; }

/* SIDEBAR */
.sidebar { width: 260px; background: #0F172A; display: flex; flex-direction: column; position: fixed; left: 0; top: 0; bottom: 0; z-index: 100; transition: width 0.35s ease; box-shadow: 4px 0 24px rgba(0,0,0,0.08); }
.sidebar.collapsed { width: 72px; }
.sidebar-brand { padding: 1.5rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.brand-logo { width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #2B7BBB, #0064B2); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.3rem; flex-shrink: 0; }
.brand-name { font-size: 1.3rem; font-weight: 800; color: white; letter-spacing: -0.02em; }
.brand-pro { font-size: 0.75rem; font-weight: 700; color: #81A9C9; text-transform: uppercase; letter-spacing: 1px; }
.sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
.nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 10px; color: #CBD5E1; background: transparent; border: none; cursor: pointer; transition: all 0.15s ease; position: relative; font-family: inherit; font-size: 0.9rem; font-weight: 500; text-align: left; }
.nav-item:hover { background: rgba(255,255,255,0.06); color: white; }
.nav-item.active { background: rgba(43, 123, 187, 0.15); color: #81A9C9; }
.nav-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.nav-item.active .nav-icon { background: linear-gradient(135deg, #2B7BBB, #0064B2); color: white; box-shadow: 0 4px 12px rgba(43, 123, 187, 0.3); }
.nav-label { flex: 1; white-space: nowrap; }
.nav-badge { padding: 2px 8px; background: #DC2626; color: white; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; min-width: 20px; text-align: center; }
.nav-indicator { position: absolute; left: 0; top: 50%; transform: translateY(-50%) scaleY(0); width: 3px; height: 24px; background: #2B7BBB; border-radius: 0 9999px 9999px 0; transition: transform 0.15s ease; }
.nav-item.active .nav-indicator { transform: translateY(-50%) scaleY(1); }
.sidebar-footer { padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.06); }
.sidebar-user { display: flex; align-items: center; gap: 0.75rem; }
.user-avatar { width: 36px; height: 36px; border-radius: 9999px; background: linear-gradient(135deg, #2B7BBB, #0064B2); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.9rem; }
.user-name { font-size: 0.85rem; font-weight: 600; color: white; }
.user-role { font-size: 0.75rem; color: #64748B; }
.sidebar-toggle { position: absolute; right: -12px; top: 80px; width: 24px; height: 24px; border-radius: 9999px; background: white; border: 1px solid rgba(43,123,187,0.15); color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 101; }

/* MAIN */
.main-content { flex: 1; margin-left: 260px; padding: 2rem; max-width: calc(100% - 260px); transition: margin-left 0.35s ease, max-width 0.35s ease; min-height: 100vh; }
.main-content.sidebar-collapsed { margin-left: 72px; max-width: calc(100% - 72px); }

/* HEADER */
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(43,123,187,0.08); }
.view-title { display: flex; align-items: center; gap: 1rem; }
.view-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.view-title h1 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; color: #0F172A; }
.subtitle { font-size: 0.9rem; color: #475569; font-weight: 500; }
.date-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; background: white; border: 1.5px solid rgba(43,123,187,0.15); border-radius: 9999px; font-size: 0.9rem; color: #2B7BBB; font-weight: 600; box-shadow: 0 1px 2px rgba(0,100,178,0.06); }

/* STATS */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; }
.stat-card { background: white; border: 1px solid rgba(43,123,187,0.08); border-radius: 14px; padding: 1.5rem; box-shadow: 0 1px 2px rgba(0,100,178,0.06); transition: all 0.25s ease; position: relative; overflow: hidden; }
.stat-card:hover { transform: translateY(-3px); border-color: rgba(43,123,187,0.15); box-shadow: 0 4px 12px rgba(0,100,178,0.10), 0 12px 40px rgba(0,100,178,0.08); }
.stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #2B7BBB, #0064B2); opacity: 0; transition: opacity 0.15s ease; }
.stat-card:hover::before { opacity: 1; }
.stat-card.income::before { background: linear-gradient(90deg, #059669, #34d399); }
.stat-card.expense::before { background: linear-gradient(90deg, #DC2626, #f87171); }
.stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.stat-card .icon-wrapper { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.stat-card.income .icon-wrapper { background: rgba(5,150,105,0.12); color: #059669; }
.stat-card.expense .icon-wrapper { background: rgba(220,38,38,0.12); color: #DC2626; }
.stat-card.balance .icon-wrapper { background: linear-gradient(135deg, rgba(43,123,187,0.15), rgba(0,100,178,0.08)); color: #2B7BBB; }
.trend { display: flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; }
.trend.up { background: rgba(5,150,105,0.12); color: #059669; }
.trend.down { background: rgba(220,38,38,0.12); color: #DC2626; }
.stat-content { display: flex; flex-direction: column; gap: 0.25rem; }
.stat-label { font-size: 0.85rem; color: #475569; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 2rem; font-weight: 800; font-family: 'JetBrains Mono', monospace; letter-spacing: -0.03em; line-height: 1.2; }
.stat-card.income .stat-value { color: #059669; }
.stat-card.expense .stat-value { color: #DC2626; }
.stat-card.balance .stat-value { background: linear-gradient(135deg, #2B7BBB, #0064B2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

/* SECTION HEADER */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.section-header h2 { font-size: 1.25rem; font-weight: 700; color: #0F172A; display: flex; align-items: center; gap: 0.75rem; }
.section-header h2 i { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #2B7BBB, #0064B2); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.9rem; box-shadow: 0 2px 8px rgba(43,123,187,0.25); }

/* ALERTS */
.alerts-section { margin-bottom: 1.5rem; }
.alerts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
.alert-card { background: white; border: 1px solid rgba(43,123,187,0.08); border-radius: 14px; padding: 1.5rem; border-left: 3px solid #DC2626; box-shadow: 0 1px 2px rgba(0,100,178,0.06); }
.alert-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 700; color: #0F172A; }
.alert-percentage { background: rgba(220,38,38,0.12); color: #DC2626; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.progress-track { height: 8px; background: #F1F5F9; border-radius: 9999px; overflow: hidden; margin-bottom: 1rem; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #D97706, #DC2626); border-radius: 9999px; transition: width 1s ease; box-shadow: 0 0 12px rgba(220,38,38,0.2); }
.alert-details { display: flex; gap: 1rem; font-size: 0.85rem; }
.alert-details span { color: #475569; }
.alert-details .warning { color: #D97706; font-weight: 700; }

.budget-healthy { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 3rem 1.5rem; text-align: center; }
.healthy-icon { width: 80px; height: 80px; border-radius: 9999px; background: linear-gradient(135deg, rgba(5,150,105,0.15), rgba(5,150,105,0.08)); color: #059669; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: 0 8px 32px rgba(5,150,105,0.15); animation: float 3s ease-in-out infinite; }
.budget-healthy h3 { font-size: 1.3rem; font-weight: 700; color: #0F172A; }
.budget-healthy p { font-size: 0.9rem; color: #475569; max-width: 300px; }

/* FORM */
.form-card { background: white; border: 1px solid rgba(43,123,187,0.08); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 2px rgba(0,100,178,0.06); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.input { width: 100%; padding: 0.75rem 1rem; background: white; border: 1.5px solid rgba(43,123,187,0.08); border-radius: 10px; color: #0F172A; font-size: 0.9rem; font-family: inherit; transition: all 0.15s ease; }
.input:focus { outline: none; border-color: #81A9C9; box-shadow: 0 0 0 3px rgba(43,123,187,0.12); }
.select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%235692C2' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 5.646a.5.5 0 0 1 .708 0L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 2.5rem; }
.type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.type-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; border-radius: 10px; border: 2px solid rgba(43,123,187,0.08); background: white; color: #475569; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; font-family: inherit; }
.type-btn:hover { border-color: #81A9C9; color: #2B7BBB; }
.type-btn.active { background: linear-gradient(135deg, rgba(43,123,187,0.08), rgba(0,100,178,0.08)); border-color: #2B7BBB; color: #0064B2; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: 10px; font-size: 0.875rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s ease; font-family: inherit; }
.btn-primary { background: linear-gradient(135deg, #2B7BBB, #0064B2); color: white; box-shadow: 0 4px 20px rgba(43,123,187,0.2); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(43,123,187,0.25), 0 4px 20px rgba(43,123,187,0.2); }
.btn-secondary { background: white; color: #2B7BBB; border: 1.5px solid rgba(43,123,187,0.15); }
.btn-secondary:hover { background: #ACC0D0; border-color: #81A9C9; color: #0064B2; }
.btn-sm { padding: 0.5rem 0.75rem; font-size: 0.8rem; }
.full-width { grid-column: 1 / -1; }

/* CHARTS */
.charts-section { margin-bottom: 1.5rem; }
.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
.charts-grid.single { grid-template-columns: 1fr; }
.chart-card { background: white; border: 1px solid rgba(43,123,187,0.08); border-radius: 14px; padding: 1.5rem; box-shadow: 0 1px 2px rgba(0,100,178,0.06); }
.chart-card.full-width { grid-column: 1 / -1; }
.chart-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.chart-icon { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, rgba(43,123,187,0.15), rgba(0,100,178,0.08)); display: flex; align-items: center; justify-content: center; font-size: 1rem; color: #2B7BBB; }
.chart-header h3 { font-size: 1.05rem; font-weight: 700; color: #0F172A; }
.chart-header p { font-size: 0.8rem; color: #94A3B8; margin-top: 1px; }
.chart-wrapper { min-height: 280px; }

/* LIST */
.list-card { background: white; border: 1px solid rgba(43,123,187,0.08); border-radius: 14px; padding: 1.5rem; box-shadow: 0 1px 2px rgba(0,100,178,0.06); }
.transactions-list { display: flex; flex-direction: column; gap: 2px; }
.transaction-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-radius: 10px; transition: all 0.15s ease; position: relative; overflow: hidden; }
.transaction-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: transparent; border-radius: 0 9999px 9999px 0; transition: background 0.15s ease; }
.transaction-row.income::before { background: #059669; }
.transaction-row.expense::before { background: #DC2626; }
.transaction-row:hover { background: #F1F5F9; transform: translateX(4px); }
.transaction-main { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
.transaction-row .icon-wrapper { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.transaction-row .icon-wrapper.income { background: linear-gradient(135deg, rgba(5,150,105,0.15), rgba(5,150,105,0.08)); color: #059669; }
.transaction-row .icon-wrapper.expense { background: linear-gradient(135deg, rgba(220,38,38,0.15), rgba(220,38,38,0.08)); color: #DC2626; }
.transaction-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.transaction-category { font-weight: 700; font-size: 0.9rem; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.transaction-desc { font-size: 0.8rem; color: #94A3B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.transaction-meta { display: flex; align-items: center; gap: 1.25rem; flex-shrink: 0; }
.transaction-date { font-size: 0.8rem; color: #94A3B8; font-family: 'JetBrains Mono', monospace; min-width: 70px; }
.transaction-amount { font-weight: 700; font-size: 1rem; font-family: 'JetBrains Mono', monospace; min-width: 120px; text-align: right; }
.transaction-amount.income { color: #059669; }
.transaction-amount.expense { color: #DC2626; }
.btn-delete { width: 32px; height: 32px; border-radius: 10px; border: none; background: transparent; color: #94A3B8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; opacity: 0; }
.transaction-row:hover .btn-delete { opacity: 1; }
.btn-delete:hover { background: rgba(220,38,38,0.1); color: #DC2626; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 3rem 1.5rem; color: #94A3B8; text-align: center; }
.empty-state i { font-size: 2.5rem; color: #81A9C9; margin-bottom: 0.5rem; }
.empty-state p { font-size: 1rem; font-weight: 600; color: #475569; }
.empty-state span { font-size: 0.85rem; }

/* SETTINGS */
.settings-card { background: white; border: 1px solid rgba(43,123,187,0.08); border-radius: 14px; max-width: 600px; box-shadow: 0 1px 2px rgba(0,100,178,0.06); }
.settings-section { padding: 1.5rem; border-bottom: 1px solid rgba(43,123,187,0.08); }
.settings-section:last-child { border-bottom: none; }
.settings-section h3 { font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 1rem; }
.setting-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(43,123,187,0.08); }
.setting-item:last-child { border-bottom: none; }
.setting-info { display: flex; flex-direction: column; gap: 2px; }
.setting-label { font-weight: 600; color: #0F172A; font-size: 0.9rem; }
.setting-desc { font-size: 0.8rem; color: #94A3B8; }
.setting-value { font-weight: 700; color: #2B7BBB; font-family: 'JetBrains Mono', monospace; }
.setting-value.badge { padding: 0.25rem 0.75rem; background: rgba(43,123,187,0.12); border-radius: 9999px; font-size: 0.85rem; }

/* BUDGET EDITOR */
.budget-editor-card { background: white; border: 1px solid rgba(43,123,187,0.08); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 2px rgba(0,100,178,0.06); }
.budget-editor-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(43,123,187,0.08); }
.budget-editor-header i { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #2B7BBB, #0064B2); display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; }
.budget-editor-header h3 { font-size: 1.1rem; font-weight: 700; color: #0F172A; }
.budget-editor-header p { font-size: 0.85rem; color: #94A3B8; }
.budget-editor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
.budget-editor-item { background: #F8FAFC; border: 1px solid rgba(43,123,187,0.08); border-radius: 12px; padding: 1rem; transition: all 0.2s ease; }
.budget-editor-item:hover { border-color: rgba(43,123,187,0.2); box-shadow: 0 4px 12px rgba(0,100,178,0.08); }
.budget-editor-info { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.budget-editor-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.budget-editor-icon.good { background: rgba(5,150,105,0.12); color: #059669; }
.budget-editor-icon.warning { background: rgba(217,119,6,0.12); color: #D97706; }
.budget-editor-icon.danger { background: rgba(220,38,38,0.12); color: #DC2626; }
.budget-editor-details { display: flex; flex-direction: column; gap: 2px; }
.budget-editor-name { font-weight: 700; color: #0F172A; font-size: 0.95rem; }
.budget-editor-spent { font-size: 0.8rem; font-weight: 600; }
.budget-editor-spent.good { color: #059669; }
.budget-editor-spent.warning { color: #D97706; }
.budget-editor-spent.danger { color: #DC2626; }
.budget-editor-input-group { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
.budget-editor-currency { color: #2B7BBB; font-weight: 700; font-size: 1.1rem; }
.budget-editor-input { flex: 1; padding: 0.5rem 0.75rem; border: 1.5px solid rgba(43,123,187,0.15); border-radius: 8px; font-size: 1rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #0F172A; transition: all 0.15s ease; }
.budget-editor-input:focus { outline: none; border-color: #2B7BBB; box-shadow: 0 0 0 3px rgba(43,123,187,0.12); }
.budget-editor-bar { height: 6px; background: #E2E8F0; border-radius: 9999px; overflow: hidden; margin-bottom: 0.5rem; }
.budget-editor-fill { height: 100%; border-radius: 9999px; transition: width 0.5s ease, background 0.3s ease; }
.budget-editor-fill.good { background: linear-gradient(90deg, #059669, #34d399); }
.budget-editor-fill.warning { background: linear-gradient(90deg, #D97706, #f59e0b); }
.budget-editor-fill.danger { background: linear-gradient(90deg, #DC2626, #ef4444); }
.budget-editor-percent { font-size: 0.8rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #475569; }

.subtitle-header { font-size: 0.85rem; color: #94A3B8; margin-left: auto; }

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

/* RESPONSIVE */
@media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } .sidebar { transform: translateX(-100%); } .sidebar.open { transform: translateX(0); } .main-content { margin-left: 0; max-width: 100%; padding: 1rem; } .sidebar-toggle { display: none; } }
@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } .dashboard-header { flex-direction: column; gap: 1rem; align-items: flex-start; } .alerts-grid { grid-template-columns: 1fr; } .budget-editor-grid { grid-template-columns: 1fr; } }
</style>