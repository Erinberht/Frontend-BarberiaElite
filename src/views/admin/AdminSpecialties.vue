<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1>Gestión de Especialidades</h1>
        <p class="text-gray-600 mt-2">Administra las especialidades disponibles</p>
      </div>
      <button @click="openModal()" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Nueva Especialidad
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
        <div v-for="especialidad in especialidadesList" :key="especialidad.id" 
             class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
              <AcademicCapIcon class="w-6 h-6 text-gold-600" />
            </div>
            <div class="flex space-x-1">
              <button @click="openModal(especialidad)" class="text-indigo-600 hover:text-indigo-900 p-1">
                <PencilIcon class="w-4 h-4" />
              </button>
              <button @click="deleteEspecialidad(especialidad.id)" class="text-red-600 hover:text-red-900 p-1">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ especialidad.nombre }}</h3>
          <p class="text-gray-600 text-sm">{{ especialidad.descripcion || 'Sin descripción' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad' }}
          </h3>
          
          <form @submit.prevent="saveEspecialidad" class="space-y-4">
            <div>
              <label class="label">Nombre</label>
              <input v-model="form.nombre" type="text" required class="input-field" />
            </div>

            <div>
              <label class="label">Descripción</label>
              <textarea v-model="form.descripcion" class="input-field" rows="3"></textarea>
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
                {{ editingEspecialidad ? 'Actualizar' : 'Crear' }}
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
import { PlusIcon, PencilIcon, TrashIcon, AcademicCapIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '@/composables/Auth';
import type { AxiosError } from 'axios';

const { currentUser } = useAuth();

interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

const especialidadesList = ref<Especialidad[]>([]);
const showModal = ref(false);
const editingEspecialidad = ref<Especialidad | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  nombre: '',
  descripcion: ''
});

const fetchEspecialidades = async () => {
  loading.value = true;
  error.value = null;
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
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (currentUser.value?.rol === 'admin') {
    fetchEspecialidades();
  }
});

const openModal = (especialidad?: Especialidad) => {
  if (especialidad) {
    editingEspecialidad.value = especialidad;
    form.nombre = especialidad.nombre;
    form.descripcion = especialidad.descripcion || '';
  } else {
    editingEspecialidad.value = null;
    resetForm();
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingEspecialidad.value = null;
  resetForm();
  error.value = null;
};

const resetForm = () => {
  form.nombre = '';
  form.descripcion = '';
};

const saveEspecialidad = async () => {
  loading.value = true;
  error.value = null;
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    };

    if (editingEspecialidad.value) {
      await api.put(`/especialidades/${editingEspecialidad.value.id}`, {
        nombre: form.nombre,
        descripcion: form.descripcion
      }, {
        withCredentials: true,
        headers
      });
    } else {
      await api.post('/especialidades', {
        nombre: form.nombre,
        descripcion: form.descripcion
      }, {
        withCredentials: true,
        headers
      });
    }
    await fetchEspecialidades();
    closeModal();
  } catch (err: unknown) {
    if ((err as AxiosError).response?.status === 422) {
      console.error('Errores de validación:', (err as AxiosError).response?.data);
      error.value = 'Errores de validación:\n' + JSON.stringify((err as AxiosError).response?.data, null, 2);
    } else {
      console.error('Error al guardar especialidad:', err);
      error.value = 'Error al guardar la especialidad';
    }
  } finally {
    loading.value = false;
  }
};

const deleteEspecialidad = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta especialidad?')) {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/especialidades/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      await fetchEspecialidades();
    } catch (err) {
      console.error('Error al eliminar especialidad:', err);
      error.value = 'Error al eliminar la especialidad';
    } finally {
      loading.value = false;
    }
  }
};
</script>