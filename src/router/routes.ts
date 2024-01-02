import { SessionStorage } from 'quasar';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: 'Index', synchro: false },
      },
    ],
    beforeEnter: (to, from, next) => {
      if (!SessionStorage.has('loggedUser') && to.name !== 'login') {
        return next({ name: 'login' });
      }
      // condition to redirect to the gauge init page if the page is loaded
      else if (!to.meta.synchro) {
        return next({
          name: 'synchronization',
        });
      }
      return next();
    },
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/AuthPage.vue'),
  },
  {
    name: 'synchronization',
    path: '/init-synchronization',
    component: () => import('pages/InitSynchronization.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
