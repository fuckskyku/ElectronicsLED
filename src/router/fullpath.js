import Abstract from '../components/publicTemplate/abstract.vue';

export default [{
  path: '/',
  name: '首页',
  component: (resolve) => require(['../components/baseSetting/BaseIndex.vue'], resolve),
  children: [{
    path: '/userlist',
    name: '平台-用户管理',
    meta: {
      name: '用户管理'
    },
    component: (resolve) => require(['../components/baseSetting/UserList.vue'], resolve)
  }]
}];