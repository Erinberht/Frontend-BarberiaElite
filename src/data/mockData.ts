export interface User {
  id: string;
  nombre_usuario: string;
  contraseña: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: 'cliente' | 'empleado' | 'admin';
}

export interface Cliente {
  id: string;
  usuarioId: string;
  fechaRegistro: string;
}

export interface Empleado {
  id: string;
  usuarioId: string;
  fecha_contratacion: string;
  especialidadIds: string[];
  usuario?: User;
  especialidades?: Especialidad[];
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMinutos: number;
  especialidadIds: string[];
}

export interface Especialidad {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface AgendaEmpleado {
  id: string;
  empleadoId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export interface Cita {
  id: string;
  clienteId: string;
  fecha: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'reagendada';
  servicios: CitaServicio[];
}

export interface CitaServicio {
  id: string;
  servicioId: string;
  empleadoId: string;
  hora: string;
}

// Mock Data
export const users: User[] = [
  {
    id: '1',
    nombre_usuario: 'admin',
    contraseña: 'admin123',
    nombre: 'Carlos Administrador',
    correo: 'admin@barberiaelite.com',
    telefono: '555-0001',
    rol: 'admin'
  },
  {
    id: '2',
    nombre_usuario: 'juan.perez',
    contraseña: 'emp123',
    nombre: 'Juan Pérez',
    correo: 'juan@barberiaelite.com',
    telefono: '555-0002',
    rol: 'empleado'
  },
  {
    id: '3',
    nombre_usuario: 'maria.garcia',
    contraseña: 'emp123',
    nombre: 'María García',
    correo: 'maria@barberiaelite.com',
    telefono: '555-0003',
    rol: 'empleado'
  },
  {
    id: '4',
    nombre_usuario: 'cliente1',
    contraseña: 'cli123',
    nombre: 'Roberto Silva',
    correo: 'roberto@email.com',
    telefono: '555-0004',
    rol: 'cliente'
  }
];

export const clientes: Cliente[] = [
  {
    id: '1',
    usuarioId: '4',
    fechaRegistro: '2024-01-15'
  }
];

export const empleados: Empleado[] = [
  {
    id: '1',
    usuarioId: '2',
    fecha_contratacion: '2023-06-01',
    especialidadIds: ['1', '2']
  },
  {
    id: '2',
    usuarioId: '3',
    fecha_contratacion: '2023-08-15',
    especialidadIds: ['2', '3']
  }
];

export const especialidades: Especialidad[] = [
  {
    id: '1',
    nombre: 'Corte Clásico',
    descripcion: 'Especialista en cortes tradicionales y clásicos'
  },
  {
    id: '2',
    nombre: 'Barba y Bigote',
    descripcion: 'Experto en cuidado y estilizado de barba y bigote'
  },
  {
    id: '3',
    nombre: 'Estilismo Moderno',
    descripcion: 'Cortes y peinados modernos y vanguardistas'
  }
];

export const servicios: Servicio[] = [
  {
    id: '1',
    nombre: 'Corte de Cabello',
    descripcion: 'Corte profesional personalizado',
    precio: 25000,
    duracionMinutos: 30,
    especialidadIds: ['1', '3']
  },
  {
    id: '2',
    nombre: 'Arreglo de Barba',
    descripcion: 'Recorte y modelado de barba',
    precio: 15000,
    duracionMinutos: 20,
    especialidadIds: ['2']
  },
  {
    id: '3',
    nombre: 'Corte + Barba',
    descripcion: 'Servicio completo de corte y arreglo de barba',
    precio: 35000,
    duracionMinutos: 45,
    especialidadIds: ['1', '2', '3']
  },
  {
    id: '4',
    nombre: 'Afeitado Clásico',
    descripcion: 'Afeitado tradicional con navaja',
    precio: 20000,
    duracionMinutos: 25,
    especialidadIds: ['2']
  }
];

export const agendaEmpleados: AgendaEmpleado[] = [
  {
    id: '1',
    empleadoId: '1',
    fecha: '2024-12-20',
    horaInicio: '08:00',
    horaFin: '17:00'
  },
  {
    id: '2',
    empleadoId: '2',
    fecha: '2024-12-20',
    horaInicio: '09:00',
    horaFin: '18:00'
  }
];

export const citas: Cita[] = [
  {
    id: '1',
    clienteId: '1',
    fecha: '2024-12-20',
    estado: 'pendiente',
    servicios: [
      {
        id: '1',
        servicioId: '1',
        empleadoId: '1',
        hora: '10:00'
      }
    ]
  }
];