import InboxPage from 'pages/InboxPage.vue'
import DraftsPage from 'pages/DraftsPage.vue'
import SentPage from 'pages/SentPage.vue'
import MailViewPage from 'pages/MailViewPage.vue'
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
      { path: 'mail/:id', name: 'mail-view', component: MailViewPage },
      { path: 'compose', name: 'create-mail', component: CreateMailPage }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
