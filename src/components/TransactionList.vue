<<template>
  <Card>
    <template #header>
      <SectionHeader 
        title="Historial de Transacciones" 
        :subtitle="`${transactions.length} movimientos este mes`"
        icon="fas fa-list-ul"
      >
        <template #actions>
          <button class="btn btn-secondary" @click="$emit('export')">
            <i class="fas fa-download"></i>
            Exportar CSV
          </button>
        </template>
      </SectionHeader>
    </template>
    
    <div class="transactions-list">
      <div 
        v-for="(t, index) in transactions" 
        :key="t.id"
        class="transaction-row"
        :class="t.type"
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
          <span class="transaction-date">{{ formatDate(t.date) }}</span>
          <span class="transaction-amount" :class="t.type">
            {{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}
          </span>
          <button @click="$emit('delete', t.id)" class="btn-delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      
      <div v-if="transactions.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <p>No hay transacciones este mes</p>
        <span>Agrega tu primer movimiento arriba</span>
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
  animation: fadeIn 0.35s ease forwards;
  opacity: 0;
}

.transaction-row:hover {
  background: var(--bg-tertiary);
}

.transaction-main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.icon-wrapper.income {
  background: var(--income-soft);
  color: var(--income);
}

.icon-wrapper.expense {
  background: var(--expense-soft);
  color: var(--expense);
}

.transaction-row:hover .icon-wrapper {
  transform: scale(1.08);
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.transaction-category {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.transaction-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.transaction-meta {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.transaction-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  min-width: 50px;
}

.transaction-amount {
  font-weight: 700;
  font-size: 1rem;
  font-family: var(--font-mono);
  min-width: 110px;
  text-align: right;
  letter-spacing: -0.01em;
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
}

.transaction-row:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  background: var(--expense-soft);
  color: var(--expense);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-6);
  color: var(--text-muted);
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--blue-light);
}

.empty-state p {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.empty-state span {
  font-size: 0.85rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 640px) {
  .transaction-meta {
    gap: var(--space-3);
  }
  .transaction-date {
    display: none;
  }
}
</style>