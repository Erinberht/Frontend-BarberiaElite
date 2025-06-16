<template>
  <div>
    <div class="mb-8">
      <h1>Panel de Administración</h1>
      <p class="text-gray-600 mt-2">Gestiona tu barbería desde aquí</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ScissorsIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Servicios</p>
            <p class="text-2xl font-semibold text-gray-900">{{ servicios.length }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Empleados</p>
            <p class="text-2xl font-semibold text-gray-900">{{ empleados.length }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
            <AcademicCapIcon class="w-6 h-6 text-gold-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Especialidades</p>
            <p class="text-2xl font-semibold text-gray-900">{{ especialidades.length }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CalendarDaysIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Citas Hoy</p>
            <p class="text-2xl font-semibold text-gray-900">{{ citasHoy.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card">
        <h2 class="mb-4">Citas Recientes</h2>
        <div class="space-y-4">
          <div v-for="cita in citasRecientes" :key="cita.id" 
               class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">{{ getClienteName(cita.clienteId) }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(cita.fecha) }}</p>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClasses(cita.estado)">
              {{ getStatusLabel(cita.estado) }}
            </span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="mb-4">Acciones Rápidas</h2>
        <div class="space-y-3">
          <router-link to="/admin/services" 
                       class="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
            <ScissorsIcon class="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p class="font-medium text-primary-900">Gestionar Servicios</p>
              <p class="text-sm text-primary-600">Crear, editar y eliminar servicios</p>
            </div>
          </router-link>

          <router-link to="/admin/employees" 
                       class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <UserGroupIcon class="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p class="font-medium text-green-900">Gestionar Empleados</p>
              <p class="text-sm text-green-600">Administrar empleados y horarios</p>
            </div>
          </router-link>

          <router-link to="/admin/specialties" 
                       class="flex items-center p-4 bg-gold-50 rounded-lg hover:bg-gold-100 transition-colors duration-200">
            <AcademicCapIcon class="w-6 h-6 text-gold-600 mr-3" />
            <div>
              <p class="font-medium text-gold-900">Gestionar Especialidades</p>
              <p class="text-sm text-gold-600">Crear y editar especialidades</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { servicios, empleados, especialidades, citas, clientes, users } from '@/data/mockData';
import { 
  ScissorsIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline';

const today = new Date().toISOString().split('T')[0];

const citasHoy = computed(() => 
  citas.filter(cita => cita.fecha === today)
);

const citasRecientes = computed(() => 
  citas.slice(0, 5)
);

const getClienteName = (clienteId: string) => {
  const cliente = clientes.find(c => c.id === clienteId);
  if (cliente) {
    const user = users.find(u => u.id === cliente.usuarioId);
    return user?.nombre || 'Cliente';
  }
  return 'Cliente';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'completada':
      return 'bg-green-100 text-green-800';
    case 'cancelada':
      return 'bg-red-100 text-red-800';
    case 'reagendada':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pendiente':
      return 'Pendiente';
    case 'completada':
      return 'Completada';
    case 'cancelada':
      return 'Cancelada';
    case 'reagendada':
      return 'Reagendada';
    default:
      return status;
  }
};
</script>