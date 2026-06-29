cat > README.md << 'EOF'
#  FinTrack Pro

**Clon Básico de Gestor de Gastos Personales**

Proyecto académico — Sexto Semestre, Lenguaje de Programación.

---

## Descripción

Aplicación web de finanzas personales donde el usuario registra ingresos y gastos por categoría, visualiza su balance mensual y recibe alertas cuando supera un presupuesto definido.

---

## Tecnologías

- Vue 3 + Vite
- Chart.js
- CSS puro

---

##  Equipo y División de Tareas

| Miembro | Rol | Responsabilidades |
|---------|-----|-------------------|
| **TUTILLO CEDEÑO KARLA ISABEL** | UI/UX Designer | Sistema de diseño CSS, componentes base (Card, StatCard, SectionHeader), paleta de colores, tipografía |
| **PIGUAVE TELLO ANISTON ISMAIL** | Frontend Developer | Formularios, lista de transacciones, alertas, responsive design, interacciones de usuario |
| **MENDEZ CAMPAÑA ALEXIS ADRIAN** | Data Engineer | Store de estado, datos de prueba, lógica de agregaciones, exportación CSV, filtros |
| **CHAVEZ VERGARA DANIELA NATHALY** | Chart & Integration Developer | Gráficas interactivas (Pie, Bar, Line), Dashboard principal, documentación técnica |

---

##  Fases del Proyecto

- [x] Fase 1: Propuesta y diseño
- [x] Fase 2: Desarrollo
- [x ] Fase 3: Pruebas
- [ x] Fase 4: Entrega

---

##  Estructura del Proyecto

src/
├── components/
│   ├── ui/           # Card, StatCard, SectionHeader (Karla)
│   ├── charts/       # PieChart, BarChart, LineChart (Daniela)
│   ├── TransactionForm.vue (Aniston)
│   ├── TransactionList.vue (Aniston)
│   └── BudgetAlerts.vue (Aniston)
├── views/
│   └── Dashboard.vue (Daniela)
├── stores/
│   └── financeStore.js (Alexis)
├── data/
│   └── sampleData.js (Alexis)
├── styles/
│   └── design-system.css (Karla)
