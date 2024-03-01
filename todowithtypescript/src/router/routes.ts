import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'index',
    path: '/createlist',
    component: () => import('pages/IndexPage.vue'),
    meta: {
      requiresAuth: true,
    },
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
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('pages/RegisterView.vue'),
  },
  {
    name: 'dueatdate',
    path: '/dueatdate',
    component: () => import('pages/DueAtDateView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'duetoday',
    path: '/duetoday',
    component: () => import('pages/DueTodayView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'finishedtask',
    path: '/finishedtask',
    component: () => import('pages/CompletedTaskView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'timeline',
    path: '/timeline',
    component: () => import('pages/TimelineView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
