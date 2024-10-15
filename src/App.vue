<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue';

const route = useRoute();

// 라우트 이름에 따라 제목을 매핑하는 객체
const titleMapping = {
  home: '홈',
  about: '소개',
  signIn: '로그인',
  signUp: '회원가입',
  findpassword: '비밀번호 찾기',
  findid: '아이디 찾기',
  findid1: '아이디 찾기',
  findpassword: '비밀번호 찾기',
  findpassword2:'비밀번호 찾기',
  term : '약관동의',
  assetAnalysis: '자산 분석',
  assetComparison: '또래 자산 비교',
  assetManagement: '자산 관리',
  budgetList: '소득/소비 관리',
  consumeAnalysis: '소비 분석',
  compareConsume : '평균 소비 비교',
  myPage : '마이페이지',
  investAdvisor: '투자 상품 추천',
  topReturn :'수익률 상위 자산',
  goalList : '목표',
  knowhowList : '리치노하우',
  knowhowDetail : '리치노하우',
  knowhowWrite : '리치노하우',
  knowhowUpdate : '리치노하우'
};

// 현재 라우트에 따라 제목을 동적으로 가져오는 computed 속성
const pageTitle = computed(() => {
  return titleMapping[route.name] || '기본 제목'; // 기본 제목 설정
});
</script>

<template>
  <div class="main-template">
    <SideBar />

    <div class="page-view">
      <!-- topbar의 text는 path 별로 달라지게 설정 -->
      <div class="topbar"><span style="margin-left: 12px">{{ pageTitle }}</span></div>
      <RouterView />
    </div>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Richable. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
        <div class="social-icons">
          <a href="#"><img src="../src/assets/images/navbar-rich.png" alt="Facebook" /></a>
          <a href="#"><img src="../src/assets/images/navbar-rich.png" alt="Twitter" /></a>
          <a href="#"><img src="../src/assets/images/navbar-rich.png" alt="Instagram" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-template {
  min-height: 100vh; /* 화면 전체 높이를 차지 */
  position: relative;
  padding-bottom: 200px; /* 푸터 높이만큼 패딩 추가 */
}
.topbar {
  height: 70px;
  line-height: 70px;
  border-bottom: 2px solid #e4ebf0;
  padding-left: 60px;
  font-weight: bold;
  font-size: 18px;
}

/* .sidebar {
  position: fixed;
  /* background-color: #F9F9F9; 
  background-color: blue;
  width : 56px;
  height: 100vh;
} */

.page-view {
  min-height: 100vh;
  border-spacing: 200px;
  margin-left: 56px;
}

/* 푸터 스타일 */
.footer {
  height: 200px; /* 푸터 높이 설정 */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; /* 화면 전체 너비 */
  background-color: #19181d;
  padding: 40px 0;
  text-align: center;
  color: white;
  transform: translateY(0);
}

.footer-content {
  max-width: 1200px;
  margin: auto;
}

.footer-links {
  margin: 20px 0;
}

.footer-links a {
  color: #fff;
  margin: 0 15px;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.social-icons a {
  margin: 0 10px;
}

.social-icons img {
  width: 24px;
  height: 24px;
}

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
