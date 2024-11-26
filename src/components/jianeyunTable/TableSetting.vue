<script setup>
// ... 其他代码保持不变 ...

const updateConfig = (key, value) => {
  if (key === 'editable' && !props.tableRef?.allowEditable) {
    return;
  }
  emit('config-change', key, value);
  // 当开启编辑模式时，自动关闭设置面板
  if (key === 'editable' && value) {
    emit('update:open', false);
  }
};
</script>

<template>
  <!-- ... 其他代码保持不变 ... -->
  <div class="flex justify-between items-center" v-if="tableRef?.allowEditable">
    <span class="text-gray-700">{{ t('table.settings.options.editable') }}</span>
    <Switch 
      :checked="config.editable"
      class="custom-switch"
      @change="val => updateConfig('editable', val)" 
    />
  </div>
  <!-- ... 其他代码保持不变 ... -->
</template>