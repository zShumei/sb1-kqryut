<script setup>
import { ref } from 'vue';
import { Button, Upload, Space, Tooltip } from 'ant-design-vue';
import {
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  DeleteOutlined,
  HistoryOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import { TableSetting } from './index';

const { t } = useI18n();

const props = defineProps({
  selectedCount: {
    type: Number,
    default: 0
  },
  tableRef: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['add', 'import', 'export-selected', 'export-all', 'delete', 'view-logs']);

const settingVisible = ref(false);

const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.type === 'application/vnd.ms-excel';
  if (!isExcel) {
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  return isLt2M;
};

const handleColumnChange = (dataIndex, show) => {
  props.tableRef?.updateColumnShow(dataIndex, show);
};

const handleAllColumnsChange = (show) => {
  props.tableRef?.updateAllColumnsShow(show);
};

const handleResetColumns = () => {
  props.tableRef?.resetColumns();
};

const handleConfigChange = (key, value) => {
  props.tableRef?.updateConfig(key, value);
};

const handleColumnOrderChange = (oldIndex, newIndex) => {
  props.tableRef?.handleColumnOrderChange(oldIndex, newIndex);
};
</script>

<template>
  <div class="flex justify-between items-center py-2 px-4 border-b border-gray-100">
    <Space :size="8">
      <Tooltip :title="t('table.toolbar.add')">
        <Button type="primary" class="custom-btn-primary" @click="$emit('add')">
          <template #icon><PlusOutlined /></template>
        </Button>
      </Tooltip>
      
      <Tooltip :title="t('table.toolbar.import')">
        <Upload
          :before-upload="beforeUpload"
          :custom-request="({ file }) => $emit('import', file)"
          :show-upload-list="false"
        >
          <Button class="custom-btn">
            <template #icon><ImportOutlined /></template>
          </Button>
        </Upload>
      </Tooltip>

      <Space :size="2">
        <Tooltip :title="t('table.toolbar.export.selected')">
          <Button 
            :disabled="selectedCount === 0" 
            class="custom-btn"
            @click="$emit('export-selected')"
          >
            <template #icon><ExportOutlined /></template>
          </Button>
        </Tooltip>
        <Tooltip :title="t('table.toolbar.export.all')">
          <Button class="custom-btn" @click="$emit('export-all')">
            <template #icon><ExportOutlined /></template>
          </Button>
        </Tooltip>
      </Space>

      <Tooltip :title="t('table.toolbar.delete')">
        <Button 
          danger 
          :disabled="selectedCount === 0"
          class="custom-btn-danger"
          @click="$emit('delete')"
        >
          <template #icon><DeleteOutlined /></template>
        </Button>
      </Tooltip>

      <Tooltip :title="t('table.toolbar.logs')">
        <Button 
          :disabled="selectedCount === 0"
          class="custom-btn"
          @click="$emit('view-logs')"
        >
          <template #icon><HistoryOutlined /></template>
        </Button>
      </Tooltip>
    </Space>

    <Space :size="8">
      <span 
        v-if="selectedCount > 0" 
        class="text-sm font-medium text-indigo-500"
      >
        {{ t('table.operations.selected', { count: selectedCount }) }}
      </span>

      <Tooltip :title="t('table.settings.title')">
        <Button class="custom-btn" @click="settingVisible = true">
          <template #icon><SettingOutlined /></template>
        </Button>
      </Tooltip>
    </Space>

    <TableSetting
      v-if="tableRef"
      v-model:open="settingVisible"
      :columns="tableRef.columns"
      :column-states="tableRef.columnStates"
      :config="tableRef.config"
      @column-change="handleColumnChange"
      @all-columns-change="handleAllColumnsChange"
      @reset-columns="handleResetColumns"
      @config-change="handleConfigChange"
      @column-order-change="handleColumnOrderChange"
    />
  </div>
</template>

<style scoped>
.custom-btn {
  @apply h-7 w-7 flex items-center justify-center !important;
  @apply border-gray-200 text-gray-600 hover:text-indigo-500 hover:border-indigo-500 !important;
  @apply transition-colors duration-300 !important;
}

.custom-btn[disabled] {
  @apply text-gray-300 border-gray-200 hover:text-gray-300 hover:border-gray-200 !important;
}

.custom-btn-primary {
  @apply h-7 w-7 flex items-center justify-center !important;
  @apply bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 !important;
  @apply transition-colors duration-300 !important;
}

.custom-btn-danger {
  @apply h-7 w-7 flex items-center justify-center !important;
  @apply border-red-500 text-red-500 hover:text-white hover:bg-red-500 !important;
  @apply transition-colors duration-300 !important;
}

.custom-btn-danger[disabled] {
  @apply text-gray-300 border-gray-200 hover:text-gray-300 hover:border-gray-200 hover:bg-white !important;
}
</style>