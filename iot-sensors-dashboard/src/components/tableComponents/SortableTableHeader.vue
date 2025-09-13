<script setup lang="ts">
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

const handleClick = (event: Event) => {
  if (props.sortable) {
    emit('sort', props.column, event)
  }
}
</script>

<template>
  <th 
    @click="handleClick"
    :class="[
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      sortable ? 'cursor-pointer hover:bg-gray-100' : ''
    ]"
  >
    {{ label }}
    <span v-if="sortable && currentSortColumn === column">
      {{ sortDirection === 'asc' ? '↑' : '↓' }}
    </span>
  </th>
</template>