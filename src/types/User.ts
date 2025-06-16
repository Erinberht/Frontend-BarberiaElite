export interface User {
  id: number;
  nombre_usuario: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: 'cliente' | 'empleado' | 'admin';
} 