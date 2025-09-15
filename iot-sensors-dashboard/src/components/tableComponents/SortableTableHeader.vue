<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  column: string
  currentSortColumn: string
  sortDirection: 'asc' | 'desc'
  sortable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sortable: true
})

const emit = defineEmits<{
  sort: [column: string, event: Event]
}>()

const handleSort = (event: Event) => {
  if (props.sortable) {
    emit('sort', props.column, event)
  }
}

const isActive = computed(() => props.currentSortColumn === props.column)
</script>

<template>
  <th 
    @click="handleSort"
    :class="[
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      sortable 
        ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150' 
        : 'cursor-default'
    ]"
  >
    <div class="flex items-center space-x-2 group">
      <span>{{ label }}</span>
      
      <!-- Sort indicators -->
      <div v-if="sortable" class="flex flex-col">
        <!-- Up arrow -->
        <svg 
          :class="[
            'w-3 h-3 transition-colors duration-150',
            isActive && sortDirection === 'asc' 
              ? 'text-blue-600' 
              : 'text-gray-300 group-hover:text-gray-400'
          ]"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 3l5 5H5l5-5z" clip-rule="evenodd" />
        </svg>
        
        <!-- Down arrow -->
        <svg 
          :class="[
            'w-3 h-3 -mt-1 transition-colors duration-150',
            isActive && sortDirection === 'desc' 
              ? 'text-blue-600' 
              : 'text-gray-300 group-hover:text-gray-400'
          ]"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 17l-5-5h10l-5 5z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </th>
</template>