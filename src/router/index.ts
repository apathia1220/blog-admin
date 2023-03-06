import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/home/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../pages/home/HomePage.vue')
      },
      {
        path: 'article',
        name: 'article',
        component: () => import('../pages/article/index.vue'),
        children: [
          {
            path: 'category',
            name: 'article_category',
            component: () => import('../pages/article/ArticleCate.vue')
          },
          {
            path: 'add',
            name: 'article_add',
            component: () => import('../pages/article/ArticleAdd.vue')
          },
          {
            path: 'edit/:id?',
            name: 'article_edit',
            component: () => import('../pages/article/ArticleAdd.vue')
          },
          {
            path: 'list',
            name: 'article_list',
            component: () => import('../pages/article/ArticleList.vue')
          },
          {
            path: 'tag',
            name: 'article_tag',
            component: () => import('../pages/article/ArticleTag.vue')
          }
        ]
      },
      {
        path: 'talks',
        name: 'talks',
        component: () => import('../pages/talks/index.vue'),
        children: [
          {
            path: 'add',
            name: 'talks_add',
            component: () => import('../pages/talks/TalksAdd.vue')
          },
          {
            path: 'list',
            name: 'talks_list',
            component: () => import('../pages/talks/TalksList.vue')
          },
          {
            path: 'edit/:id',
            name: 'talks_edit',
            component: () => import('../pages/talks/TalksAdd.vue')
          }
        ]
      },
      {
        path: 'comments',
        name: 'comments',
        component: () => import('../pages/comments/index.vue')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('../pages/user/index.vue')
      },
      {
        path: 'auth',
        name: 'auth',
        component: () => import('../pages/auth/index.vue'),
        children: [
          {
            path: 'role',
            name: 'auth_role',
            component: () => import('../pages/auth/AuthRole.vue')
          }
        ]
      },
      {
        path: 'albums',
        name: 'albums',
        component: () => import('../pages/albums/index.vue'),
        children: [
          {
            path: 'list',
            name: 'albums_list',
            component: () => import('../pages/albums/AlbumsList.vue')
          },
          {
            path: 'photos/:id?',
            name: 'photos',
            component: () => import('../pages/albums/AlbumsPhotos.vue')
          },
          {
            path: 'delete',
            name: 'albums_delete',
            component: () => import('../pages/albums/PhotoDelete.vue')
          }
        ]
      },
      {
        path: 'website',
        name: 'website',
        children: [
          {
            path: 'config',
            name: 'config',
            component: () => import('../pages/website/index.vue')
          },
          {
            path: 'about',
            name: 'about_me',
            component: () => import('../pages/website/AboutMe.vue')
          }
        ]
      },
      {
        path: 'logs',
        name: 'logs',
        component: () => import('../pages/logs/index.vue'),
        children: [
          {
            path: 'exception',
            name: 'exception',
            component: () => import('../pages/logs/Exception.vue')
          },
          {
            path: 'operation',
            name: 'operation',
            component: () => import('../pages/logs/Operation.vue')
          }
        ]
      },
      {
        path: 'user_center',
        name: 'user_center',
        component: () => import('../pages/user/UserCenter.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound/index.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
