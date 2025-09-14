interface Saving {
  id?: string; // ID generado automáticamente por Firestore
  userId: string; // UID del usuario
  objetivo: string;
  descripcion: string;
  montoObjetivo: number;
  montoAhorrado: number;
  fechaInicio: string; // yyyy-MM-dd
  fechaObjetivo: string; // yyyy-MM-dd
  creadoEn: any; // serverTimestamp()
  actualizadoEn: any; // serverTimestamp()
  historial: {
    fecha: string;
    cambio: number;
    comentario: string;
    id?: string;
  }[];
}
export type { Saving };
