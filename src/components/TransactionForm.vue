<template>
  <Card class="form-card" glow :delay="100">
    <template #header>
      <SectionHeader 
        title="Nueva Transacción" 
        subtitle="Registra un movimiento financiero"
        icon="fas fa-plus-circle"
        icon-variant="outline"
      />
    </template>

    <form @submit.prevent="handleSubmit" class="form-grid">
      <!-- Tipo de movimiento -->
      <div class="form-group full-width">
        <label>Tipo de movimiento</label>
        <div class="type-selector">
          <button 
            type="button"
            :class="['type-btn', { active: form.type === 'income' }]"
            @click="form.type = 'income'; resetCategory()"
          >
            <div class="type-icon income">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div class="type-info">
              <span class="type-label">Ingreso</span>
              <span class="type-desc">Dinero que recibes</span>
            </div>
            <div class="type-check">
              <i class="fas fa-check"></i>
            </div>
          </button>
          <button 
            type="button"
            :class="['type-btn', { active: form.type === 'expense' }]"
            @click="form.type = 'expense'; resetCategory()"
          >
            <div class="type-icon expense">
              <i class="fas fa-arrow-up"></i>
            </div>
            <div class="type-info">
              <span class="type-label">Gasto</span>
              <span class="type-desc">Dinero que gastas</span>
            </div>
            <div class="type-check">
              <i class="fas fa-check"></i>
            </div>
          </button>
        </div>
      </div>

      <!-- Monto -->
      <div class="form-group">
        <label>
          Monto
          <span v-if="form.amount" class="amount-preview" :class="form.type">
            = ${{ Number(form.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}
          </span>
        </label>
        <div class="amount-input" :class="{ 'has-value': form.amount }">
          <span class="currency">$</span>
          <input 
            v-model.number="form.amount" 
            type="number" 
            min="0.01" 
            step="0.01" 
            placeholder="0.00"
            required 
            class="input"
          />
          <div class="amount-glow" :class="form.type"></div>
        </div>
      </div>

      <!-- Categoría -->
      <div class="form-group">
        <label>Categoría</label>
        <div class="select-wrapper">
          <select v-model="form.category" class="input select" required>
            <option value="" disabled>Selecciona una categoría</option>
            <option v-for="cat in filteredCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <div class="select-icon">
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <!-- Fecha -->
      <div class="form-group">
        <label>Fecha</label>
        <div class="date-input-wrapper">
          <input v-model="form.date" type="date" class="input" required />
          <div class="date-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
        </div>
      </div>

      <!-- Descripción -->
      <div class="form-group full-width">
        <label>
          Descripción
          <span class="optional">(opcional)</span>
          <span v-if="form.description" class="char-count">{{ form.description.length }}/100</span>
        </label>
        <input 
          v-model="form.description" 
          type="text" 
          class="input"
          maxlength="100"
          placeholder="Ej: Compra supermercado, Pago nómina..."
        />
      </div>

      <!-- Submit -->
      <button 
        type="submit" 
        class="btn btn-primary full-width"
        :class="{ 'btn-income': form.type === 'income', 'btn-expense': form.type === 'expense' }"
        :disabled="!isValid"
      >
        <div class="btn-icon">
          <i :class="form.type === 'income' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
        </div>
        <span>Guardar {{ form.type === 'income' ? 'Ingreso' : 'Gasto' }}</span>
        <div class="btn-shine"></div>
      </button>
    </form>
  </Card>
</template>

<script setup>
import { reactive, computed } from 'vue';
import Card from './ui/Card.vue';
import SectionHeader from './ui/SectionHeader.vue';

const emit = defineEmits(['add']);

const today = new Date().toISOString().split('T')[0];

const form = reactive({
  type: 'expense',
  category: '',
  amount: '',
  date: today,
  description: ''
});

const incomeCategories = ['Salario', 'Freelance', 'Inversiones', 'Otros Ingresos'];
const expenseCategories = ['Vivienda', 'Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Otros'];

const filteredCategories = computed(() => {
  return form.type === 'income' ? incomeCategories : expenseCategories;
});

const isValid = computed(() => {
  return form.amount > 0 && form.category && form.date;
});

const resetCategory = () => {
  form.category = '';
};

const handleSubmit = () => {
  if (!isValid.value) return;
  emit('add', { ...form });
  form.amount = '';
  form.description = '';
  form.category = '';
};
</script>

<style scoped>
.form-card {
  margin-bottom: var(--space-6);
  border: 1px solid var(--border-default);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.optional {
  color: var(--text-muted);
  font-weight: 400;
  text-transform: none;
  font-size: 0.75rem;
}

.char-count {
  margin-left: auto;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: none;
}

.amount-preview {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
}

.amount-preview.income { color: var(--income); }
.amount-preview.expense { color: var(--expense); }

/* Type Selector */
.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.type-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-subtle);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.type-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.type-btn:hover {
  border-color: var(--blue-light);
  color: var(--blue);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.type-btn.active {
  background: linear-gradient(135deg, rgba(43, 123, 187, 0.06), rgba(0, 100, 178, 0.06));
  border-color: var(--blue);
  color: var(--blue-dark);
  box-shadow: 0 4px 16px rgba(43, 123, 187, 0.12);
}

.type-btn.active.income {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(5, 150, 105, 0.04));
  border-color: var(--income);
  color: var(--income);
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.12);
}

.type-btn.active.expense {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(220, 38, 38, 0.04));
  border-color: var(--expense);
  color: var(--expense);
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.12);
}

.type-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.type-icon.income {
  background: var(--income-soft);
  color: var(--income);
}

.type-icon.expense {
  background: var(--expense-soft);
  color: var(--expense);
}

.type-btn.active .type-icon.income {
  background: var(--income);
  color: white;
  box-shadow: 0 4px 12px var(--income-glow);
  animation: bounceIn 0.4s ease;
}

.type-btn.active .type-icon.expense {
  background: var(--expense);
  color: white;
  box-shadow: 0 4px 12px var(--expense-glow);
  animation: bounceIn 0.4s ease;
}

.type-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex: 1;
}

.type-label {
  font-weight: 700;
  font-size: 0.95rem;
}

.type-desc {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
  text-transform: none;
  letter-spacing: 0;
}

.type-check {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all var(--transition-fast);
  opacity: 0;
  transform: scale(0.5);
}

.type-btn.active .type-check {
  opacity: 1;
  transform: scale(1);
  background: var(--blue);
  color: white;
}

.type-btn.active.income .type-check {
  background: var(--income);
}

.type-btn.active.expense .type-check {
  background: var(--expense);
}

/* Amount Input */
.amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input .currency {
  position: absolute;
  left: var(--space-4);
  color: var(--blue-medium);
  font-weight: 700;
  font-size: 1.2rem;
  z-index: 1;
}

.amount-input input {
  padding-left: 2.2rem;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.amount-input.has-value input {
  color: var(--text-primary);
}

.amount-input.has-value.income input {
  color: var(--income);
}

.amount-input.has-value.expense input {
  color: var(--expense);
}

.amount-glow {
  position: absolute;
  inset: -2px;
  border-radius: var(--radius-md);
  opacity: 0;
  transition: opacity var(--transition-fast);
  pointer-events: none;
  z-index: -1;
}

.amount-input:focus-within .amount-glow {
  opacity: 1;
}

.amount-glow.income {
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}

.amount-glow.expense {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
}

.select-wrapper .select {
  padding-right: 3rem;
  background-image: none;
}

.select-icon {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--blue-medium);
  pointer-events: none;
  font-size: 0.8rem;
}

/* Date Input */
.date-input-wrapper {
  position: relative;
}

.date-input-wrapper input {
  padding-right: 3rem;
}

.date-icon {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--blue-medium);
  pointer-events: none;
  font-size: 0.9rem;
}

/* Submit Button */
.btn.full-width {
  grid-column: 1 / -1;
  padding: var(--space-4) var(--space-6);
  font-size: 1rem;
  margin-top: var(--space-2);
  position: relative;
  overflow: hidden;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: all var(--transition-fast);
}

.btn:hover .btn-icon {
  transform: scale(1.1) rotate(-8deg);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn:hover .btn-shine {
  left: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:disabled .btn-shine {
  display: none;
}

.btn-income {
  background: linear-gradient(135deg, #059669, #10b981) !important;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3) !important;
}

.btn-expense {
  background: linear-gradient(135deg, #DC2626, #ef4444) !important;
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3) !important;
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .type-selector {
    grid-template-columns: 1fr;
  }

  .type-btn {
    padding: var(--space-3) var(--space-4);
  }
}
</style>

