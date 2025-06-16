<template>
  <div>
    <div class="mb-8">
      <h1>Agendar Nueva Cita</h1>
      <p class="text-gray-600 mt-2">Selecciona el servicio, especialidades, barbero y horario que prefieras</p>
    </div>

    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Step 1: Select Service -->
        <div class="card">
          <h2 class="mb-4">1. Selecciona el Servicio</h2>
          <div v-if="loading.servicios" class="text-center py-4">
            <div class="flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <p class="text-gray-500 mt-2">Cargando servicios...</p>
          </div>
          <div v-else-if="error.servicios" class="text-center py-4">
            <p class="text-red-500">{{ error.servicios }}</p>
          </div>
          <div v-else-if="servicios.length === 0" class="text-center py-4">
            <p class="text-gray-500">No hay servicios disponibles en este momento.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="servicio in servicios" :key="servicio.id"
              class="p-4 border rounded-lg cursor-pointer transition-colors duration-200" :class="selectedServicio?.id === servicio.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'" @click="selectServicio(servicio)">
              <div class="flex flex-col items-start">
                <h3 class="font-medium text-gray-900 text-lg mb-2">{{ servicio.nombre || 'Sin nombre' }}</h3>
                <span class="text-xl font-semibold text-primary-600 mb-2">${{ (servicio.precio || 0).toLocaleString()
                  }}</span>
                <p class="text-sm text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ servicio.duracion_minutos || 0 }} minutos
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Specialties -->
        <div class="card">
          <h2 class="mb-4">2. Selecciona la Especialidad</h2>
          <div v-if="!selectedServicio" class="text-gray-500 text-center py-8">
            Primero selecciona un servicio
          </div>
          <div v-else class="space-y-3">
            <div v-for="especialidad in selectedServicio.especialidades" :key="especialidad.id"
              class="p-4 border rounded-lg cursor-pointer transition-colors duration-200" :class="selectedEspecialidades[0] === especialidad.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'" @click="selectOnlyEspecialidad(especialidad.id)">
              <div>
                <h3 class="font-medium text-gray-900">{{ especialidad.nombre }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ especialidad.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Select Employee -->
        <div class="card">
          <h2 class="mb-4">3. Selecciona el Barbero</h2>
          <div v-if="!selectedServicio" class="text-gray-500 text-center py-8">
            Primero selecciona un servicio
          </div>
          <div v-else-if="selectedEspecialidades.length === 0" class="text-gray-500 text-center py-8">
            Selecciona al menos una especialidad
          </div>
          <div v-else-if="empleadosDisponibles.length === 0" class="text-gray-500 text-center py-8">
            No hay barberos disponibles con la especialidad seleccionada.
          </div>
          <div v-else-if="loading.empleados" class="text-center py-4">
            <p class="text-gray-500">Cargando barberos...</p>
          </div>
          <div v-else-if="error.empleados" class="text-center py-4">
            <p class="text-red-500">{{ error.empleados }}</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="empleado in empleadosDisponibles" :key="empleado.id"
              class="p-4 border rounded-lg cursor-pointer transition-colors duration-200 flex items-center" :class="selectedEmpleado?.id === empleado.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'" @click="selectEmpleado(empleado)">
              <input type="radio" name="barbero" class="mr-3 accent-primary-600"
                :checked="selectedEmpleado?.id === empleado.id" @change.stop="selectEmpleado(empleado)" />
              <div>
                <h3 class="font-medium text-gray-900">{{ empleado.usuario?.nombre }}</h3>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="especialidad in empleado.especialidades" :key="especialidad.id"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {{ especialidad.nombre }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Select Date & Time -->
        <div class="card">
          <h2 class="mb-4">4. Selecciona Fecha y Hora</h2>
          <div v-if="!selectedEmpleado" class="text-gray-500 text-center py-8">
            Primero selecciona un barbero
          </div>
          <div v-else class="space-y-4">
            <div>
              <label class="label">Fecha</label>
              <input v-model="selectedDate" type="date" class="input-field"
                :min="fechasDisponibles.length ? fechasDisponibles[0] : undefined"
                :max="fechasDisponibles.length ? fechasDisponibles[fechasDisponibles.length - 1] : undefined"
                :disabled="!selectedEmpleado || fechasDisponibles.length === 0" @change="
                       if (!isDateAvailable(selectedDate)) {
                  error.horarios = 'Selecciona una fecha válida.';
                  selectedDate = '';
                  selectedHour = '';
                  availableHours = [];
                } else {
                  error.horarios = '';
                  loadAvailableHours();
                }
                  " />
            </div>

            <div v-if="loading.horarios" class="text-center py-4">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
              <p class="text-gray-500 mt-2">Verificando disponibilidad...</p>
            </div>
            <div v-else-if="error.horarios" class="text-center py-4">
              <p class="text-red-500">{{ error.horarios }}</p>
            </div>
            <div v-else-if="selectedDate && !availableHours.length" class="text-center py-4">
              <p class="text-gray-500">No hay horarios disponibles para esta fecha</p>
            </div>
            <div v-else-if="selectedDate && availableHours.length > 0">
              <label class="label">Hora Disponible</label>
              <select v-model="selectedHour" class="input-field w-full">
                <option value="" disabled>Selecciona una hora</option>
                <option v-for="hour in availableHours" :key="hour" :value="hour">
                  {{ hour }}
                </option>
              </select>
              <div v-if="selectedHour && error.horarios" class="text-red-500 mt-2">{{ error.horarios }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary and Booking -->
      <div v-if="canBook" class="card mt-8">
        <h2 class="mb-4">Resumen de la Cita</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Detalles del Servicio</h3>
              <p><strong>Servicio:</strong> {{ selectedServicio?.nombre }}</p>
              <p><strong>Especialidades:</strong> {{ getSelectedEspecialidadesNames }}</p>
              <p><strong>Duración:</strong> {{ selectedServicio?.duracion_minutos }} minutos</p>
              <p><strong>Precio:</strong> ${{ selectedServicio?.precio.toLocaleString() }}</p>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">Detalles de la Cita</h3>
              <p><strong>Barbero:</strong> {{ selectedEmpleado?.usuario?.nombre }}</p>
              <p><strong>Fecha:</strong> {{ formatSelectedDate }}</p>
              <p><strong>Hora:</strong> {{ selectedHour }}</p>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button @click="bookAppointment" :disabled="loading.booking || !!error.horarios" class="btn-primary">
              {{ loading.booking ? 'Agendando...' : 'Confirmar Cita' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/Auth';
import axios from 'axios';
import api from '@/composables/api';
import type { Servicio } from '@/types/Servicio';
import type { Empleado } from '../../types/Empleado';
import type { Especialidad } from '@/types/Servicio';

const router = useRouter();
const { currentUser } = useAuth();

// Estado
const servicios = ref<Servicio[]>([]);
const empleados = ref<Empleado[]>([]);
const selectedServicio = ref<Servicio | null>(null);
const selectedEspecialidades = ref<number[]>([]);
const selectedEmpleado = ref<Empleado | null>(null);
const selectedDate = ref('');
const selectedHour = ref('');
const availableHours = ref<string[]>([]);
const fechasDisponibles = ref<string[]>([]);

const loading = ref({
  servicios: true,
  empleados: false,
  horarios: false,
  booking: false
});

const error = ref({
  servicios: '',
  empleados: '',
  horarios: '',
  booking: ''
});

// Computed
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const empleadosDisponibles = computed(() => {
  if (!selectedServicio.value || selectedEspecialidades.value.length === 0) return [];

  return empleados.value.filter((empleado: Empleado) => {
    // Verificar si el empleado tiene todas las especialidades seleccionadas
    return selectedEspecialidades.value.every((especialidadId: number) =>
      empleado.especialidades.some((e: Especialidad) => e.id === especialidadId)
    );
  });
});

const canBook = computed(() => {
  return selectedServicio.value &&
    selectedEspecialidades.value.length > 0 &&
    selectedEmpleado.value &&
    selectedDate.value &&
    selectedHour.value;
});

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  return new Date(selectedDate.value).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const getSelectedEspecialidadesNames = computed(() => {
  if (!selectedServicio.value) return '';
  return selectedEspecialidades.value
    .map(id => selectedServicio.value!.especialidades.find(e => e.id === id)?.nombre)
    .filter(Boolean)
    .join(', ');
});

// Métodos
const fetchServicios = async () => {
  try {
    loading.value.servicios = true;
    error.value.servicios = '';

    // Asegurarnos de que estamos usando la URL base correcta de la API
    const response = await api.get('/servicios');

    console.log('Respuesta completa:', response);
    console.log('Tipo de datos:', typeof response.data);
    console.log('Datos recibidos:', response.data);

    // Verificar que la respuesta sea un array y tenga datos
    if (!response.data) {
      console.error('No hay datos en la respuesta');
      error.value.servicios = 'No se recibieron datos del servidor';
      return;
    }

    if (!Array.isArray(response.data)) {
      console.error('La respuesta no es un array:', response.data);
      error.value.servicios = 'Formato de datos incorrecto';
      return;
    }

    if (response.data.length === 0) {
      console.log('La lista de servicios está vacía');
      servicios.value = [];
      return;
    }

    // Validar y transformar cada servicio
    servicios.value = response.data.map(servicio => {
      console.log('Procesando servicio:', servicio);
      return {
        id: servicio.id || 0,
        nombre: servicio.nombre || 'Sin nombre',
        descripcion: servicio.descripcion || 'Sin descripción',
        precio: Number(servicio.precio) || 0,
        duracion_minutos: Number(servicio.duracion_minutos) || 0,
        especialidades: Array.isArray(servicio.especialidades)
          ? servicio.especialidades.map((e: any) => ({
            id: e.id || 0,
            nombre: e.nombre || 'Sin nombre',
            descripcion: e.descripcion || ''
          }))
          : []
      };
    });

    console.log('Servicios procesados:', servicios.value);

  } catch (err) {
    console.error('Error completo:', err);
    if (axios.isAxiosError(err)) {
      console.error('Error de Axios:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
    }
    error.value.servicios = 'Error al cargar los servicios';
  } finally {
    loading.value.servicios = false;
  }
};

const fetchEmpleados = async () => {
  try {
    loading.value.empleados = true;
    error.value.empleados = '';
    const response = await api.get('/empleados');
    empleados.value = Array.isArray(response.data) ? response.data : [];
    console.log('Empleados cargados:', empleados.value);
    console.log('Empleados con especialidades:', empleados.value.map(e => ({
      id: e.id,
      nombre: e.usuario?.nombre,
      especialidades: e.especialidades
    })));
  } catch (err) {
    error.value.empleados = 'Error al cargar los barberos';
    empleados.value = [];
    console.error('Error fetching empleados:', err);
  } finally {
    loading.value.empleados = false;
  }
};

const selectServicio = (servicio: Servicio) => {
  if (!servicio) return;

  selectedServicio.value = servicio;
  selectedEspecialidades.value = [];
  selectedEmpleado.value = null;
  selectedDate.value = '';
  selectedHour.value = '';
  availableHours.value = [];
  fetchEmpleados();
};

const selectOnlyEspecialidad = (especialidadId: number) => {
  selectedEspecialidades.value = [especialidadId];
};

const selectEmpleado = (empleado: Empleado) => {
  selectedEmpleado.value = empleado;
  selectedDate.value = '';
  selectedHour.value = '';
  availableHours.value = [];
};

const loadAvailableHours = async () => {
  if (!selectedEmpleado.value || !selectedDate.value) return;

  try {
    loading.value.horarios = true;
    error.value.horarios = '';
    selectedHour.value = ''; // Reset selected hour when date changes

    const response = await api.get(`/empleados/${selectedEmpleado.value.id}/horarios`, {
      params: {
        fecha: selectedDate.value
      }
    });

    console.log('Respuesta de horarios:', response.data);

    if (response.data.horarios) {
      availableHours.value = response.data.horarios;
      if (response.data.horarios.length === 0) {
        error.value.horarios = response.data.message || 'No hay horarios disponibles para esta fecha';
      }
    } else {
      availableHours.value = [];
      error.value.horarios = 'No se encontraron horarios disponibles';
    }

  } catch (err) {
    console.error('Error fetching horarios:', err);
    error.value.horarios = 'Error al cargar los horarios disponibles';
    availableHours.value = [];
  } finally {
    loading.value.horarios = false;
  }
};

const validateHour = async () => {
  if (!selectedEmpleado.value || !selectedDate.value || !selectedHour.value) {
    error.value.horarios = '';
    return;
  }
  try {
    error.value.horarios = '';
    // Consultar al backend si la hora está disponible
    const response = await api.get(`/empleados/${selectedEmpleado.value.id}/horarios`, {
      params: { fecha: selectedDate.value }
    });
    const available = Array.isArray(response.data.horarios)
      ? response.data.horarios
      : [];
    if (!available.includes(selectedHour.value)) {
      error.value.horarios = 'La hora ingresada no está disponible para este barbero en la fecha seleccionada.';
    } else {
      error.value.horarios = '';
    }
  } catch (err) {
    error.value.horarios = 'No se pudo validar la hora. Intenta nuevamente.';
  }
};

// Validar en tiempo real cuando cambie la hora
watch(selectedHour, () => {
  if (selectedHour.value) validateHour();
});

// Limpiar error al cambiar fecha o barbero
watch([selectedDate, selectedEmpleado], () => {
  error.value.horarios = '';
  selectedHour.value = '';
});

const bookAppointment = async () => {
  if (!canBook.value || !currentUser.value || error.value.horarios) return;
  try {
    loading.value.booking = true;
    error.value.booking = '';
    // Validar por última vez antes de enviar
    await validateHour();
    if (error.value.horarios) return;
    const citaData = {
      servicio_id: selectedServicio.value!.id,
      especialidades: selectedEspecialidades.value,
      empleado_id: selectedEmpleado.value!.id,
      fecha: selectedDate.value,
      hora: selectedHour.value
    };
    const response = await api.post('/citas', citaData);
    if (response.data) {
      router.push('/client');
    }
  } catch (err) {
    console.error('Error booking appointment:', err);
    
    // Verificar si hay un mensaje de error específico del backend
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      const errorMessage = err.response.data.error;
      
      // Mensajes personalizados según el tipo de error
      if (errorMessage.includes('se cruza con otra cita existente')) {
        alert('Error al agendar cita: Ya existe una cita en ese horario. Por favor, selecciona otro horario disponible.');
      } else if (errorMessage.includes('no está dentro de la agenda del barbero')) {
        alert('Error al agendar cita: El horario seleccionado no está disponible para este barbero.');
      } else {
        alert(`Error al agendar cita: ${errorMessage}`);
      }
    } else {
      // Mensaje genérico si no hay mensaje específico
      alert('Error al agendar la cita. Por favor, intente nuevamente.');
    }
    
    error.value.booking = 'Error al agendar la cita';
  } finally {
    loading.value.booking = false;
  }
};

const fetchFechasDisponibles = async () => {
  if (!selectedEmpleado.value) return;
  try {
    loading.value.horarios = true;
    error.value.horarios = '';
    fechasDisponibles.value = [];
    selectedDate.value = '';
    selectedHour.value = '';
    availableHours.value = [];
    const response = await api.get(`/empleados/${selectedEmpleado.value.id}/fechas-disponibles`);
    fechasDisponibles.value = response.data.fechas || [];
    if (fechasDisponibles.value.length === 0) {
      error.value.horarios = 'El barbero no tiene fechas disponibles.';
    }
  } catch (err) {
    error.value.horarios = 'Error al cargar las fechas disponibles.';
    fechasDisponibles.value = [];
  } finally {
    loading.value.horarios = false;
  }
};

// Al seleccionar barbero, cargar fechas disponibles
watch(selectedEmpleado, () => {
  fetchFechasDisponibles();
});

// Validar fecha seleccionada
const isDateAvailable = (date: string) => {
  return fechasDisponibles.value.includes(date);
};

onMounted(() => {
  fetchServicios();
});
</script>