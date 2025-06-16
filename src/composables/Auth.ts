import api from './api';
import { ref } from 'vue';

const userRole = ref<string | null>(null);
const currentUser = ref<any | null>(null); // ✅ nuevo

export const useAuth = () => {
  const login = async (nombre_usuario: string, password: string) => {
    try {
      const response = await api.post('/login', { nombre_usuario, password });
      const token = response.data.access_token;
      const user = response.data.user;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      userRole.value = user.rol;
      currentUser.value = user; // ✅ nuevo

      return true;
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn("No hay token, ya estás desconectado");
      return;
    }
  
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión en backend (puede que ya esté cerrado).');
    }
  
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    userRole.value = null;
    currentUser.value = null;
  };
  
  

  const getUserRole = () => {
    if (!userRole.value) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      userRole.value = user.rol || null;
    }
    return userRole;
  };

  const initializeAuth = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      userRole.value = parsed.rol;
      currentUser.value = parsed; // ✅
    }
  };

  return {
    login,
    logout,
    userRole: getUserRole(),
    currentUser,       // ✅ ahora sí lo exportas
    initializeAuth     // ✅ se define antes del return
  };
};
