<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gold-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-gold-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-xl">BE</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Barbería Elite</h1>
        <p class="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="label">Usuario</label>
          <input 
            v-model="username"
            type="text" 
            required
            class="input-field"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div>
          <label class="label">Contraseña</label>
          <input 
            v-model="password"
            type="password" 
            required
            class="input-field"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <button type="submit" class="w-full btn-primary">
          Iniciar Sesión
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          ¿No tienes una cuenta? 
          <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
            Regístrate aquí
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/Auth';

const router = useRouter();
const { login, userRole } = useAuth();

const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  error.value = '';

  const success = await login(username.value, password.value);

  if (success) {
    const role = userRole.value;

    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'cliente') {
      router.push('/client');
    } else if (role === 'empleado') {
      router.push('/employee');
    } else {
      error.value = 'Rol de usuario no reconocido';
    }
  } else {
    error.value = 'Usuario o contraseña incorrectos';
  }
};
</script>
