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
  {
    name: 'duetoday',
    path: '/duetoday',
    component: () => import('pages/DueTodayView.vue'),
  },
  {
    name: 'finishedtask',
    path: '/finishedtask',
    component: () => import('pages/CompletedTaskView.vue'),
  },
];

export default routes;
