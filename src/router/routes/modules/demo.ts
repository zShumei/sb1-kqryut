import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const demo: AppRouteModule = {
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
      component: () => import('/@/views/demo/list/index.vue'),
      meta: {
        title: '列表页面',
      },
    },
  ],
};

export default demo;