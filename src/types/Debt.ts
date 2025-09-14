// src/types/Debt.ts
export interface Debt {
  id?: string;
  nombre: string; // Nombre de la deuda (Ej: Tarjeta de crédito)
  descripcion: string; // Detalle opcional
  montoTotal: number; // Monto total adeudado
  montoPagado: number; // Cuánto has pagado
  fechaInicio: string; // Fecha en que adquiriste la deuda
  fechaLimite: string; // Fecha límite de pago
  historial: {
    fecha: string;
    cambio: number; // Pago realizado (+)
    comentario: string;
  }[];
}
