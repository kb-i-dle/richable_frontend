import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import HomePage from '@/views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  // Richable
  // 회원 관리 /user
  {
    path: '/user/signin',
    name: 'signIn',
    component: () => import('../views/user/SignInPage.vue')
  },
  {
    path: '/user/signup',
    name: 'signUp',
    component: () => import('../views/user/SignUpPage.vue')
  },
  {
    path: '/auth/naver/callback',
    name: 'NaverAuthCallback',
    component: () => import('../views/user/NaverAuthCallback.vue')
  },
  {
    path: '/user/findpassword',
    name: 'findpassword',
    component: () => import('../views/user/FindPassWord.vue')
  },
  {
    path: '/user/findpassword2',
    name: 'findpassword2',
    component: () => import('../views/user/FindPassWord2.vue')
  },
  {
    path: '/user/findid',
    name: 'findid',
    component: () => import('../views/user/FindId.vue')
  },
  {
    path: '/user/findid2/:id',
    name: 'findid2',
    component: () => import('../views/user/FindId2.vue')
  },
  {
    path: '/user/terms/:id',
    name: 'terms',
    component: () => import('../views/user/UserTermsPage.vue')
  },
  {
    path: '/user/mypage',
    name: 'myPage',
    component: () => import('../views/user/MyPage.vue')
  },
  {
    path: '/user/master',
    name: 'master',
    component: () => import('../views/user/master.vue')
  },
  // 자산 관리 /asset
  {
    path: '/asset/analysis',
    name: 'assetAnalysis',
    component: () => import('../views/asset/AssetAnalysisPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/asset/comparison',
    name: 'assetComparison',
    component: () => import('../views/asset/AssetComparisonPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/asset/management',
    name: 'assetManagement',
    component: () => import('../views/asset/AssetManagementPage.vue'),
    meta: { requiresAuth: true } // 인증이 필요한 라우트
  },
  // 소득 소비 관리 /budget
  {
    path: '/budget/list',
    name: 'budgetList',
    component: () => import('../views/budget/BudgetListPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/budget/consume/compare',
    name: 'compareConsume',
    component: () => import('../views/budget/CompareConsumePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/budget/consume/analysis',
    name: 'consumeAnalysis',
    component: () => import('../views/budget/ConsumeAnalysisPage.vue'),
    meta: { requiresAuth: true }
  },
  // 투자 관리 /invest
  {
    path: '/invest/advisor',
    name: 'investAdvisor',
    component: () => import('../views/invest/ProductAdvisorPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invest/return/top',
    name: 'topReturn',
    component: () => import('../views/invest/TopReturnAssetPage.vue'),
    meta: { requiresAuth: true }
  },
  // 목표 관리 /goal
  {
    path: '/goal/list',
    name: 'goalList',
    component: () => import('../views/goal/GoalAssetListPage.vue'),
    meta: { requiresAuth: true }
  },
  // 커뮤니티 관리 /knowhow
  {
    path: '/knowhow/list',
    name: 'knowhowList',
    component: () => import('../views/knowhow/KnowHowListPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/knowhow/detail',
    name: 'knowhowDetail',
    component: () => import('../views/knowhow/KnowHowDetailPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/knowhow/write',
    name: 'knowhowWrite',
    component: () => import('../views/knowhow/KnowHowWritePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/knowhow/update',
    name: 'knowhowUpdate',
    component: () => import('../views/knowhow/KnowHowUpdatePage.vue'),
    meta: { requiresAuth: true }
  }
]

// 라우터 생성
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken') // 로컬 스토리지에서 토큰 확인

  // 인증이 필요한 페이지에 접근할 때
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // 로그인 후 원래 가고자 했던 페이지로 리디렉션
      return next({ path: '/user/signin', query: { redirect: to.fullPath } })
    }
  }
  next() // 인증이 필요하지 않거나 인증된 상태라면 계속 진행
})

export default router
