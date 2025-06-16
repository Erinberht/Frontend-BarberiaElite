export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion_minutos: number;
    especialidades: Especialidad[];
}

export interface Especialidad {
    id: number;
    nombre: string;
    descripcion: string;
}