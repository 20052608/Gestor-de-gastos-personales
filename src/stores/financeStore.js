import { ref, computed } from 'vue';
import { sampleTransactions, sampleBudgets, categories } from '../data/sampleData.js';

const transactions = ref([...sampleTransactions]);
const budgets = ref({ ...sampleBudgets });

const totalBalance = computed(() => {
  const income = transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, balance: income - expense };
});

const currentMonthTransactions = computed(() => {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  return transactions.value
    .filter(t => t.date.startsWith(currentMonth))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const expensesByCategory = computed(() => {
  const expenses = {};
  currentMonthTransactions.value.filter(t => t.type === 'expense').forEach(t => {
    expenses[t.category] = (expenses[t.category] || 0) + t.amount;
  });
  return expenses;
});

const budgetAlerts = computed(() => {
  const alerts = [];
  Object.entries(expensesByCategory.value).forEach(([category, spent]) => {
    const budget = budgets.value[category];
    if (budget && spent > budget) {
      alerts.push({ category, budget, spent, percentage: Math.round((spent / budget) * 100) });
    }
  });
  return alerts.sort((a, b) => b.percentage - a.percentage);
});

const monthlyTrend = computed(() => {
  const trend = {};
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toISOString().slice(0, 7);
    months.push(monthKey);
    trend[monthKey] = { income: 0, expense: 0 };
  }
  transactions.value.forEach(t => {
    const monthKey = t.date.slice(0, 7);
    if (trend[monthKey]) trend[monthKey][t.type] += t.amount;
  });
  return months.map(m => ({
    month: m,
    income: trend[m].income,
    expense: trend[m].expense,
    balance: trend[m].income - trend[m].expense
  }));
});

const addTransaction = (transaction) => {
  transactions.value.unshift({ id: crypto.randomUUID(), ...transaction });
};

const deleteTransaction = (id) => {
  transactions.value = transactions.value.filter(t => t.id !== id);
};

const updateBudget = (category, amount) => {
  budgets.value[category] = amount;
};

const exportToCSV = () => {
  const headers = ['ID', 'Fecha', 'Tipo', 'Categoria', 'Monto', 'Descripcion'];
  const rows = transactions.value.map(t => [t.id, t.date, t.type, t.category, t.amount, `"${t.description || ''}"`]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `finanzas_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
};

export function useFinanceStore() {
  return {
    transactions, budgets, categories, totalBalance, currentMonthTransactions,
    expensesByCategory, budgetAlerts, monthlyTrend,
    addTransaction, deleteTransaction, updateBudget, exportToCSV
  };
}