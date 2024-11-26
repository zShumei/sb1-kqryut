<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Layout } from 'ant-design-vue';

const { Header, Content } = Layout;
</script>

<template>
  <Layout class="min-h-screen">
    <Header class="bg-white px-4 flex items-center border-b">
      <h1 class="text-lg font-semibold">Vben Admin Demo</h1>
    </Header>
    <Content class="p-6 bg-gray-50">
      <RouterView />
    </Content>
  </Layout>
</template>