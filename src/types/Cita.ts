export interface Cita {
    id: string;
    clienteId: string;
    fecha: string;
    estado: 'pendiente' | 'completada' | 'cancelada' | 'reagendada';
    servicios: {
      servicioId: string;
      hora: string;
    }[];
  }