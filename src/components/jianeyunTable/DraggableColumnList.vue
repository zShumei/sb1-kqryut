<script setup>
import { ref, computed, onMounted } from 'vue';
import { MenuOutlined } from '@ant-design/icons-vue';
import { Checkbox } from 'ant-design-vue';
import Sortable from 'sortablejs';

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  columnStates: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['column-change', 'column-order-change']);

const columnListRef = ref(null);

const sortableColumns = computed(() => {
  return props.columns
    .filter(col => col.dataIndex)
    .sort((a, b) => {
      const orderA = props.columnStates[a.dataIndex]?.order || 0;
      const orderB = props.columnStates[b.dataIndex]?.order || 0;
      return orderA - orderB;
    });
});

const initSortable = () => {
  if (!columnListRef.value) return;
  
  Sortable.create(columnListRef.value, {
    animation: 150,
    handle: '.column-drag-handle',
    ghostClass: 'sortable-ghost',
    onEnd: ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex) {
        emit('column-order-change', oldIndex, newIndex);
      }
    }
  });
};

const toggleColumn = (dataIndex) => {
  emit('column-change', dataIndex, !props.columnStates[dataIndex]?.show);
};

onMounted(() => {
  initSortable();
});
</script>

<template>
  <div ref="columnListRef" class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
    <div
      v-for="column in sortableColumns"
      :key="column.dataIndex"
      class="flex items-center p-2.5 bg-gray-50/70 rounded-lg hover:bg-gray-100/80 transition-colors cursor-move group"
    >
      <MenuOutlined class="column-drag-handle mr-3 text-gray-400 group-hover:text-gray-500" />
      <Checkbox
        :checked="columnStates[column.dataIndex]?.show"
        @change="() => toggleColumn(column.dataIndex)"
      >
        <span class="text-gray-600">{{ column.title }}</span>
      </Checkbox>
    </div>
  </div>
</template>

<style scoped>
.sortable-ghost {
  @apply opacity-60 bg-indigo-100 !important;
}

.column-drag-handle {
  cursor: move;
  touch-action: none;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  @apply w-1.5;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}
</style>