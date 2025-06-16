<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1>Gestión de Servicios</h1>
        <p class="text-gray-600 mt-2">Administra los servicios disponibles</p>
      </div>
      <button @click="openModal()" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Nuevo Servicio
      </button>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div class="card">
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="servicio in serviciosList" :key="servicio.id" 
             class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
              <ScissorsIcon class="w-6 h-6 text-gold-600" />
            </div>
            <div class="flex space-x-1">
              <button @click="openEspecialidadesModal(servicio)" class="text-blue-600 hover:text-blue-900 p-1">
                <TagIcon class="w-4 h-4" />
              </button>
              <button @click="openModal(servicio)" class="text-indigo-600 hover:text-indigo-900 p-1">
                <PencilIcon class="w-4 h-4" />
              </button>
              <button @click="deleteServicio(servicio.id)" class="text-red-600 hover:text-red-900 p-1">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ servicio.nombre }}</h3>
          <div class="space-y-1">
            <p class="text-gold-600 font-medium">{{ formatPrecio(servicio.precio) }}</p>
            <p class="text-gray-600 text-sm">Duración: {{ formatDuracion(servicio.duracion_minutos) }}</p>
            <div class="mt-2">
              <div class="flex flex-wrap gap-1">
                <span v-for="especialidad in servicio.especialidades" :key="especialidad.id"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ especialidad.nombre }}
                </span>
                <span v-if="!servicio.especialidades?.length" class="text-gray-500 text-xs">
                  Sin especialidades
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Especialidades -->
    <div v-if="showEspecialidadesModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Especialidades de {{ selectedServicio?.nombre }}
          </h3>
          
          <form @submit.prevent="saveEspecialidades" class="space-y-4">
            <div class="space-y-2">
              <label class="label">Selecciona las especialidades</label>
              <div class="space-y-2 max-h-60 overflow-y-auto">
                <label v-for="especialidad in especialidadesList" :key="especialidad.id" 
                       class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" 
                         :value="especialidad.id"
                         v-model="especialidadesForm.especialidades"
                         class="rounded text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm">{{ especialidad.nombre }}</span>
                </label>
              </div>
            </div>

            <div v-if="error" class="p-2 bg-red-100 text-red-700 rounded text-sm">
              {{ error }}
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <button type="button" @click="closeEspecialidadesModal" class="btn-secondary" :disabled="loading">
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="loading">
                <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingServicio ? 'Editar Servicio' : 'Nuevo Servicio' }}
          </h3>
          
          <form @submit.prevent="saveServicio" class="space-y-4">
            <div>
              <label class="label">Nombre</label>
              <input v-model="form.nombre" type="text" required class="input-field" />
            </div>

            <div>
              <label class="label">Precio</label>
              <input v-model="form.precio" type="number" step="0.01" min="0" required class="input-field" />
            </div>

            <div>
              <label class="label">Duración (minutos)</label>
              <input v-model="form.duracion_minutos" type="number" min="1" required class="input-field" />
            </div>

            <div v-if="error" class="p-2 bg-red-100 text-red-700 rounded text-sm">
              {{ error }}
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary" :disabled="loading">
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="loading">
                <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ editingServicio ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import api from '@/composables/api';
import { PlusIcon, PencilIcon, TrashIcon, ScissorsIcon, TagIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '@/composables/Auth';
import type { AxiosError } from 'axios';

const { currentUser } = useAuth();

interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  duracion_minutos: number;
  especialidades?: Especialidad[];
}

interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

const serviciosList = ref<Servicio[]>([]);
const especialidadesList = ref<Especialidad[]>([]);
const showModal = ref(false);
const showEspecialidadesModal = ref(false);
const editingServicio = ref<Servicio | null>(null);
const selectedServicio = ref<Servicio | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  nombre: '',
  precio: '',
  duracion_minutos: ''
});

const especialidadesForm = reactive({
  especialidades: [] as number[]
});

const fetchServicios = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('/servicios', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    serviciosList.value = res.data;
  } catch (err) {
    console.error('Error al cargar servicios:', err);
    error.value = 'Error al cargar los servicios';
  } finally {
    loading.value = false;
  }
};

const fetchEspecialidades = async () => {
  try {
    const res = await api.get('/especialidades', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    especialidadesList.value = res.data;
  } catch (err) {
    console.error('Error al cargar especialidades:', err);
    error.value = 'Error al cargar las especialidades';
  }
};

onMounted(() => {
  if (currentUser.value?.rol === 'admin') {
    fetchServicios();
    fetchEspecialidades();
  }
});

const openModal = (servicio?: Servicio) => {
  if (servicio) {
    editingServicio.value = servicio;
    form.nombre = servicio.nombre;
    form.precio = servicio.precio.toString();
    form.duracion_minutos = servicio.duracion_minutos.toString();
  } else {
    editingServicio.value = null;
    resetForm();
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingServicio.value = null;
  resetForm();
  error.value = null;
};

const resetForm = () => {
  form.nombre = '';
  form.precio = '';
  form.duracion_minutos = '';
};

const saveServicio = async () => {
  loading.value = true;
  error.value = null;
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    };

    const data = {
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      duracion_minutos: parseInt(form.duracion_minutos)
    };

    if (editingServicio.value) {
      await api.put(`/servicios/${editingServicio.value.id}`, data, {
        withCredentials: true,
        headers
      });
    } else {
      await api.post('/servicios', data, {
        withCredentials: true,
        headers
      });
    }
    await fetchServicios();
    closeModal();
  } catch (err: unknown) {
    if ((err as AxiosError).response?.status === 422) {
      console.error('Errores de validación:', (err as AxiosError).response?.data);
      error.value = 'Errores de validación:\n' + JSON.stringify((err as AxiosError).response?.data, null, 2);
    } else {
      console.error('Error al guardar servicio:', err);
      error.value = 'Error al guardar el servicio';
    }
  } finally {
    loading.value = false;
  }
};

const deleteServicio = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/servicios/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      await fetchServicios();
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      error.value = 'Error al eliminar el servicio';
    } finally {
      loading.value = false;
    }
  }
};

const openEspecialidadesModal = (servicio: Servicio) => {
  selectedServicio.value = servicio;
  especialidadesForm.especialidades = servicio.especialidades?.map(e => e.id) || [];
  showEspecialidadesModal.value = true;
};

const closeEspecialidadesModal = () => {
  showEspecialidadesModal.value = false;
  selectedServicio.value = null;
  especialidadesForm.especialidades = [];
  error.value = null;
};

const saveEspecialidades = async () => {
  if (!selectedServicio.value) return;
  
  loading.value = true;
  error.value = null;
  try {
    await api.post(`/servicios/${selectedServicio.value.id}/especialidades`, {
      especialidades: especialidadesForm.especialidades
    }, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    await fetchServicios();
    closeEspecialidadesModal();
  } catch (err: unknown) {
    if ((err as AxiosError).response?.status === 422) {
      console.error('Errores de validación:', (err as AxiosError).response?.data);
      error.value = 'Errores de validación:\n' + JSON.stringify((err as AxiosError).response?.data, null, 2);
    } else {
      console.error('Error al guardar especialidades:', err);
      error.value = 'Error al guardar las especialidades';
    }
  } finally {
    loading.value = false;
  }
};

const formatPrecio = (precio: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(precio);
};

const formatDuracion = (minutos: number) => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  if (horas > 0) {
    return `${horas}h ${mins}min`;
  }
  return `${mins}min`;
};
</script>