<<template>
  <Card class="stat-card" :class="type" hoverable>
    <template #header>
      <div class="stat-header">
        <div class="icon-wrapper" :class="type">
          <i :class="icon"></i>
        </div>
        <div v-if="trend" class="trend" :class="trendDirection">
          <i :class="trendIcon"></i>
          <span>{{ trend }}%</span>
        </div>
      </div>
    </template>
    
    <div class="stat-content">
      <span class="stat-label">{{ label }}</span>
      <span class="stat-value" :class="type">${{ formattedValue }}</span>
    </div>
    
    <template v-if="progress !== null" #footer>
      <div class="stat-progress">
        <div class="progress-info">
          <span>{{ progressLabel }}</span>
          <span class="progress-percent">{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :class="type" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from './Card.vue';

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  type: { type: String, default: 'default' },
  icon: { type: String, default: 'fas fa-chart-line' },
  trend: { type: Number, default: null },
  trendDirection: { type: String, default: 'up' },
  progress: { type: Number, default: null },
  progressLabel: { type: String, default: '' }
});

const formattedValue = computed(() => {
  return props.value.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
});

const trendIcon = computed(() => {
  return props.trendDirection === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
});
</script>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-gradient);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card.income::before {
  background: linear-gradient(90deg, var(--income), #34d399);
}

.stat-card.expense::before {
  background: linear-gradient(90deg, var(--expense), #f87171);
}

.stat-card.balance::before {
  background: var(--accent-gradient);
  opacity: 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
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

.icon-wrapper.balance {
  background: linear-gradient(135deg, rgba(43, 123, 187, 0.15), rgba(0, 100, 178, 0.15));
  color: var(--blue);
}

.trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}

.trend.up {
  background: var(--income-soft);
  color: var(--income);
}

.trend.down {
  background: var(--expense-soft);
  color: var(--expense);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--font-mono);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.stat-value.income { color: var(--income); }
.stat-value.expense { color: var(--expense); }
.stat-value.balance {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-progress {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

.progress-percent {
  color: var(--blue);
  font-weight: 600;
}

.progress-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-fill.income { background: var(--income); }
.progress-fill.expense { background: var(--expense); }
.progress-fill.balance { background: var(--accent-gradient); }
</style>