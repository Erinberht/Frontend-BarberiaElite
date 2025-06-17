<template>
  <div>
    <div class="mb-8">
      <h1>Mi Agenda</h1>
      <p class="text-gray-600 mt-2">Gestiona tus horarios disponibles</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Formulario para agregar horario -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Agregar Horario</h2>
        <form @submit.prevent="guardarHorario" class="space-y-4">
          <div>
            <label class="label">Fecha</label>
            <input 
              v-model="form.fecha" 
              type="date" 
              required 
              class="input-field"
              :min="minDate"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Hora Inicio</label>
              <input 
                v-model="form.hora_inicio" 
                type="time" 
                required 
                class="input-field"
              />
            </div>
            <div>
              <label class="label">Hora Fin</label>
              <input 
                v-model="form.hora_fin" 
                type="time" 
                required 
                class="input-field"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="btn-primary">
              Agregar Horario
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de horarios -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Horarios Programados</h2>
        
        <div v-if="loading" class="text-center py-8">
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <p class="text-gray-500 mt-2">Cargando horarios...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-500">{{ error }}</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="horario in horarios" :key="horario.id"
               class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-900">
                  {{ formatDate(horario.fecha) }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ horario.hora_inicio }} - {{ horario.hora_fin }}
                </p>
              </div>
              <button 
                @click="eliminarHorario(horario.id)"
                class="text-red-600 hover:text-red-900"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div v-if="horarios.length === 0" class="text-center py-8 text-gray-500">
            <CalendarDaysIcon class="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No tienes horarios programados</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { CalendarDaysIcon, TrashIcon } from '@heroicons/vue/24/outline';
import api from '@/composables/api';
import { useAuth } from '@/composables/Auth';

const { currentUser } = useAuth();
const loading = ref(false);
const error = ref('');
const horarios = ref<any[]>([]);

const form = reactive({
  fecha: '',
  hora_inicio: '',
  hora_fin: ''
});

// Fecha mínima (hoy)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const cargarHorarios = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await api.get('/empleado/mis-horarios', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    horarios.value = response.data;
  } catch (err) {
    console.error('Error al cargar horarios:', err);
    error.value = 'Error al cargar los horarios';
  } finally {
    loading.value = false;
  }
};

const guardarHorario = async () => {
  try {
    await api.post('/empleado/horarios', form, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    // Limpiar formulario
    form.fecha = '';
    form.hora_inicio = '';
    form.hora_fin = '';
    
    // Recargar horarios
    await cargarHorarios();
  } catch (err) {
    console.error('Error al guardar horario:', err);
    alert('Error al guardar el horario');
  }
};

const eliminarHorario = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este horario?')) return;
  
  try {
    await api.delete(`/empleado/horarios/${id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    await cargarHorarios();
  } catch (err) {
    console.error('Error al eliminar horario:', err);
    alert('Error al eliminar el horario');
  }
};

onMounted(() => {
  if (currentUser.value?.rol === 'empleado') {
    cargarHorarios();
  }
});
</script>

<style scoped>
.input-field {
  @apply rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
</style> 