import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: "Home",
      component: () => import('../views/Home.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Signup.vue')
    },
  ],
})

// Empêche l'utilisateur d'accéder aux routes qui nécessite une authentification
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token")
  if ((to.name !== 'Login' && !isAuthenticated) && (to.name !== 'Signup' && !isAuthenticated)) next({ name: 'Login' })
  else next()
})

export default router

