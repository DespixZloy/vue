import { createRouter, createWebHistory } from 'vue-router'
import OrdersPage from '../pages/OrdersPage.vue'
import SalesPage from '../pages/SalesPage.vue'
import StocksPage from '../pages/StocksPage.vue'
import IncomesPage from '../pages/IncomesPage.vue'

const routes = [
  { path: '/', redirect: '/orders' },
  { path: '/orders', component: OrdersPage },
  { path: '/sales', component: SalesPage },
  { path: '/stocks', component: StocksPage },
  { path: '/incomes', component: IncomesPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
