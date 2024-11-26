<script setup lang="ts">
import { ref } from 'vue';
import { Card, Modal, Form, Input, Select, Button } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { ListTable, ListToolbar } from '/@/components/jianeyunTable';
import { columns } from './data/tableColumns';
import { getList } from '/@/api/demo/list';
import type { TableRef } from '/@/components/jianeyunTable';

const { createMessage } = useMessage();
const tableRef = ref<TableRef>();
const selectedRows = ref<any[]>([]);
const editFormVisible = ref(false);
const formModel = ref({});

const formRules = {
  name: [{ required: true, message: '请输入客户名称' }],
  code: [{ required: true, message: '请输入客户编码' }],
  category: [{ required: true, message: '请选择客户分类' }],
  priceLevel: [{ required: true, message: '请选择价格等级' }],
  status: [{ required: true, message: '请选择状态' }]
};

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

const handleAdd = () => {
  editFormVisible.value = true;
  formModel.value = {};
};

const handleImport = (file: File) => {
  createMessage.success('导入成功');
  tableRef.value?.reload();
};

const handleExportSelected = () => {
  if (selectedRows.value.length === 0) {
    createMessage.warning('请选择要导出的记录');
    return;
  }
  createMessage.success('已导出选中记录');
};

const handleExportAll = () => {
  createMessage.success('已导出全部记录');
};

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    createMessage.warning('请选择要删除的记录');
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
    onOk: () => {
      createMessage.success('删除成功');
      tableRef.value?.reload();
    },
  });
};

const handleViewLogs = () => {
  if (selectedRows.value.length === 0) {
    createMessage.warning('请选择要查看的记录');
    return;
  }
  Modal.info({
    title: '操作日志',
    content: '这里显示操作日志内容',
    width: 600,
  });
};

const handleSave = () => {
  createMessage.success('保存成功');
  editFormVisible.value = false;
  tableRef.value?.reload();
};

const handleRowSave = (record: any) => {
  createMessage.success('保存成功');
  tableRef.value?.reload();
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto py-6 px-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">客户管理</h1>
        <p class="mt-2 text-gray-600">管理和维护客户信息</p>
      </div>

      <Card :bordered="false" class="custom-card">
        <ListToolbar
          :selected-count="selectedRows.length"
          :table-ref="tableRef"
          @add="handleAdd"
          @import="handleImport"
          @export-selected="handleExportSelected"
          @export-all="handleExportAll"
          @delete="handleBatchDelete"
          @view-logs="handleViewLogs"
        />
        
        <ListTable
          ref="tableRef"
          :api="getList"
          :columns="columns"
          :allow-editable="true"
          @selection-change="handleSelectionChange"
          @save="handleRowSave"
        />
      </Card>

      <Modal
        v-model:open="editFormVisible"
        title="客户信息"
        class="custom-modal"
        @ok="handleSave"
      >
        <Form
          :model="formModel"
          :rules="formRules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
        >
          <Form.Item label="客户名称" name="name">
            <Input v-model:value="formModel.name" placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item label="客户编码" name="code">
            <Input v-model:value="formModel.code" placeholder="请输入客户编码" />
          </Form.Item>
          <Form.Item label="客户分类" name="category">
            <Select v-model:value="formModel.category" placeholder="请选择客户分类">
              <Select.Option value="VIP">VIP</Select.Option>
              <Select.Option value="普通">普通</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="价格等级" name="priceLevel">
            <Select v-model:value="formModel.priceLevel" placeholder="请选择价格等级">
              <Select.Option value="一级">一级</Select.Option>
              <Select.Option value="二级">二级</Select.Option>
              <Select.Option value="三级">三级</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select v-model:value="formModel.status" placeholder="请选择状态">
              <Select.Option value="启用">启用</Select.Option>
              <Select.Option value="禁用">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
.custom-card {
  @apply rounded-lg shadow-sm bg-white overflow-hidden;
}

:deep(.ant-card-body) {
  @apply p-0;
}

.custom-modal {
  :deep(.ant-modal-content) {
    @apply rounded-xl shadow-lg;
  }

  :deep(.ant-modal-header) {
    @apply rounded-t-xl border-b border-gray-100 pb-3;
  }

  :deep(.ant-modal-title) {
    @apply text-gray-800 font-medium;
  }

  :deep(.ant-modal-footer) {
    @apply border-t border-gray-100;
  }

  :deep(.ant-btn) {
    @apply rounded-md;
  }

  :deep(.ant-btn-primary) {
    @apply bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600;
  }
}

:deep(.ant-form-item-label > label) {
  @apply text-gray-600;
}

:deep(.ant-input) {
  @apply rounded-md border-gray-300;
}

:deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  @apply border-indigo-500;
}

:deep(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  @apply border-indigo-500 shadow-none;
}

:deep(.ant-form-item-explain-error) {
  @apply text-red-500 text-sm mt-1;
}
</style>