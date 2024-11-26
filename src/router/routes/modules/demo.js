import { LAYOUT } from '/@/router/constant';
import DemoList from '/@/views/demo/list/index.vue';

const demo = {
  path: '/demo',
  name: 'Demo',
  component: LAYOUT,
  redirect: '/demo/list',
  meta: {
    orderNo: 100000,
    icon: 'ion:grid-outline',
    title: '示例页面',
  },
  children: [
    {
      path: 'list',
      name: 'DemoList',
      component: DemoList,
      meta: {
        title: '列表页面',
      },
    },
  ],
};

export default demo;