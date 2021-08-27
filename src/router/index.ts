import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router'

export declare function useRouter(): Router
const Home = () => import(/* webpackChunkName: "Home" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Welcome" */ '../components/Welcome.vue')
const User = () => import(/* webpackChunkName: "Users" */ '../components/user/Users.vue')
// const Roles = () =>
//   import(/* webpackChunkName: "Roles" */ '../components/power/Roles.vue')
// const Right = () =>
//   import(/* webpackChunkName: "Rights" */ '../components/power/Rights.vue')
// const Goods = () =>
//   import(/* webpackChunkName: "Goods" */ '../components/goods/Goods.vue')
// const AddGoods = () =>
//   import(/* webpackChunkName: "Goods" */ '../components/goods/AddGoods.vue')
// const Params = () =>
//   import(/* webpackChunkName: "Params" */ '../components/goods/Params.vue')
// const Categories = () =>
//   import(
//     /* webpackChunkName: "Categories" */ '../components/goods/Categories.vue'
//   )
// const Orders = () =>
//   import(/* webpackChunkName: "Orders" */ '../components/orders/Orders.vue')
// const Reports = () =>
//   import(/* webpackChunkName: "Reports" */ '../components/reports/Reports.vue')
const Login = () => import(/* webpackChunkName: "Login" */ '../components/Login.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: 'users',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        component: Welcome,
      },
      {
        name: 'users',
        path: '/users',
        component: User,
      },
      //   {
      //     path: '/roles',
      //     component: Roles,
      //   },
      //   {
      //     path: '/rights',
      //     component: Right,
      //   },
      //   {
      //     path: '/goods',
      //     component: Goods,
      //   },
      //   {
      //     path: '/params',
      //     component: Params,
      //   },
      //   {
      //     path: '/categories',
      //     component: Categories,
      //   },
      //   {
      //     path: '/orders',
      //     component: Orders,
      //   },
      //   {
      //     path: '/reports',
      //     component: Reports,
      //   },
      //   {
      //     path: '/goods/addgoods',
      //     component: AddGoods,
      //   },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
