import {
  Document,
  DocumentAdd,
  Files,
  List,
  Management,
  ChatSquare,
  Promotion,
  Ticket,
  ChatLineRound,
  Picture,
  User,
  WarningFilled,
  UserFilled,
  ChromeFilled,
  Edit,
  HelpFilled,
  Message,
  WarnTriangleFilled,
  Reading,
  Avatar
} from '@apathia/apathia.icon-svg'
export const routerMenu = [
  {
    text: '文章管理',
    tag: 'article',
    icon: shallowRef(Document),
    children: [
      {
        path: '/article/add',
        icon: shallowRef(DocumentAdd),
        text: '发布文章'
      },
      {
        path: '/article/list',
        icon: shallowRef(Files),
        text: '文章列表'
      },
      {
        path: '/article/category',
        icon: shallowRef(List),
        text: '分类管理'
      },
      {
        path: '/article/tag',
        icon: shallowRef(Management),
        text: '标签管理'
      }
    ]
  },
  {
    text: '说说管理',
    tag: 'talks',
    icon: shallowRef(ChatSquare),
    children: [
      {
        text: '发布说说',
        icon: shallowRef(Promotion),
        path: '/talks/add'
      },
      {
        text: '说说列表',
        icon: shallowRef(Ticket),
        path: '/talks/list'
      }
    ]
  },
  {
    text: '评论管理',
    path: '/comments',
    icon: shallowRef(ChatLineRound),
    tag: 'comments'
  },
  {
    text: '相册管理',
    path: '/albums/list',
    icon: shallowRef(Picture),
    tag: 'albums'
  },
  {
    text: '用户管理',
    path: '/user',
    icon: shallowRef(User),
    tag: 'user'
  },
  {
    text: '权限管理',
    tag: 'auth',
    icon: shallowRef(WarningFilled),
    children: [
      // {
      //   text: '接口管理',
      //   path: '/auth/interface'
      // },
      {
        text: '角色管理',
        icon: shallowRef(UserFilled),
        path: '/auth/role'
      }
    ]
  },
  {
    text: '网站管理',
    tag: 'website',
    icon: shallowRef(ChromeFilled),
    children: [
      {
        text: '系统配置',
        icon: shallowRef(Edit),
        path: '/website/config'
      },
      {
        text: '关于我',
        icon: shallowRef(HelpFilled),
        path: '/website/about'
      }
    ]
  },
  {
    text: '日志管理',
    tag: 'logs',
    icon: shallowRef(Message),
    children: [
      {
        text: '异常日志',
        icon: shallowRef(WarnTriangleFilled),
        path: '/logs/exception'
      },
      {
        text: '操作日志',
        icon: shallowRef(Reading),
        path: '/logs/operation'
      }
    ]
  },
  {
    text: '用户中心',
    path: '/user_center',
    icon: shallowRef(Avatar),
    tag: 'user_center'
  }
]
