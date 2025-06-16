<template>
  <div>
    <div class="mb-8">
      <h1>Bienvenido, {{ currentUser?.nombre }}</h1>
      <p class="text-gray-600 mt-2">Gestiona tus citas y servicios</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card text-center">
        <CalendarDaysIcon class="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Próxima Cita</h3>
        <p class="text-gray-600">{{ proximaCita ? formatDate(proximaCita.fecha) : 'No tienes citas programadas' }}</p>
        <router-link to="/client/book" class="btn-primary mt-4 inline-block">
          Agendar Nueva Cita
        </router-link>
      </div>

      <div class="card text-center">
        <ClipboardDocumentListIcon class="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Citas Realizadas</h3>
        <p class="text-2xl font-bold text-green-600">{{ citasCompletadas.length }}</p>
        <p class="text-gray-600">Total de servicios</p>
      </div>
    </div>

    <div class="card">
      <h2 class="mb-6">Mis Citas</h2>
      <div v-if="loading" class="text-center py-4">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        <p class="text-gray-500 mt-2">Cargando citas...</p>
      </div>
      <div v-else-if="error" class="text-center py-4">
        <p class="text-red-500">{{ error }}</p>
      </div>
      <div v-else-if="misCitas.length === 0" class="text-center py-8">
        <p class="text-gray-500">No tienes citas registradas</p>
        <router-link to="/client/book" class="btn-primary mt-4 inline-block">
          Agendar tu primera cita
        </router-link>
      </div>
      <div v-else class="space-y-4">
        <div v-for="cita in misCitas" :key="cita.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 text-lg">
                {{ getServiciosNames(cita.servicios) }}
              </h3>
              <div class="mt-2 space-y-1">
                <p class="text-sm text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(cita.fecha) }}
                </p>
                <p class="text-sm text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ cita.hora || cita.servicios[0]?.pivot?.hora || 'Hora no especificada' }}
                </p>
                <p class="text-sm text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Barbero: {{ cita.empleado?.usuario?.nombre || 'No asignado' }}
                </p>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="getStatusClasses(cita.estado)">
                {{ getStatusLabel(cita.estado) }}
              </span>
              <button v-if="cita.estado === 'pendiente'" @click="cancelarCita(cita.id)"
                class="text-red-600 hover:text-red-900 text-sm font-medium">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/Auth';
import api from '@/composables/api';
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline';

const { currentUser } = useAuth();
const misCitas = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

const fetchCitas = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await api.get('/cliente/citas');
    console.log('Respuesta del backend:', response.data);
    misCitas.value = Array.isArray(response.data) ? response.data : [];
    console.log('Citas asignadas:', misCitas.value);
  } catch (err) {
    error.value = 'Error al cargar las citas';
    console.error('Error fetching citas:', err);
    misCitas.value = [];
  } finally {
    loading.value = false;
  }
};

const proximaCita = computed(() => {
  const today = new Date();
  return misCitas.value.find(c =>
    new Date(c.fecha) >= today && c.estado === 'pendiente'
  );
});

const citasCompletadas = computed(() =>
  misCitas.value.filter(c => c.estado === 'completada')
);

const getServiciosNames = (citaServicios: any[]) => {
  if (!citaServicios || citaServicios.length === 0) return 'Sin servicio';
  return citaServicios.map(servicio => servicio.nombre || servicio.servicio?.nombre || 'Servicio').join(', ');
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

const cancelarCita = async (citaId: string) => {
  if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
    try {
      await api.put(`/citas/${citaId}/cancelar`);
      await fetchCitas(); // Recargar las citas después de cancelar
    } catch (err) {
      console.error('Error al cancelar la cita:', err);
      alert('Error al cancelar la cita. Por favor, intente nuevamente.');
    }
  }
};

onMounted(() => {
  fetchCitas();
});
</script>