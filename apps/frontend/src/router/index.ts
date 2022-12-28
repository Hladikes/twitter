import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TweetsView from '@/views/TweetsView.vue'
import TweetDetailView from '@/views/TweetDetailView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
      meta: {
        protected: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        protected: false,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        protected: false,
      },
    },
    {
      path: '/tweets',
      name: 'tweets',
      component: TweetsView,
      meta: {
        protected: true,
      },
    },
    {
      path: '/tweet/:id',
      name: 'tweet',
      component: TweetDetailView,
      meta: {
        protected: true,
      },
    },
  ]
})


router.beforeEach(async (to, from, next) => {
  const user = useUserStore()
  const authorized = await user.checkSession()
  
  if (authorized && to.meta.protected) {
    return next()
  }

  if (authorized && (to.name === 'login' || to.name === 'register')) {
    return next({ name: 'tweets' })
  }

  if (to.name === 'login' || to.name === 'register') {
    return next()
  }
  
  return next({ name: 'login' })
})

export default router
