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
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  hoverable: { type: Boolean, default: false },
  glow: { type: Boolean, default: false }
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
}

.ui-card.hoverable:hover {
  transform: translateY(-2px);
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
}

.ui-card.glow {
  position: relative;
}

.ui-card.glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  opacity: 0;
  z-index: -1;
  transition: opacity var(--transition-base);
}

.ui-card.glow:hover::before {
  opacity: 0.15;
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
</style>