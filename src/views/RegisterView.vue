<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gold-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-gold-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-xl">BE</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
        <p class="text-gray-600 mt-2">Regístrate para agendar tus citas</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="label">Nombre Completo</label>
          <input 
            v-model="form.nombre"
            type="text" 
            required
            class="input-field"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label class="label">Nombre de Usuario</label>
          <input 
            v-model="form.nombre_usuario"
            type="text" 
            required
            class="input-field"
            placeholder="juanperez"
          />
        </div>

        <div>
          <label class="label">Correo Electrónico</label>
          <input 
            v-model="form.correo"
            type="email" 
            required
            class="input-field"
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div>
          <label class="label">Teléfono</label>
          <input 
            v-model="form.telefono"
            type="tel" 
            required
            class="input-field"
            placeholder="3001234567"
          />
        </div>

        <div>
          <label class="label">Contraseña</label>
          <input 
            v-model="form.password"
            type="password" 
            required
            minlength="6"
            class="input-field"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label class="label">Confirmar Contraseña</label>
          <input 
            v-model="form.password_confirmation"
            type="password" 
            required
            minlength="6"
            class="input-field"
            placeholder="Repite tu contraseña"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="w-full btn-primary">
          {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          ¿Ya tienes una cuenta? 
          <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
            Inicia sesión aquí
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/composables/api';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = reactive({
  nombre: '',
  nombre_usuario: '',
  correo: '',
  telefono: '',
  password: '',
  password_confirmation: ''
});

const handleRegister = async () => {
  error.value = '';
  
  // Validar que las contraseñas coincidan
  if (form.password !== form.password_confirmation) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  loading.value = true;

  try {
    // Registrar el usuario
    const response = await api.post('/register', {
      ...form,
      rol: 'cliente' // Siempre registramos como cliente
    });

    if (response.data.message) {
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      router.push('/login');
    }
  } catch (err: any) {
    console.error('Error al registrar:', err);
    
    if (err.response?.data?.errors) {
      // Manejar errores de validación de Laravel
      const errors = err.response.data.errors;
      const firstError = Object.values(errors)[0];
      error.value = Array.isArray(firstError) ? firstError[0] : firstError;
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Error al crear la cuenta. Por favor, intenta nuevamente.';
    }
  } finally {
    loading.value = false;
  }
};
</script> 