import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'index',
    path: '/createlist',
    component: () => import('pages/IndexPage.vue'),
  },
  {
    name: 'login',
    path: '/',
    component: () => import('pages/LoginView.vue'),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('pages/RegisterView.vue'),
  },
  {
    name: 'List',
    path: '/list',
    component: () => import('pages/SingleList.vue'),
  },
];

export default routes;
