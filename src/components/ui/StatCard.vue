<template>
  <Card class="stat-card" :class="[type, { 'is-positive': isPositive, 'is-negative': isNegative, 'is-neutral': isNeutral }]" hoverable :delay="delay">
    <template #header>
      <div class="stat-header">
        <div class="icon-wrapper" :class="type">
          <i :class="icon"></i>
        </div>
        <div v-if="trend !== null" class="trend" :class="trendDirection">
          <i :class="trendIcon"></i>
          <span>{{ trend }}%</span>
        </div>
      </div>
    </template>

    <div class="stat-content">
      <span class="stat-label">{{ label }}</span>
      <span class="stat-value" :class="type">
        <span class="currency">$</span>
        <span class="amount">{{ formattedValue }}</span>
      </span>
      <div v-if="sparklineData.length > 0" class="sparkline">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient :id="sparkId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="sparkColor" stop-opacity="0.3"/>
              <stop offset="100%" :stop-color="sparkColor" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path :d="sparkAreaPath" :fill="`url(#${sparkId})`" />
          <path :d="sparkLinePath" fill="none" :stroke="sparkColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <circle v-for="(point, i) in sparkPoints" :key="i" :cx="point.x" :cy="point.y" r="1.5" :fill="sparkColor" opacity="0.6" />
        </svg>
      </div>
    </div>

    <template v-if="progress !== null" #footer>
      <div class="stat-progress">
        <div class="progress-info">
          <span>{{ progressLabel }}</span>
          <span class="progress-percent">{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :class="type" :style="{ width: progress + '%' }">
            <div class="progress-shimmer"></div>
          </div>
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
  progressLabel: { type: String, default: '' },
  sparklineData: { type: Array, default: () => [] },
  delay: { type: Number, default: 0 }
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

const isPositive = computed(() => props.type === 'income' || (props.type === 'balance' && props.value >= 0));
const isNegative = computed(() => props.type === 'expense' || (props.type === 'balance' && props.value < 0));
const isNeutral = computed(() => !isPositive.value && !isNegative.value);

const sparkId = computed(() => `spark-${Math.random().toString(36).substr(2, 9)}`);
const sparkColor = computed(() => {
  if (props.type === 'income') return '#059669';
  if (props.type === 'expense') return '#DC2626';
  return '#2B7BBB';
});

const sparkPoints = computed(() => {
  if (props.sparklineData.length === 0) return [];
  const max = Math.max(...props.sparklineData);
  const min = Math.min(...props.sparklineData);
  const range = max - min || 1;
  return props.sparklineData.map((val, i) => ({
    x: (i / (props.sparklineData.length - 1)) * 100,
    y: 30 - ((val - min) / range) * 25 - 2.5
  }));
});

const sparkLinePath = computed(() => {
  if (sparkPoints.value.length === 0) return '';
  return sparkPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
});

const sparkAreaPath = computed(() => {
  if (sparkPoints.value.length === 0) return '';
  const points = sparkPoints.value.map(p => `${p.x} ${p.y}`).join(' L ');
  return `M ${sparkPoints.value[0].x} 30 L ${points} L ${sparkPoints.value[sparkPoints.value.length - 1].x} 30 Z`;
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
}

.stat-card.is-positive::before {
  background: linear-gradient(90deg, #059669, #34d399);
}

.stat-card.is-negative::before {
  background: linear-gradient(90deg, #DC2626, #f87171);
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
  position: relative;
  overflow: hidden;
}

.icon-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%);
}

.icon-wrapper.income {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(5, 150, 105, 0.08));
  color: var(--income);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
}

.icon-wrapper.expense {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(220, 38, 38, 0.08));
  color: var(--expense);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.icon-wrapper.balance {
  background: linear-gradient(135deg, rgba(43, 123, 187, 0.15), rgba(0, 100, 178, 0.08));
  color: var(--blue);
  box-shadow: 0 4px 12px rgba(43, 123, 187, 0.15);
}

.icon-wrapper.default {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(148, 163, 184, 0.08));
  color: var(--text-muted);
}

.stat-card:hover .icon-wrapper {
  transform: scale(1.08) rotate(-4deg);
}

.trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  animation: countUp 0.5s ease forwards;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--font-mono);
  letter-spacing: -0.03em;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 2px;
  animation: countUp 0.6s ease forwards;
}

.stat-value .currency {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.7;
}

.stat-value .amount {
  font-variant-numeric: tabular-nums;
}

.stat-value.income { color: var(--income); }
.stat-value.expense { color: var(--expense); }
.stat-value.balance {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.is-negative {
  color: var(--expense);
}

.sparkline {
  margin-top: var(--space-3);
  height: 30px;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.stat-card:hover .sparkline {
  opacity: 1;
}

.sparkline svg {
  width: 100%;
  height: 100%;
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
  font-family: var(--font-mono);
}

.progress-bar {
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

.progress-fill.income { background: linear-gradient(90deg, var(--income), #34d399); }
.progress-fill.expense { background: linear-gradient(90deg, var(--expense), #f87171); }
.progress-fill.balance { background: var(--accent-gradient); }

@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
