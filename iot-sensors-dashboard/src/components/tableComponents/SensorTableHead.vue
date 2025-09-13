<script setup lang="ts">
import SortableTableHeader from './SortableTableHeader.vue'

interface Props {
  currentSortColumn: string
  sortDirection: 'asc' | 'desc'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sort: [column: string, event: Event]
}>()

const handleSort = (column: string, event: Event) => {
  emit('sort', column, event)
}
</script>

<template>
  <thead class="bg-gray-50">
    <tr>
      <SortableTableHeader 
        label="ID"
        column="id"
        :current-sort-column="currentSortColumn"
        :sort-direction="sortDirection"
        @sort="handleSort"
      />
      <SortableTableHeader 
        label="Name"
        column="name"
        :current-sort-column="currentSortColumn"
        :sort-direction="sortDirection"
        @sort="handleSort"
      />
      <SortableTableHeader 
        label="Location"
        column="location"
        :current-sort-column="currentSortColumn"
        :sort-direction="sortDirection"
        @sort="handleSort"
      />
      <SortableTableHeader 
        label="Last Value"
        column=""
        :current-sort-column="currentSortColumn"
        :sort-direction="sortDirection"
        :sortable="false"
      />
      <SortableTableHeader 
        label="Status"
        column="status"
        :current-sort-column="currentSortColumn"
        :sort-direction="sortDirection"
        @sort="handleSort"
      />
    </tr>
  </thead>
</template>