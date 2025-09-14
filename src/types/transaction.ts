export interface Transaction {
  id?: string; // ID generado automáticamente por Firestore
  userId: string; // ID del usuario que hace la transacción
  amount: number; // Monto de la transacción
  type: "income" | "expense"; // Tipo: ingreso o gasto
  description: string; // Descripción de la transacción
  category: string; // Categoría de la transacción (ejemplo: "Comida", "Transporte", etc.)
  day: number; // Día del mes (1-31)
  month: string; // Mes en formato YYYY-MM (ejemplo: "2025-09")
  date: Date; // Fecha completa de la transacción
  createdAt: Date; // Fecha en que se registró en el sistema
}
