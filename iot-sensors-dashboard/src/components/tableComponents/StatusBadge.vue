<script setup lang="ts">
interface Props {
  status?: 'OK' | 'ALARM' | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  status: null,
  loading: false
})
</script>

<template>
  <span v-if="loading" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
    Loading...
  </span>
  <span v-else-if="status"
    :class="[
      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
      status === 'OK' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    ]"
  >
    {{ status }}
  </span>
</template>