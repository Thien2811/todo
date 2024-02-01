import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'index',
    path: '/',
    component: () => import('pages/IndexPage.vue'),
  },

  {
    name: 'List',
    path: '/list',
    component: () => import('pages/SingleList.vue'),
  },
];

export default routes;
