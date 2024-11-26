import { createRouter, createWebHistory } from 'vue-router';
import demo from './routes/modules/demo';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/demo/list',
    },
    demo,
  ],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;