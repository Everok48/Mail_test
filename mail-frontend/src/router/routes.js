import InboxPage from 'pages/InboxPage.vue'
import DraftsPage from 'pages/DraftsPage.vue'
import SentPage from 'pages/SentPage.vue'
import CreateMailPage from 'pages/CreateMailPage.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'inbox', component: InboxPage },
      { path: 'inbox', redirect: { name: 'inbox' } },
      { path: 'drafts', name: 'drafts', component: DraftsPage },
      { path: 'sent', name: 'sent', component: SentPage },
      { path: 'create', name: 'create-mail', component: CreateMailPage },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
