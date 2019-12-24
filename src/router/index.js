import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';

//前台
import Home from '@/components/FrontEnd/Home';
import Login from '@/components/FrontEnd/Login';
import Cart from '@/components/FrontEnd/Cart';
import About from '@/components/FrontEnd/About';

//後台
import EditProducts from '@/components/BackEnd/EditProducts';
import Coupons from '@/components/BackEnd/Coupons';
import Orders from '@/components/BackEnd/Orders';

// import Pagination from '@/components/Pagination'

Vue.use(Router);

export default new Router({
  routes :[
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'edit_products',
          name: 'EditProducts',
          component: EditProducts,
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        }
      ]
    },
  ]
})