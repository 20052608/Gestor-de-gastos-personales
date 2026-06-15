<<template>
  <div v-if="alerts.length > 0" class="alerts-section">
    <SectionHeader 
      title="Alertas de Presupuesto" 
      :subtitle="`${alerts.length} categorías superaron el límite mensual`"
      icon="fas fa-exclamation-triangle"
    />
    
    <div class="alerts-grid">
      <Card 
        v-for="(alert, index) in alerts" 
        :key="alert.category"
        class="alert-card"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="alert-top">
          <div class="alert-category">
            <div class="alert-icon">
              <i :class="getCategoryIcon(alert.category)"></i>
            </div>
            <span>{{ alert.category }}</span>
          </div>
          <span class="alert-percentage">{{ alert.percentage }}%</span>
        </div>
        
        <div class="alert-progress">
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ width: Math.min(alert.percentage, 100) + '%' }"
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
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}

.alert-card {
  border-left: 3px solid var(--expense);
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
}

.alert-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.alert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.alert-category {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

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
  font-family: var(--font-mono);
}

.alert-progress {
  margin-bottom: var(--space-4);
}

.progress-track {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--warning), var(--expense));
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
}

.alert-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

@keyframes slideIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>