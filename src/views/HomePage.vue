<template>
  <div class="wrap">
    <div class="intro_bg">
      <div class="text-center main-container">
        <div class="main-title">나만의 쉬운 금융메이트</div>
        <div class="sub-title">리치블</div>
      </div>

      <div class="img-container">
        <!-- 이미지 감싸는 컨테이너 추가 -->
        <div class="img" :style="{ backgroundImage: 'url(' + richImage + ')' }"></div>
      </div>

      <button id="start-btn" @click="goToSignIn">시작하기</button>
    </div>

    <div class="mid">
      <ul class="mid-nav">
        <li :class="{ active: activeIndex === 0 }" @click="setActive(0, '#section1')">
          <div>자산</div>
        </li>
        <li :class="{ active: activeIndex === 1 }" @click="setActive(1, '#section2')">
          <div>소득/소비</div>
        </li>
        <li :class="{ active: activeIndex === 2 }" @click="setActive(2, '#section3')">
          <div>투자</div>
        </li>
        <li :class="{ active: activeIndex === 3 }" @click="setActive(3, '#section4')">
          <div>목표</div>
        </li>
        <li :class="{ active: activeIndex === 4 }" @click="setActive(4, '#section5')">
          <div>커뮤니티</div>
        </li>
      </ul>
    </div>

    <!-- 섹션 1: 자산 -->
    <div id="section1" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">자산</h2>
          <p class="description">나의 자산을 한 눈에 <br />모아볼 수 있어요.</p>
          <p class="description-sub">
            예/적금, 주식, 채권, 코인, 현물자산 등<br />
            나의 모든 자산을 확인하세요.
          </p>
        </div>
        <div class="image-content-asset"></div>
      </div>
    </div>

    <!-- 섹션 2: 소득/소비 -->
    <div id="section2" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">소득/소비</h2>
          <p class="description">
            나의 소비를 <br />
            분석하고 절약해요.
          </p>
          <p class="description-sub">
            한 달 동안의 소비를 확인하고 <br />
            줄여야 될 소비를 볼 수 있어요.
          </p>
        </div>
        <div class="image-content-consume"></div>
      </div>
    </div>

    <!-- 섹션 3: 투자 -->
    <div id="section3" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">투자</h2>

          <p class="description">
            나의 투자유형을 <br />
            확인해보세요.
          </p>
          <p class="description-sub">
            나의 여유자금을 확인하고 <br />
            투자유형에 맞는 투자상품을 추천받아요.
          </p>
        </div>
        <div class="image-content-invest"></div>
      </div>
    </div>

    <!-- 섹션 4: 목표 -->
    <div id="section4" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">목표</h2>
          <p class="description">나의 목표를 설정해요.</p>
          <p class="description-sub">
            나의 자산/소비 목표를 설정하고 <br />
            이를 관리해요.
          </p>
        </div>
        <div class="image-content-goal"></div>
      </div>
    </div>

    <!-- 섹션 5: 커뮤니티! -->
    <div id="section5" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">커뮤니티</h2>

          <p class="description">
            다른 사람들은 어떻게 <br />
            자산을 모을까요?
          </p>

          <p class="description-sub">
            1억 이상의 자산을 가진 리치들의 <br />
            자산 관리 노하우를 들어봐요!
          </p>
        </div>
        <div class="image-content-community"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import richImage from '@/assets/images/rich.png'
import {useRouter} from 'vue-router'
import axiosInstance from '@/AxiosInstance';

const activeIndex = ref(0)
const router = useRouter()

function setActive(index, sectionId) {
  activeIndex.value = index
  const section = document.querySelector(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

async function goToSignIn() {
  const token = localStorage.getItem('authToken'); // 또는 sessionStorage에서 토큰을 가져옴
  console.log(token);
  if (token) {
    // 토큰이 있으면 자산 분석 페이지로 이동
    router.push({ path: '/asset/analysis' });
  } else {
    // 토큰이 없으면 로그인 페이지로 이동
    router.push({ path: '/user/signin' });
  }
}

</script>

<style scoped>
* {
  font-family: 'Pretendard', sans-serif;
  list-style: none;
  text-decoration: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.intro_bg {
  background: linear-gradient(180deg, #fff 0%, #fff2f6 100%);
  width: 100%;
  height: 640px;
  position: relative;
  display: flex; /* Flexbox를 사용하여 자식 요소 정렬 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
}

.main-container {
  margin-top: 100px;
}

.main-title {
  color: var(--black-default, #19181d);
  text-align: center;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 60px */
  letter-spacing: -0.8px;
}

.sub-title {
  color: var(--black-default, #19181d);
  text-align: center;
  font-family: Pretendard;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 63px */
}

.img-container {
  display: flex; /* 이미지만 중앙에 정렬하기 위해 Flexbox 사용 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 50px; /* 이미지 위쪽 여백 */
  margin-right: 100px;
}

.img {
  background-size: cover;
  background-repeat: no-repeat;
  height: 170px; /* 높이 설정 */
  width: 188px; /* 너비 설정 */
}

#start-btn {
  width: 150px;
  height: 60px;
  background: #ff0062;
  border-radius: 50px;
  font-size: 18px;
  color: #fff;
  border: none;
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.mid {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
  height: 80px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 500;
}

.mid-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  color: #666c77;
}

.mid-nav > li {
  margin: 0 25px;
  font-size: 16px;
  color: #666c77;
  cursor: pointer;
}

.mid-nav > li.active div {
  color: #19181d;
  font-weight: bold;
}

.section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 0;
  background-color: #fff;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
  margin-top: px; /* 상단에서 150px 떨어지게 설정 */
}

.text-content {
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  color: #ff0062;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  color: #19181d;
  font-size: 32px;
  line-height: 1.5;
  font-weight: bold;
  margin-top: 10px;
}

.description-sub {
  font-size: 24px;
  color: #414158;
  margin-top: 30px;
  line-height: 1.5;
}

.image-content {
  flex: 1;
  text-align: right;
  background-image: url('../assets/images/laptop-rich.png');
  background-size: cover;
  height: 350px;
  width: 585px;
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.1);
  border-radius: 20px;
}

.image-content-asset {
  flex: 1;
  text-align: right;
  background-image: url('../assets/images/laptop-rich.png');
  background-size: cover;
  height: 350px;
  width: 585px;
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.1);
  border-radius: 20px;
}

.image-content-consume {
  flex: 1;
  text-align: right;
  background-image: url('../assets/images/laptop-rich.png');
  background-size: cover;
  height: 350px;
  width: 585px;
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.1);
  border-radius: 20px;
}

.image-content-invest {
  flex: 1;
  text-align: right;
  background-image: url('../assets/images/laptop-rich.png');
  background-size: cover;
  height: 350px;
  width: 585px;
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.1);
  border-radius: 20px;
}

.image-content-goal {
  flex: 1;
  text-align: right;
  background-image: url('../assets/images/laptop-rich.png');
  background-size: cover;
  height: 350px;
  width: 585px;
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.1);
  border-radius: 20px;
}

.image-content-community {
  flex: 1;
  text-align: right;
  background-image: url('../assets/images/laptop-rich.png');
  background-size: cover;
  height: 350px;
  width: 585px;
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.1);
  border-radius: 20px;
}
</style>
