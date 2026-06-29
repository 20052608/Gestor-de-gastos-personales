<template>
  <Card class="list-card" :delay="200">
    <template #header>
      <SectionHeader 
        title="Historial de Transacciones" 
        :subtitle="`${transactions.length} movimientos este mes`"
        icon="fas fa-list-ul"
        badge="En tiempo real"
        badge-variant="info"
      >
        <template #actions>
          <button class="btn btn-secondary btn-sm" @click="$emit('export')">
            <i class="fas fa-download"></i>
            <span class="btn-text">Exportar CSV</span>
          </button>
        </template>
      </SectionHeader>
    </template>

    <div class="transactions-list">
      <div 
        v-for="(t, index) in transactions" 
        :key="t.id"
        class="transaction-row"
        :class="[t.type, { 'is-new': index === 0 }]"
        :style="{ animationDelay: `${index * 40}ms` }"
      >
        <div class="transaction-main">
          <div class="icon-wrapper" :class="t.type">
            <i :class="getCategoryIcon(t.category)"></i>
          </div>
          <div class="transaction-info">
            <span class="transaction-category">{{ t.category }}</span>
            <span class="transaction-desc">{{ t.description || 'Sin descripción' }}</span>
          </div>
        </div>

        <div class="transaction-meta">
          <div class="transaction-date">
            <i class="far fa-calendar"></i>
            {{ formatDate(t.date) }}
          </div>
          <span class="transaction-amount" :class="t.type">
            <span class="amount-sign">{{ t.type === 'income' ? '+' : '-' }}</span>
            <span class="amount-value">${{ t.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}</span>
          </span>
          <button @click="$emit('delete', t.id)" class="btn-delete" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <div v-if="transactions.length === 0" class="empty-state">
        <div class="empty-illustration">
          <div class="empty-papers">
            <div class="paper paper-1"></div>
            <div class="paper paper-2"></div>
            <div class="paper paper-3"></div>
          </div>
          <div class="empty-icon">
            <i class="fas fa-inbox"></i>
          </div>
        </div>
        <p class="empty-title">Sin transacciones este mes</p>
        <p class="empty-desc">Agrega tu primer movimiento usando el formulario de arriba</p>
        <div class="empty-hint">
          <i class="fas fa-arrow-up"></i>
          <span>Empieza por ahí</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from './ui/Card.vue';
import SectionHeader from './ui/SectionHeader.vue';

defineProps({
  transactions: { type: Array, required: true }
});

defineEmits(['delete', 'export']);

const categoryIcons = {
  'Salario': 'fas fa-money-bill-wave',
  'Freelance': 'fas fa-laptop-code',
  'Inversiones': 'fas fa-chart-line',
  'Vivienda': 'fas fa-home',
  'Alimentación': 'fas fa-utensils',
  'Transporte': 'fas fa-car',
  'Entretenimiento': 'fas fa-film',
  'Salud': 'fas fa-heartbeat',
  'Educación': 'fas fa-graduation-cap',
  'Otros': 'fas fa-tag'
};

const getCategoryIcon = (category) => {
  return categoryIcons[category] || 'fas fa-tag';
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  });
};
</script>

<style scoped>
.list-card {
  margin-bottom: var(--space-6);
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.transaction-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  animation: fadeInSlide 0.4s ease forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
}

.transaction-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  border-radius: 0 var(--radius-full) var(--radius-full) 0;
  transition: background var(--transition-fast);
}

.transaction-row.income::before {
  background: var(--income);
}

.transaction-row.expense::before {
  background: var(--expense);
}

.transaction-row:hover {
  background: var(--bg-tertiary);
  transform: translateX(4px);
}

.transaction-row.is-new {
  animation: highlightNew 1.5s ease;
}

@keyframes highlightNew {
  0% { background: rgba(43, 123, 187, 0.08); }
  100% { background: transparent; }
}

.transaction-main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  position: relative;
}

.icon-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%);
}

.icon-wrapper.income {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(5, 150, 105, 0.08));
  color: var(--income);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
}

.icon-wrapper.expense {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(220, 38, 38, 0.08));
  color: var(--expense);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
}

.transaction-row:hover .icon-wrapper {
  transform: scale(1.08) rotate(-4deg);
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.transaction-category {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-meta {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  flex-shrink: 0;
}

.transaction-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  min-width: 70px;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.transaction-date i {
  font-size: 0.7rem;
  opacity: 0.6;
}

.transaction-amount {
  font-weight: 700;
  font-size: 1rem;
  font-family: var(--font-mono);
  min-width: 120px;
  text-align: right;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
}

.amount-sign {
  font-size: 0.85rem;
  opacity: 0.7;
}

.amount-value {
  font-variant-numeric: tabular-nums;
}

.transaction-amount.income { color: var(--income); }
.transaction-amount.expense { color: var(--expense); }

.btn-delete {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  opacity: 0;
  position: relative;
  overflow: hidden;
}

.transaction-row:hover .btn-delete {
  opacity: 1;
}

.btn-delete::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--expense);
  opacity: 0;
  transition: opacity var(--transition-fast);
  border-radius: inherit;
}

.btn-delete:hover::after {
  opacity: 0.1;
}

.btn-delete:hover {
  color: var(--expense);
  transform: scale(1.1);
}

.btn-delete:active {
  transform: scale(0.95);
}

.btn-delete i {
  position: relative;
  z-index: 1;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-6);
  color: var(--text-muted);
  text-align: center;
}

.empty-illustration {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: var(--space-2);
}

.empty-papers {
  position: absolute;
  inset: 0;
}

.paper {
  position: absolute;
  width: 50px;
  height: 60px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  animation: paperFloat 3s ease-in-out infinite;
}

.paper-1 {
  left: 10px;
  top: 20px;
  transform: rotate(-8deg);
  animation-delay: 0s;
}

.paper-2 {
  left: 25px;
  top: 15px;
  transform: rotate(5deg);
  animation-delay: 0.5s;
  background: var(--bg-elevated);
}

.paper-3 {
  left: 40px;
  top: 25px;
  transform: rotate(-3deg);
  animation-delay: 1s;
}

.empty-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  border: 2px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--blue-light);
  box-shadow: var(--shadow-md);
  z-index: 2;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.empty-desc {
  font-size: 0.85rem;
  max-width: 260px;
}

.empty-hint {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  color: var(--blue);
  font-weight: 600;
  animation: bounceHint 2s ease-in-out infinite;
}

.empty-hint i {
  animation: arrowBounce 1s ease-in-out infinite;
}

@keyframes fadeInSlide {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes paperFloat {
  0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
  50% { transform: translateY(-6px) rotate(var(--r, 0deg)); }
}

@keyframes bounceHint {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@media (max-width: 640px) {
  .transaction-meta {
    gap: var(--space-3);
  }
  .transaction-date {
    display: none;
  }
  .btn-text {
    display: none;
  }
  .btn-delete {
    opacity: 1;
  }
}
</style>
