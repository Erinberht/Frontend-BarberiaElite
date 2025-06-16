import type { Especialidad } from './Servicio';
import type { User } from './User';

export interface Empleado {
  id: number;
  usuario_id: number;
  fecha_contratacion: string;
  usuario: User;
  especialidades: Especialidad[];
} 