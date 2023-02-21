export const routerMenu = [
  {
    text: '文章管理',
    tag: 'article',
    children: [
      {
        path: '/article/add',
        text: '发布文章'
      },
      {
        path: '/article/list',
        text: '文章列表'
      },
      {
        path: '/article/category',
        text: '分类管理'
      },
      {
        path: '/article/tag',
        text: '标签管理'
      }
    ]
  },
  {
    text: '说说管理',
    tag: 'talks',
    children: [
      {
        text: '发布说说',
        path: '/talks/add'
      },
      {
        text: '说说列表',
        path: '/talks/list'
      }
    ]
  },
  {
    text: '评论管理',
    path: '/comments',
    tag: 'comments'
  },
  {
    text: '相册管理',
    path: '/albums/list',
    tag: 'albums'
  },
  {
    text: '用户管理',
    path: '/user',
    tag: 'user'
  },
  {
    text: '权限管理',
    tag: 'auth',
    children: [
      // {
      //   text: '接口管理',
      //   path: '/auth/interface'
      // },
      {
        text: '角色管理',
        path: '/auth/role'
      }
    ]
  },
  {
    text: '网站管理',
    tag: 'website',
    children: [
      {
        text: '系统配置',
        path: '/website/config'
      },
      {
        text: '关于我',
        path: '/website/about'
      }
    ]
  },
  {
    text: '日志管理',
    tag: 'logs',
    children: [
      {
        text: '异常日志',
        path: '/logs/exception'
      },
      {
        text: '操作日志',
        path: '/logs/operation'
      }
    ]
  },
  {
    text: '用户中心',
    path: '/user_center',
    tag: 'user_center'
  }
]
