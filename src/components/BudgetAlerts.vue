<<<<<<< HEAD
<template>
=======
<<template>
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  <div v-if="alerts.length > 0" class="alerts-section">
    <SectionHeader 
      title="Alertas de Presupuesto" 
      :subtitle="`${alerts.length} categorías superaron el límite mensual`"
      icon="fas fa-exclamation-triangle"
<<<<<<< HEAD
      icon-variant="warning"
      badge="Urgente"
      badge-variant="warning"
      divider
    />

=======
    />
    
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
    <div class="alerts-grid">
      <Card 
        v-for="(alert, index) in alerts" 
        :key="alert.category"
        class="alert-card"
<<<<<<< HEAD
        variant="accent-expense"
        :delay="index * 100"
=======
        :style="{ animationDelay: `${index * 100}ms` }"
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
      >
        <div class="alert-top">
          <div class="alert-category">
            <div class="alert-icon">
              <i :class="getCategoryIcon(alert.category)"></i>
            </div>
<<<<<<< HEAD
            <div class="alert-info">
              <span class="alert-name">{{ alert.category }}</span>
              <span class="alert-status">Presupuesto excedido</span>
            </div>
          </div>
          <div class="alert-badge">
            <span class="alert-percentage">{{ alert.percentage }}%</span>
          </div>
        </div>

=======
            <span>{{ alert.category }}</span>
          </div>
          <span class="alert-percentage">{{ alert.percentage }}%</span>
        </div>
        
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
        <div class="alert-progress">
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ width: Math.min(alert.percentage, 100) + '%' }"
<<<<<<< HEAD
            >
              <div class="progress-pulse"></div>
            </div>
          </div>
          <div class="progress-labels">
            <span>0%</span>
            <span class="progress-limit">Límite: 100%</span>
            <span>{{ alert.percentage }}%</span>
          </div>
        </div>

        <div class="alert-details">
          <div class="detail">
            <div class="detail-icon">
              <i class="fas fa-wallet"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Gastado</span>
              <span class="detail-value expense">${{ alert.spent.toLocaleString() }}</span>
            </div>
          </div>
          <div class="detail">
            <div class="detail-icon budget-icon">
              <i class="fas fa-bullseye"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Presupuesto</span>
              <span class="detail-value">${{ alert.budget.toLocaleString() }}</span>
            </div>
          </div>
          <div class="detail highlight">
            <div class="detail-icon warning-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="detail-content">
              <span class="detail-label">Exceso</span>
              <span class="detail-value warning">+${{ (alert.spent - alert.budget).toLocaleString() }}</span>
            </div>
=======
            ></div>
          </div>
        </div>
        
        <div class="alert-details">
          <div class="detail">
            <span class="detail-label">Gastado</span>
            <span class="detail-value expense">${{ alert.spent.toLocaleString() }}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Presupuesto</span>
            <span class="detail-value">${{ alert.budget.toLocaleString() }}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Exceso</span>
            <span class="detail-value warning">+${{ (alert.spent - alert.budget).toLocaleString() }}</span>
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Card from './ui/Card.vue';
import SectionHeader from './ui/SectionHeader.vue';

defineProps({
  alerts: { type: Array, required: true }
});

const categoryIcons = {
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
</script>

<style scoped>
.alerts-section {
  margin-bottom: var(--space-6);
<<<<<<< HEAD
  animation: slideDown 0.5s ease;
=======
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
}

.alerts-grid {
  display: grid;
<<<<<<< HEAD
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
=======
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  gap: var(--space-4);
}

.alert-card {
<<<<<<< HEAD
  position: relative;
  overflow: hidden;
  animation: fadeInScale 0.5s ease forwards;
  opacity: 0;
=======
  border-left: 3px solid var(--expense);
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
}

.alert-card::after {
  content: '';
  position: absolute;
<<<<<<< HEAD
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.04) 0%, transparent 70%);
=======
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 70%);
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  pointer-events: none;
}

.alert-top {
  display: flex;
  justify-content: space-between;
<<<<<<< HEAD
  align-items: flex-start;
=======
  align-items: center;
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  margin-bottom: var(--space-4);
}

.alert-category {
  display: flex;
  align-items: center;
  gap: var(--space-3);
<<<<<<< HEAD
}

.alert-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(220, 38, 38, 0.08));
  color: var(--expense);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
}

.alert-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alert-name {
  font-weight: 700;
=======
  font-weight: 600;
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  color: var(--text-primary);
  font-size: 1rem;
}

<<<<<<< HEAD
.alert-status {
  font-size: 0.75rem;
  color: var(--expense);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.alert-badge {
  padding: var(--space-1) var(--space-3);
  background: var(--expense-soft);
  border-radius: var(--radius-full);
  border: 1px solid rgba(220, 38, 38, 0.15);
}

.alert-percentage {
  color: var(--expense);
  font-size: 0.9rem;
  font-weight: 800;
=======
.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--expense-soft);
  color: var(--expense);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.alert-percentage {
  background: var(--expense-soft);
  color: var(--expense);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  font-family: var(--font-mono);
}

.alert-progress {
  margin-bottom: var(--space-4);
}

.progress-track {
<<<<<<< HEAD
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
=======
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--warning), var(--expense));
  border-radius: var(--radius-full);
<<<<<<< HEAD
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 0 12px rgba(220, 38, 38, 0.2);
}

.progress-pulse {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-2);
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
}

.progress-limit {
  color: var(--expense);
  font-weight: 600;
=======
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
}

.alert-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
<<<<<<< HEAD
  padding-top: var(--space-4);
=======
  padding-top: var(--space-3);
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  border-top: 1px solid var(--border-subtle);
}

.detail {
  display: flex;
<<<<<<< HEAD
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.detail:hover {
  background: var(--bg-tertiary);
}

.detail.highlight {
  background: var(--warning-soft);
  border: 1px solid rgba(217, 119, 6, 0.1);
}

.detail.highlight:hover {
  background: rgba(217, 119, 6, 0.15);
}

.detail-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.detail-icon.budget-icon {
  color: var(--blue);
  background: rgba(43, 123, 187, 0.1);
}

.detail-icon.warning-icon {
  color: var(--warning);
  background: var(--warning-soft);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
=======
  flex-direction: column;
  gap: 4px;
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 700;
  font-family: var(--font-mono);
}

.detail-value.expense { color: var(--expense); }
.detail-value.warning { color: var(--warning); }

<<<<<<< HEAD
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (max-width: 640px) {
  .alerts-grid {
    grid-template-columns: 1fr;
  }
  .alert-details {
    grid-template-columns: 1fr;
  }
}
</style>
=======
@keyframes slideIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
