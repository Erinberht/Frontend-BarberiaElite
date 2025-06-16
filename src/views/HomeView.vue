<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gold-600">
    <div class="relative">
      <!-- Navigation -->
      <nav class="relative z-10 bg-transparent">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">BE</span>
                </div>
                <span class="text-xl font-bold text-white">Barbería Elite</span>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <template v-if="isAuthenticated">
                <span class="text-white/90">Hola, {{ currentUser?.nombre }}</span>
                <button @click="goToDashboard" class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
                  Ir al Panel
                </button>
                <button @click="handleLogout" class="bg-white text-primary-900 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Cerrar Sesión
                </button>
              </template>
              <template v-else>
                <router-link to="/login" class="bg-white text-primary-900 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Iniciar Sesión
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
              Barbería <span class="text-gold-400">Elite</span>
            </h1>
            <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              La experiencia de barbería más exclusiva. Cortes de clase mundial, 
              servicio premium y atención personalizada para el hombre moderno.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link to="/login" class="bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105">
                Agendar Cita
              </router-link>
              <a href="#services" class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div id="services" class="bg-white py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos una gama completa de servicios de barbería con los más altos estándares de calidad
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="service in servicios" :key="service.id" 
               class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-gold-500 rounded-lg flex items-center justify-center mb-4">
              <ScissorsIcon class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ service.nombre }}</h3>
            <p class="text-gray-600 mb-4">{{ service.descripcion }}</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-primary-600">${{ service.precio.toLocaleString() }}</span>
              <span class="text-sm text-gray-500">{{ service.duracionMinutos }} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-gray-50 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">¿Por qué Elegir Barbería Elite?</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Barberos Expertos</h3>
            <p class="text-gray-600">Nuestro equipo cuenta con años de experiencia y formación especializada</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDaysIcon class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Reservas Online</h3>
            <p class="text-gray-600">Sistema de reservas 24/7 para tu comodidad</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AcademicCapIcon class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Ambiente Premium</h3>
            <p class="text-gray-600">Un espacio diseñado para tu relajación y comodidad</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/Auth';
import { servicios } from '@/data/mockData';
import { 
  ScissorsIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const router = useRouter();
const { currentUser, userRole, logout } = useAuth();
const isAuthenticated = computed(() => !!currentUser.value);

const goToDashboard = () => {
  const role = userRole.value;
  if (role === 'admin') {
    router.push('/admin');
  } else if (role === 'cliente') {
    router.push('/client');
  } else if (role === 'empleado') {
    router.push('/employee');
  }
};

const handleLogout = () => {
  logout();
  router.push('/');
};
</script>