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
    name: 'list',
    path: '/list/:listname/:uuid',
    component: () => import('pages/SingleList.vue'),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('pages/RegisterView.vue'),
  },
];

export default routes;
