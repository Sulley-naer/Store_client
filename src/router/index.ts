import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/shop/Login.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/shop/index.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/index.vue')
    },
    {
      path: '/admLogin',
      name: 'admLogin',
      component: () => import('../views/Admin/Login.vue')
    },
    {
      path:'/pay',
      name: 'pay',
      component:()=>import('../views/shop/Layout/pay.vue')
    },
    {
      path: '/Detail/:id',
      name: 'Detail',
      component: () => import('@/Detail/index.vue')
    },
    {
      path:'/space/:id',
      name:"space",
      component:() => import("@/space/index.vue"),
      children:[
        {
          name: "OrderInfo",
          path: 'OrderInfo', // 去掉开头的 '/'
          component: () => import("@/views/shop/Layout/OrderInfo.vue")
        }
      ]
    },
  ]
})

export default router
