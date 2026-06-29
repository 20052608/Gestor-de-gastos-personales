<<<<<<< HEAD
<template>
  <div 
    class="ui-card" 
    :class="[variant, { hoverable, glow, 'has-header': $slots.header, 'has-footer': $slots.footer, 'is-loading': loading }]"
    :style="customStyle"
  >
    <div v-if="loading" class="ui-card-skeleton">
      <div class="skeleton-header">
        <div class="skeleton skeleton-circle"></div>
        <div class="skeleton skeleton-line" style="width: 60%"></div>
      </div>
      <div class="skeleton skeleton-line" style="width: 100%"></div>
      <div class="skeleton skeleton-line" style="width: 80%"></div>
      <div class="skeleton skeleton-line" style="width: 40%"></div>
    </div>

    <template v-else>
      <div v-if="$slots.header" class="ui-card-header">
        <slot name="header" />
      </div>
      <div class="ui-card-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="ui-card-footer">
        <slot name="footer" />
      </div>
    </template>
=======
<<template>
  <div class="ui-card" :class="[variant, { hoverable, glow }]">
    <div v-if="$slots.header" class="ui-card-header">
      <slot name="header" />
    </div>
    <div class="ui-card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="ui-card-footer">
      <slot name="footer" />
    </div>
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'default' },
  hoverable: { type: Boolean, default: false },
  glow: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  delay: { type: Number, default: 0 }
});

const customStyle = computed(() => {
  if (props.delay > 0) {
    return { animationDelay: `${props.delay}ms` };
  }
  return {};
=======
defineProps({
  variant: { type: String, default: 'default' },
  hoverable: { type: Boolean, default: false },
  glow: { type: Boolean, default: false }
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
});
</script>

<style scoped>
.ui-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
<<<<<<< HEAD
  position: relative;
  animation: fadeInScale 0.5s ease forwards;
  opacity: 0;
}

.ui-card.hoverable:hover {
  transform: translateY(-3px);
  border-color: var(--border-default);
  box-shadow: var(--shadow-md), 0 12px 40px rgba(0, 100, 178, 0.08);
=======
}

.ui-card.hoverable:hover {
  transform: translateY(-2px);
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
}

.ui-card.glow {
  position: relative;
}

.ui-card.glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-lg);
<<<<<<< HEAD
  background: linear-gradient(135deg, var(--blue), var(--blue-dark), var(--blue-light), var(--blue));
  background-size: 300% 300%;
  opacity: 0;
  z-index: -1;
  transition: opacity var(--transition-base);
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.ui-card.glow:hover::before {
  opacity: 0.12;
}

.ui-card.accent {
  border-left: 3px solid var(--blue);
}

.ui-card.accent-income {
  border-left: 3px solid var(--income);
}

.ui-card.accent-expense {
  border-left: 3px solid var(--expense);
}

.ui-card.accent-warning {
  border-left: 3px solid var(--warning);
}

.ui-card.elevated {
  box-shadow: var(--shadow-md);
}

.ui-card.elevated:hover {
  box-shadow: var(--shadow-lg);
}

.ui-card.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
=======
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  opacity: 0;
  z-index: -1;
  transition: opacity var(--transition-base);
}

.ui-card.glow:hover::before {
  opacity: 0.15;
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
}

.ui-card-header {
  padding: var(--space-5) var(--space-6) 0;
}

.ui-card-body {
  padding: var(--space-5) var(--space-6);
}

.ui-card-footer {
  padding: 0 var(--space-6) var(--space-5);
  border-top: 1px solid var(--border-subtle);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
}
<<<<<<< HEAD

/* Skeleton Loading */
.ui-card-skeleton {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.skeleton-circle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.skeleton-line {
  height: 14px;
  border-radius: var(--radius-sm);
}

.skeleton {
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-elevated) 50%, var(--bg-tertiary) 75%);
  background-size: 200px 100%;
  animation: skeleton 1.5s ease-in-out infinite;
}

@keyframes skeleton {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.97) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Ripple effect on click */
.ui-card {
  -webkit-tap-highlight-color: transparent;
}

.ui-card::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(43, 123, 187, 0.15);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.5s, opacity 0.5s;
}

.ui-card:active::after {
  transform: scale(2);
  opacity: 1;
  transition: 0s;
}
</style>
=======
</style>
>>>>>>> f5656afaff5a38d47f13d79ce74b0095bf391771
