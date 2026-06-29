<template>
  <div class="section-header" :class="{ 'with-divider': divider, 'compact': compact, 'centered': centered }">
    <div class="section-title">
      <div v-if="icon" class="section-icon" :class="iconVariant">
        <i :class="icon"></i>
      </div>
      <div class="section-text">
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
        <div v-if="badge" class="section-badge" :class="badgeVariant">
          <span class="badge-dot"></span>
          {{ badge }}
        </div>
      </div>
    </div>
    <div v-if="$slots.actions" class="section-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconVariant: { type: String, default: 'default' },
  badge: { type: String, default: '' },
  badgeVariant: { type: String, default: 'default' },
  divider: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  centered: { type: Boolean, default: false }
});
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
  animation: slideIn 0.4s ease forwards;
}

.section-header.with-divider {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}

.section-header.compact {
  margin-bottom: var(--space-3);
}

.section-header.compact .section-title h2 {
  font-size: 1.1rem;
}

.section-header.compact .section-icon {
  width: 32px;
  height: 32px;
  font-size: 0.8rem;
}

.section-header.centered {
  justify-content: center;
  text-align: center;
}

.section-header.centered .section-title {
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(43, 123, 187, 0.25);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.section-icon:hover {
  transform: scale(1.05) rotate(-3deg);
  box-shadow: 0 4px 16px rgba(43, 123, 187, 0.35);
}

.section-icon.income {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.25);
}

.section-icon.expense {
  background: linear-gradient(135deg, #DC2626, #ef4444);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.section-icon.warning {
  background: linear-gradient(135deg, #D97706, #f59e0b);
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);
}

.section-icon.outline {
  background: transparent;
  border: 2px solid var(--blue);
  color: var(--blue);
  box-shadow: none;
}

.section-icon.outline:hover {
  background: var(--blue);
  color: white;
}

.section-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-title h2 {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.section-title p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 2px;
  font-weight: 500;
}

.section-actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: var(--space-1);
  width: fit-content;
}

.section-badge.default {
  background: var(--blue-soft, rgba(43, 123, 187, 0.12));
  color: var(--blue);
}

.section-badge.income {
  background: var(--income-soft);
  color: var(--income);
}

.section-badge.expense {
  background: var(--expense-soft);
  color: var(--expense);
}

.section-badge.warning {
  background: var(--warning-soft);
  color: var(--warning);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: currentColor;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .section-header.centered {
    align-items: center;
  }

  .section-actions {
    width: 100%;
  }

  .section-actions :deep(.btn) {
    flex: 1;
  }
}
</style>
