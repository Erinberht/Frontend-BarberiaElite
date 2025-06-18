<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1>Mi Agenda - {{ currentUser?.nombre }}</h1>
          <p class="text-gray-600 mt-2">Gestiona tus citas del día</p>
        </div>
        <router-link 
          to="/empleado/agenda" 
          class="btn-primary flex items-center"
        >
          <CalendarDaysIcon class="w-5 h-5 mr-2" />
          Gestionar Horarios
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card text-center">
        <CalendarDaysIcon class="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Citas Hoy</h3>
        <p class="text-2xl font-bold text-primary-600">{{ citasHoy.length }}</p>
      </div>

      <div class="card text-center">
        <ClockIcon class="w-12 h-12 text-yellow-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Pendientes</h3>
        <p class="text-2xl font-bold text-yellow-600">{{ citasPendientes.length }}</p>
      </div>

      <div class="card text-center">
        <CheckCircleIcon class="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Completadas</h3>
        <p class="text-2xl font-bold text-green-600">{{ citasCompletadas.length }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h2>Citas - {{ formatDate(fechaSeleccionada) }}</h2>
            <input v-model="fechaSeleccionada" 
                   type="date" 
                   class="input-field w-auto"
                   @change="loadCitasPorFecha" />
          </div>

          <div v-if="loading" class="text-center py-8">
            <div class="flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <p class="text-gray-500 mt-2">Cargando citas...</p>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <p class="text-red-500">{{ error }}</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="cita in citasDelDia" :key="cita.id"
                 class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-lg font-medium text-gray-900">
                      {{ cita.hora || cita.servicios[0]?.pivot?.hora || 'Sin hora' }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusClasses(cita.estado)">
                      {{ getStatusLabel(cita.estado) }}
                    </span>
                  </div>
                  
                  <p class="font-medium text-gray-900 mb-1">
                    Cliente: {{ cita.cliente?.usuario?.nombre || 'Sin nombre' }}
                  </p>
                  <p class="text-sm text-gray-600 mb-2">
                    {{ getServiciosNames(cita.servicios) }}
                  </p>
                  
                  <div class="flex items-center text-sm text-gray-500">
                    <ClockIcon class="w-4 h-4 mr-1" />
                    {{ getTotalDuration(cita.servicios) }} min
                    <CurrencyDollarIcon class="w-4 h-4 ml-4 mr-1" />
                    ${{ getTotalPrice(cita.servicios).toLocaleString() }}
                  </div>
                </div>

                <div class="flex flex-col space-y-2 ml-4" v-if="cita.estado === 'pendiente'">
                  <button @click="completarCita(cita.id)" 
                          class="btn-primary text-sm py-1 px-3">
                    Completar
                  </button>
                  <button @click="reagendarCita(cita.id)" 
                          class="btn-secondary text-sm py-1 px-3">
                    Reagendar
                  </button>
                </div>
              </div>
            </div>

            <div v-if="citasDelDia.length === 0" class="text-center py-12 text-gray-500">
              <CalendarDaysIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No tienes citas programadas para este día</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card">
          <h2 class="mb-4">Estadísticas del Mes</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Citas Completadas:</span>
              <span class="font-medium">{{ estadisticasMes.citasCompletadas }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Reagendamiento -->
    <div v-if="showReagendarModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Reagendar Cita</h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nueva Fecha</label>
            <input 
              type="date" 
              v-model="nuevaFecha" 
              class="input-field w-full"
              :min="minDate"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              @click="showReagendarModal = false"
              class="btn-secondary px-4 py-2"
            >
              Cancelar
            </button>
            <button 
              @click="confirmarReagendar"
              class="btn-primary px-4 py-2"
              :disabled="!nuevaFecha"
            >
              Confirmar
            </button>
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
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline';

const { currentUser } = useAuth();

const fechaSeleccionada = ref(new Date().toISOString().split('T')[0]);
const citasDelDia = ref<any[]>([]);
const todasLasCitas = ref<any[]>([]);
const loading = ref(false);
const error = ref('');

// Nuevas variables para el modal de reagendamiento
const showReagendarModal = ref(false);
const nuevaFecha = ref('');
const citaSeleccionada = ref<number | null>(null);

// Computed para la fecha mínima (hoy)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Cargar citas del empleado
const loadCitas = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Obtener las citas del empleado autenticado
    const response = await api.get('/empleado/mis-citas');
    todasLasCitas.value = response.data;
    
    loadCitasPorFecha();
  } catch (err) {
    console.error('Error cargando citas:', err);
    error.value = 'Error al cargar las citas';
  } finally {
    loading.value = false;
  }
};

const loadCitasPorFecha = () => {
  citasDelDia.value = todasLasCitas.value.filter(cita => 
    cita.fecha === fechaSeleccionada.value
  ).sort((a, b) => {
    const horaA = a.hora || a.servicios[0]?.pivot?.hora || '00:00';
    const horaB = b.hora || b.servicios[0]?.pivot?.hora || '00:00';
    return horaA.localeCompare(horaB);
  });
};

const citasHoy = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return todasLasCitas.value.filter(cita => cita.fecha === today);
});

const citasPendientes = computed(() => 
  todasLasCitas.value.filter(c => c.estado === 'pendiente')
);

const citasCompletadas = computed(() => 
  todasLasCitas.value.filter(c => c.estado === 'completada')
);

const estadisticasMes = computed(() => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const citasMes = todasLasCitas.value.filter(cita => {
    // Crear fecha local evitando problema de zona horaria
    const [year, month, day] = cita.fecha.split('-');
    const citaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return citaDate.getMonth() === currentMonth && 
           citaDate.getFullYear() === currentYear &&
           cita.estado === 'completada';
  });
  
  return {
    citasCompletadas: citasMes.length
  };
});

const getServiciosNames = (servicios: any[]) => {
  if (!servicios || servicios.length === 0) return 'Sin servicio';
  return servicios.map(s => s.nombre || 'Servicio').join(', ');
};

const getTotalDuration = (servicios: any[]) => {
  if (!servicios) return 0;
  return servicios.reduce((total, s) => total + (s.duracion_minutos || 0), 0);
};

const getTotalPrice = (servicios: any[]) => {
  if (!servicios) return 0;
  return servicios.reduce((total, s) => total + (parseFloat(s.precio) || 0), 0);
};

const formatDate = (date: string) => {
  // Crear fecha local evitando el problema de zona horaria
  const [year, month, day] = date.split('-');
  const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return localDate.toLocaleDateString('es-ES', {
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

const completarCita = async (citaId: number) => {
  try {
    await api.put(`/citas/${citaId}`, { estado: 'completada' });
    await loadCitas();
    alert('Cita marcada como completada');
  } catch (err) {
    console.error('Error al completar cita:', err);
    alert('Error al completar la cita');
  }
};

const reagendarCita = (citaId: number) => {
  citaSeleccionada.value = citaId;
  nuevaFecha.value = '';
  showReagendarModal.value = true;
};

const confirmarReagendar = async () => {
  if (!citaSeleccionada.value || !nuevaFecha.value) return;
  
  try {
    await api.put(`/citas/${citaSeleccionada.value}`, { 
      fecha: nuevaFecha.value, 
      estado: 'reagendada' 
    });
    await loadCitas();
    showReagendarModal.value = false;
    alert('Cita reagendada correctamente');
  } catch (err) {
    console.error('Error al reagendar cita:', err);
    alert('Error al reagendar la cita');
  }
};

onMounted(async () => {
  await loadCitas();
});
</script>

<style scoped>
.input-field {
  @apply rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
</style>