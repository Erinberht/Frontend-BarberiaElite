<template>
  <BaseLayout>
    <router-view />
  </BaseLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '@/composables/Auth';

import BaseLayout from '@/components/BaseLayout.vue';

const { initializeAuth } = useAuth();

onMounted(() => {
  initializeAuth();
});
</script>