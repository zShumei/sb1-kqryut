<script setup>
import { ref, computed, watch } from 'vue';
import { Table, Form } from 'ant-design-vue';
import EditableCell from './EditableCell.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  api: {
    type: Function,
    required: true
  },
  allowEditable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['selection-change', 'save']);

// State
const state = ref({
  loading: false,
  dataSource: [],
  selectedRowKeys: [],
  selectedRows: [],
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20,
    showTotal: (total) => t('table.total', { total }),
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
  },
});

// Config
const config = ref({
  size: 'small',
  bordered: false,
  striped: false,
  editable: false,
});

// Column states
const columnStates = ref(
  props.columns.reduce((acc, col, index) => {
    if (col.dataIndex) {
      acc[col.dataIndex] = { show: true, order: index };
    }
    return acc;
  }, {})
);

// Editable state
const editingKey = ref('');
const editableData = ref({});

// Watch editable mode changes
watch(() => config.value.editable, (newVal) => {
  if (!newVal) {
    editingKey.value = '';
    editableData.value = {};
  }
});

const isEditing = (record) => record?.id === editingKey.value;

const edit = (record) => {
  if (!config.value.editable || !props.allowEditable || !record) return;
  editingKey.value = record.id;
  editableData.value[record.id] = { ...record };
};

const save = async (record) => {
  try {
    const row = editableData.value[record.id];
    editingKey.value = '';
    delete editableData.value[record.id];
    emit('save', row);
  } catch (error) {
    console.error('Save failed:', error);
  }
};

const cancel = () => {
  editingKey.value = '';
  editableData.value = {};
};

// Computed
const visibleColumns = computed(() => {
  return props.columns
    .filter(col => col.dataIndex && columnStates.value[col.dataIndex]?.show)
    .sort((a, b) => {
      const orderA = columnStates.value[a.dataIndex]?.order || 0;
      const orderB = columnStates.value[b.dataIndex]?.order || 0;
      return orderA - orderB;
    })
    .map(col => ({
      ...col,
      customCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: config.value.editable && props.allowEditable && isEditing(record),
        editableData: editableData.value,
        save,
        cancel
      })
    }));
});

// Methods
const handleTableChange = async (pagination, filters, sorter) => {
  if (props.api) {
    state.value.loading = true;
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      };
      const { items, total } = await props.api(params);
      state.value.dataSource = items;
      state.value.pagination.total = total;
      state.value.pagination.current = pagination.current;
      state.value.pagination.pageSize = pagination.pageSize;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      state.value.loading = false;
    }
  }
};

const handleSelectionChange = (selectedRowKeys, selectedRows) => {
  state.value.selectedRowKeys = selectedRowKeys;
  state.value.selectedRows = selectedRows;
  emit('selection-change', selectedRows);
};

const reload = async () => {
  if (props.api) {
    state.value.loading = true;
    try {
      const { items, total } = await props.api({
        page: state.value.pagination.current,
        pageSize: state.value.pagination.pageSize,
      });
      state.value.dataSource = items;
      state.value.pagination.total = total;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      state.value.loading = false;
    }
  }
};

const updateColumnShow = (dataIndex, show) => {
  if (columnStates.value[dataIndex]) {
    columnStates.value[dataIndex].show = show;
  }
};

const updateAllColumnsShow = (show) => {
  Object.keys(columnStates.value).forEach(key => {
    columnStates.value[key].show = show;
  });
};

const resetColumns = () => {
  props.columns.forEach((column, index) => {
    if (column.dataIndex) {
      columnStates.value[column.dataIndex] = {
        show: true,
        order: index,
      };
    }
  });
};

const updateConfig = (key, value) => {
  if (key === 'editable' && !props.allowEditable) {
    return;
  }
  config.value[key] = value;
};

const handleColumnOrderChange = (oldIndex, newIndex) => {
  const columns = props.columns.filter(col => col.dataIndex);
  const item = columns[oldIndex];
  columns.splice(oldIndex, 1);
  columns.splice(newIndex, 0, item);
  
  columns.forEach((col, index) => {
    if (col.dataIndex) {
      columnStates.value[col.dataIndex].order = index;
    }
  });
};

// Initial data load
reload();

// Expose methods and refs
defineExpose({
  reload,
  state,
  columns: props.columns,
  columnStates,
  config,
  updateColumnShow,
  updateAllColumnsShow,
  resetColumns,
  updateConfig,
  handleColumnOrderChange,
  allowEditable: props.allowEditable
});
</script>

<template>
  <div class="list-table-container">
    <Table
      :columns="visibleColumns"
      :data-source="state.dataSource"
      :loading="state.loading"
      :pagination="state.pagination"
      :row-selection="{
        selectedRowKeys: state.selectedRowKeys,
        onChange: handleSelectionChange,
      }"
      :size="config.size"
      :bordered="config.bordered"
      :class="[
        'custom-table',
        { 'table-striped': config.striped }
      ]"
      :components="config.editable && allowEditable ? {
        body: {
          cell: EditableCell
        }
      } : {}"
      @change="handleTableChange"
      row-key="id"
    />
  </div>
</template>

<style scoped>
.list-table-container {
  @apply bg-white rounded-lg shadow-sm overflow-hidden;
}

:deep(.ant-table-thead > tr > th) {
  @apply bg-gray-50/80 text-gray-700 font-medium text-sm py-2.5 !important;
}

:deep(.ant-table-tbody > tr > td) {
  @apply text-gray-600 text-sm py-2 !important;
}

:deep(.ant-table-tbody > tr:hover > td) {
  @apply bg-indigo-50/50 !important;
}

:deep(.table-striped .ant-table-tbody > tr:nth-child(odd)) {
  @apply bg-gray-50/30;
}

:deep(.table-striped .ant-table-tbody > tr:nth-child(even)) {
  @apply bg-white;
}

:deep(.ant-table-row-selected > td) {
  @apply bg-indigo-50/70 !important;
}

:deep(.ant-table-pagination) {
  @apply my-4 mr-4;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  @apply bg-indigo-500 border-indigo-500;
}

:deep(.ant-table-column-sorter-up.active),
:deep(.ant-table-column-sorter-down.active) {
  @apply text-indigo-500;
}

:deep(.ant-pagination-item-active) {
  @apply border-indigo-500;
}

:deep(.ant-pagination-item-active a) {
  @apply text-indigo-500;
}

:deep(.ant-table-filter-trigger.active) {
  @apply text-indigo-500;
}
</style>