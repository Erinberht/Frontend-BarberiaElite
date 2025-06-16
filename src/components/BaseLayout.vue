<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-gold-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">BE</span>
              </div>
              <span class="text-xl font-bold text-gray-900">Barbería Elite</span>
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">{{ currentUser?.nombre }}</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="roleClasses">
                  {{ roleLabel }}
                </span>
              </div>
              <button @click="handleLogout" class="btn-secondary">
                Cerrar Sesión
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="btn-primary">
                Iniciar Sesión
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <aside v-if="isAuthenticated && showSidebar" 
             class="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-64px)]">
        <nav class="p-4 space-y-2">
          <template v-if="userRole === 'admin'">
            <router-link v-for="item in adminNavItems" :key="item.name"
                         :to="item.path"
                         class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                         :class="$route.path === item.path 
                           ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                           : 'text-gray-700 hover:bg-gray-50'">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </router-link>
          </template>

          <template v-if="userRole === 'cliente'">
            <router-link v-for="item in clientNavItems" :key="item.name"
                         :to="item.path"
                         class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                         :class="$route.path === item.path 
                           ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                           : 'text-gray-700 hover:bg-gray-50'">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </router-link>
          </template>

          <template v-if="userRole === 'empleado'">
            <router-link v-for="item in employeeNavItems" :key="item.name"
                         :to="item.path"
                         class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                         :class="$route.path === item.path 
                           ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                           : 'text-gray-700 hover:bg-gray-50'">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </router-link>
          </template>
        </nav>
      </aside>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/Auth';
import { 
  HomeIcon, 
  ScissorsIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const { currentUser, userRole, logout } = useAuth();
const isAuthenticated = computed(() => !!currentUser.value);

const showSidebar = computed(() => {
  return isAuthenticated.value && ['/login', '/'].indexOf(router.currentRoute.value.path) === -1;
});

const roleClasses = computed(() => {
  switch (userRole.value) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'empleado':
      return 'bg-blue-100 text-blue-800';
    case 'cliente':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

const roleLabel = computed(() => {
  switch (userRole.value) {
    case 'admin':
      return 'Administrador';
    case 'empleado':
      return 'Empleado';
    case 'cliente':
      return 'Cliente';
    default:
      return '';
  }
});

const adminNavItems = [
  { name: 'Dashboard', path: '/admin', icon: HomeIcon },
  { name: 'Servicios', path: '/admin/services', icon: ScissorsIcon },
  { name: 'Empleados', path: '/admin/employees', icon: UserGroupIcon },
  { name: 'Especialidades', path: '/admin/specialties', icon: AcademicCapIcon }
];

const clientNavItems = [
  { name: 'Mi Panel', path: '/client', icon: HomeIcon },
  { name: 'Agendar Cita', path: '/client/book', icon: CalendarDaysIcon }
];

const employeeNavItems = [
  { name: 'Mi Agenda', path: '/employee', icon: CalendarDaysIcon },
];

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>