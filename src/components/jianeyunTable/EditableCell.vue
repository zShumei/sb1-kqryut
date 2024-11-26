<script setup>
import { computed } from 'vue';
import { Form, Input, Select } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  dataIndex: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  editing: {
    type: Boolean,
    default: false
  },
  editableData: {
    type: Object,
    default: () => ({})
  },
  save: {
    type: Function,
    required: true
  },
  cancel: {
    type: Function,
    required: true
  }
});

const options = {
  category: [
    { label: 'VIP', value: 'VIP' },
    { label: '普通', value: '普通' }
  ],
  priceLevel: [
    { label: '一级', value: '一级' },
    { label: '二级', value: '二级' },
    { label: '三级', value: '三级' }
  ],
  warehouse: [
    { label: '北京', value: '北京' },
    { label: '上海', value: '上海' },
    { label: '广州', value: '广州' }
  ],
  status: [
    { label: '启用', value: '启用' },
    { label: '禁用', value: '禁用' }
  ]
};

const value = computed({
  get: () => {
    if (!props.record?.id) return '';
    return props.editableData[props.record.id]?.[props.dataIndex] ?? props.record[props.dataIndex];
  },
  set: (val) => {
    if (!props.record?.id) return;
    if (!props.editableData[props.record.id]) {
      props.editableData[props.record.id] = { ...props.record };
    }
    props.editableData[props.record.id][props.dataIndex] = val;
  }
});

const formItemProps = computed(() => ({
  name: props.dataIndex,
  style: { margin: 0 },
  rules: [{ required: true, message: t('table.validation.required', { field: props.title }) }]
}));
</script>

<template>
  <td>
    <template v-if="editing">
      <Form.Item v-bind="formItemProps">
        <template v-if="options[dataIndex]">
          <Select
            v-model:value="value"
            :options="options[dataIndex]"
            style="width: 100%"
          />
        </template>
        <template v-else>
          <Input
            v-model:value="value"
            style="width: 100%"
          />
        </template>
      </Form.Item>
    </template>
    <template v-else>
      <div class="editable-cell">{{ value }}</div>
    </template>
  </td>
</template>

<style scoped>
.editable-cell {
  @apply py-1 px-2;
}

:deep(.ant-form-item) {
  @apply m-0;
}

:deep(.ant-form-item-explain) {
  @apply absolute top-full text-xs;
}

:deep(.ant-select) {
  @apply w-full;
}
</style>