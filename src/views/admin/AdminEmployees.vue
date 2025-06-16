<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1>Gestión de Empleados</h1>
        <p class="text-gray-600 mt-2">Administra los empleados y sus especialidades</p>
      </div>
      <button @click="openModal()" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Nuevo Empleado
      </button>
    </div>

    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Contratación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidades
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="empleado in empleadosList" :key="empleado.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-1">
                    <div class="text-sm font-medium text-gray-900">
                      {{ empleado.usuario?.nombre ?? 'Sin nombre' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ empleado.usuario?.nombre_usuario ?? 'Sin usuario' }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ empleado.usuario?.correo ?? 'Sin correo' }}</div>
                <div class="text-sm text-gray-500">{{ empleado.usuario?.telefono ?? 'Sin teléfono' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(empleado.fecha_contratacion) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="especialidad in empleado.especialidades" 
                        :key="especialidad.id"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {{ especialidad.nombre }}
                  </span>
                  <span v-if="!empleado.especialidades?.length" class="text-sm text-gray-500">
                    Sin especialidades
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="openModal(empleado)" class="text-indigo-600 hover:text-indigo-900">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="openEspecialidadesModal(empleado)" class="text-green-600 hover:text-green-900">
                    <TagIcon class="w-4 h-4" />
                  </button>
                  <button @click="deleteEmpleado(empleado.id)" class="text-red-600 hover:text-red-900">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado' }}
          </h3>

          <form @submit.prevent="saveEmpleado" class="space-y-4">
            <div>
              <label class="label">Nombre Completo</label>
              <input v-model="form.nombre" type="text" required class="input-field" />
            </div>

            <div>
              <label class="label">Usuario</label>
              <input v-model="form.nombreUsuario" type="text" required class="input-field" />
            </div>

            <div>
              <label class="label">Contraseña</label>
              <input v-model="form.contraseña" type="password" required class="input-field" />
            </div>

            <div>
              <label class="label">Correo Electrónico</label>
              <input v-model="form.correo" type="email" required class="input-field" />
            </div>

            <div>
              <label class="label">Teléfono</label>
              <input v-model="form.telefono" type="text" required class="input-field" />
            </div>

            <div>
              <label class="label">Fecha de Contratación</label>
              <input v-model="form.fecha_contratacion" type="date" required class="input-field" />
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ editingEmpleado ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Especialidades -->
    <div v-if="showEspecialidadesModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Gestionar Especialidades - {{ empleadoSeleccionado?.usuario?.nombre }}
          </h3>
          
          <div class="space-y-4">
            <div v-for="especialidad in especialidades" :key="especialidad.id" class="flex items-center">
              <input
                type="checkbox"
                :id="'especialidad-' + especialidad.id"
                v-model="especialidadesSeleccionadas"
                :value="especialidad.id"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              >
              <label :for="'especialidad-' + especialidad.id" class="ml-2 block text-sm text-gray-900">
                {{ especialidad.nombre }}
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button @click="closeEspecialidadesModal" class="btn-secondary">
              Cancelar
            </button>
            <button @click="guardarEspecialidades" class="btn-primary">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { type Empleado } from '@/data/mockData';
import { PlusIcon, PencilIcon, TrashIcon, TagIcon } from '@heroicons/vue/24/outline';
import api from '@/composables/api';
import type { AxiosError } from 'axios';
import { useAuth } from '@/composables/Auth';

const { currentUser } = useAuth();

interface EmpleadoPayload {
  nombre: string;
  nombre_usuario: string;
  correo: string;
  telefono: string;
  fecha_contratacion: string;
  rol: 'empleado' | 'admin' | 'cliente';
  password?: string;
  password_confirmation?: string;
}

const empleadosList = ref<any[]>([]);
const showModal = ref(false);
const editingEmpleado = ref<any | null>(null);
const showEspecialidadesModal = ref(false);
const empleadoSeleccionado = ref<any>(null);
const especialidadesSeleccionadas = ref<number[]>([]);
const especialidades = ref<any[]>([]);

const form = reactive({
  nombre: '',
  nombreUsuario: '',
  contraseña: '',
  correo: '',
  telefono: '',
  fecha_contratacion: '',
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES');
};

const formatDateForInput = (date: string) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const fetchEspecialidades = async () => {
  try {
    const res = await api.get('/especialidades', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    especialidades.value = res.data;
  } catch (err) {
    console.error('Error al cargar especialidades:', err);
  }
};

const fetchEmpleados = async () => {
  try {
    const res = await api.get('/admin/empleados', { 
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    empleadosList.value = res.data.empleados || res.data;
    console.log('Empleados cargados:', empleadosList.value);
  } catch (err) {
    console.error('Error al cargar empleados:', err);
  }
};

onMounted(() => {
  if (currentUser.value?.rol === 'admin') {
    fetchEmpleados();
    fetchEspecialidades();
  }
});

const openModal = (empleado?: Empleado) => {
  if (empleado) {
    editingEmpleado.value = empleado;
    const user = empleado.usuario;
    if (user) {
      form.nombre = user.nombre;
      form.nombreUsuario = user.nombre_usuario;
      form.correo = user.correo;
      form.telefono = user.telefono;
    }
    form.fecha_contratacion = formatDateForInput(empleado.fecha_contratacion);
  } else {
    editingEmpleado.value = null;
    resetForm();
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingEmpleado.value = null;
  resetForm();
};

const resetForm = () => {
  form.nombre = '';
  form.nombreUsuario = '';
  form.contraseña = '';
  form.correo = '';
  form.telefono = '';
  form.fecha_contratacion = '';
};

const saveEmpleado = async () => {
  try {
    const payload: EmpleadoPayload = {
      nombre: form.nombre,
      nombre_usuario: form.nombreUsuario,
      correo: form.correo,
      telefono: form.telefono,
      fecha_contratacion: form.fecha_contratacion,
      rol: 'empleado'
    };

    if (!editingEmpleado.value) {
      payload.password = form.contraseña;
      payload.password_confirmation = form.contraseña;
    }

    const headers = {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    };

    if (editingEmpleado.value) {
      await api.put(`/empleados/${editingEmpleado.value.id}`, payload, { 
        withCredentials: true,
        headers
      });
    } else {
      await api.post('/empleados', payload, { 
        withCredentials: true,
        headers
      });
    }

    await fetchEmpleados();
    closeModal();
  } catch (err: unknown) {
    if ((err as AxiosError).response?.status === 422) {
      console.error('Errores de validación:', (err as AxiosError).response?.data);
      alert('Errores de validación:\n' + JSON.stringify((err as AxiosError).response?.data, null, 2));
    } else {
      console.error('Error al guardar empleado:', err);
    }
  }
};

const deleteEmpleado = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
    try {
      await api.delete(`/empleados/${id}`, { 
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      await fetchEmpleados();
    } catch (err) {
      console.error('Error al eliminar empleado:', err);
    }
  }
};

const openEspecialidadesModal = (empleado: any) => {
  empleadoSeleccionado.value = empleado;
  especialidadesSeleccionadas.value = empleado.especialidades?.map((e: any) => e.id) || [];
  showEspecialidadesModal.value = true;
};

const closeEspecialidadesModal = () => {
  showEspecialidadesModal.value = false;
  empleadoSeleccionado.value = null;
  especialidadesSeleccionadas.value = [];
};

const guardarEspecialidades = async () => {
  if (!empleadoSeleccionado.value) return;

  try {
    await api.post(`/empleados/${empleadoSeleccionado.value.id}/especialidades`, {
      especialidades: especialidadesSeleccionadas.value
    }, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    await fetchEmpleados();
    closeEspecialidadesModal();
  } catch (err) {
    console.error('Error al guardar especialidades:', err);
  }
};
</script>