import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';

// Función utilitaria para verificar autenticación y rol desde localStorage
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

const getUserRole = (): string | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).rol : null;
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'Register',
      // @ts-ignore
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/services',
      name: 'AdminServices',
      component: () => import('@/views/admin/AdminServices.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/employees',
      name: 'AdminEmployees',
      component: () => import('@/views/admin/AdminEmployees.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/specialties',
      name: 'AdminSpecialties',
      component: () => import('@/views/admin/AdminSpecialties.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/client',
      name: 'ClientDashboard',
      component: () => import('@/views/client/ClientDashboard.vue'),
      meta: { requiresAuth: true, role: 'cliente' },
    },
    {
      path: '/client/book',
      name: 'BookAppointment',
      component: () => import('@/views/client/BookAppointment.vue'),
      meta: { requiresAuth: true, role: 'cliente' },
    },
    {
      path: '/employee',
      name: 'EmployeeDashboard',
      component: () => import('@/views/employee/EmployeeDashboard.vue'),
      meta: { requiresAuth: true, role: 'empleado' },
    },
  ],
});

// 👮‍♂️ Protección de rutas
router.beforeEach((to, _, next) => {
  const authenticated = isAuthenticated();
  const role = getUserRole();

  if (to.meta.requiresGuest && authenticated) {
    if (role === 'admin') return next('/admin');
    if (role === 'cliente') return next('/client');
    if (role === 'empleado') return next('/employee');
    return next('/');
  }

  if (to.meta.requiresAuth && !authenticated) {
    return next('/login');
  }

  if (to.meta.role && role !== to.meta.role) {
    return next('/');
  }

  next();
});


export default router;
