import type { AppRouteModule } from '../types';
import demo from './modules/demo';

export const basicRoutes: AppRouteModule[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/demo/list',
    meta: {
      title: 'Root',
    },
    component: () => import('/@/layouts/default/index.vue'),
  },
  demo,
];

export const asyncRoutes = [demo];