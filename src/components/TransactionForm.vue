<<template>
  <Card class="form-card" glow>
    <template #header>
      <SectionHeader 
        title="Nueva Transacción" 
        subtitle="Registra un movimiento financiero"
        icon="fas fa-plus"
      />
    </template>
    
    <form @submit.prevent="handleSubmit" class="form-grid">
      <div class="form-group">
        <label>Tipo de movimiento</label>
        <div class="type-selector">
          <button 
            type="button"
            :class="['type-btn', { active: form.type === 'income' }]"
            @click="form.type = 'income'"
          >
            <div class="type-icon income">
              <i class="fas fa-arrow-down"></i>
            </div>
            <span>Ingreso</span>
          </button>
          <button 
            type="button"
            :class="['type-btn', { active: form.type === 'expense' }]"
            @click="form.type = 'expense'"
          >
            <div class="type-icon expense">
              <i class="fas fa-arrow-up"></i>
            </div>
            <span>Gasto</span>
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <label>Monto</label>
        <div class="amount-input">
          <span class="currency">$</span>
          <input 
            v-model.number="form.amount" 
            type="number" 
            min="0.01" 
            step="0.01" 
            placeholder="0.00"
            required 
          />
        </div>
      </div>
      
      <div class="form-group">
        <label>Categoría</label>
        <select v-model="form.category" class="input select" required>
          <option v-for="cat in filteredCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Fecha</label>
        <input v-model="form.date" type="date" class="input" required />
      </div>
      
      <div class="form-group full-width">
        <label>Descripción <span class="optional">(opcional)</span></label>
        <input 
          v-model="form.description" 
          type="text" 
          class="input"
          placeholder="Ej: Compra supermercado, Pago nómina..."
        />
      </div>
      
      <button type="submit" class="btn btn-primary full-width">
        <i class="fas fa-check"></i>
        Guardar Transacción
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
  category: 'Alimentación',
  amount: '',
  date: today,
  description: ''
});

const incomeCategories = ['Salario', 'Freelance', 'Inversiones', 'Otros Ingresos'];
const expenseCategories = ['Vivienda', 'Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Otros'];

const filteredCategories = computed(() => {
  return form.type === 'income' ? incomeCategories : expenseCategories;
});

const handleSubmit = () => {
  emit('add', { ...form });
  form.amount = '';
  form.description = '';
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
}

.optional {
  color: var(--text-muted);
  font-weight: 400;
  text-transform: none;
}

.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-subtle);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.type-btn:hover {
  border-color: var(--blue-light);
  color: var(--blue);
}

.type-btn.active {
  background: linear-gradient(135deg, rgba(43, 123, 187, 0.08), rgba(0, 100, 178, 0.08));
  border-color: var(--blue);
  color: var(--blue-dark);
}

.type-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
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
}

.type-btn.active .type-icon.expense {
  background: var(--expense);
  color: white;
  box-shadow: 0 4px 12px var(--expense-glow);
}

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
  font-size: 1.1rem;
}

.amount-input input {
  padding-left: 2.2rem;
  font-size: 1.15rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.btn.full-width {
  grid-column: 1 / -1;
  padding: var(--space-4);
  font-size: 1rem;
  margin-top: var(--space-2);
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>