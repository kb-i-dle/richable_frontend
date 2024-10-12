<template>
  <div class="container">
    <!-- 상단 질문 텍스트 -->
    <div class="total-asset-title">나의 자산 중 여유자금은 얼마일까요?</div>
    <div class="total-asset">
      <div class="total-asset-sub">
        나의 전체 자산 중 바로 투자를 할 수 있는 <br />
        여유자금은 <p style="display: inline; font-size: 18px;" class="highlight">{{ availableCash.toLocaleString() }}원</p> 이에요.
      </div>
    </div>

    <!-- 도넛 차트 영역 -->
    <div class="d-flex justify-content-center align-items-center mb-5 chart-container1">
      <div class="chart-container2">
        <div class="donut-chart">
          <svg viewBox="0 0 36 36">
            <path
              class="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="circle"
              :stroke-dasharray="`${availablePercentage}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="chart-label">{{ availablePercentage.toFixed(0) }}%</div>
        </div>
      </div>

      <!-- 범례 추가 -->
      <div class="legend-container d-flex justify-content-center align-items-center">
        <div class="legend-item">
          <span class="legend-box total"></span> 총 자산
        </div>
        <div class="legend-item">
          <span class="legend-box available"></span> 여유 자금
        </div>
      </div>
    </div>

    <div class="cha-title">
      <div class="cha-title-sub">
        "{{ nickname }}"님은 <p style="display: inline; color: #ff0062;">{{ tendency }}</p> 성향 입니다.
      </div>
      <div class="cha-title-main">{{ category }} 상품에 여유자금으로 투자하기</div>
    </div>

    <!-- 로딩 상태에 따른 투자 성향 및 카테고리 정보 표시 -->
    <div v-if="isLoadingTendency" class="spinner-container">
      <div class="spinner scroll-wrapper"></div>
    </div>
    <div v-else class="cha-title">
      <div class="cha-title-sub">
        "{{ nickname }}"님의 <p style="display: inline; color: #ff0062;">{{ tendency }}</p> 성향을 기반으로 추천드려요.
      </div>
      <div class="cha-title-main">{{ category }} 상품에 여유자금으로 투자하기</div>
    </div>

    <!-- 스크롤 가능한 추천 상품 리스트 -->
    <div v-else class="scroll-wrapper">
      <button @click="scrollLeft">
        <font-awesome-icon style="color: #fff;" :icon="['fas', 'chevron-left']" />
      </button>
      <div class="scroll-container" ref="scrollContainer">
        <div class="scroll-item" v-for="(product, index) in recommendedProducts" :key="index">
          <div class="custom-card">
            <div class="card-body">
              <p :class="getRiskClass(product.prodCategroy)">위험도 {{ getRiskLevel(product.prodCategroy) }}</p>
              <div class="product-name mb-2 text-muted">{{ product.name }}</div>
              <div style="display: flex; justify-content: space-between;">
                <p class="product-price">{{ product.price.toLocaleString() }}원</p>
                <p class="unit-price text-muted">단위당 가격</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="scrollRight">
        <font-awesome-icon style="color: #fff;" :icon="['fas', 'chevron-right']" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/AxiosInstance';

const availableCash = ref(0); // 여유 자금
const availablePercentage = ref(0); // 여유 자금 비율
const totalAssets = ref(0); // 전체 자산
const recommendedProducts = ref([]); // 추천 상품
const tendency = ref(''); // 투자 성향 데이터
const category = ref(''); // 카테고리 데이터
const nickname = ref(''); // 닉네임 데이터 추가
const isLoadingTendency = ref(true);

const scrollContainer = ref(null);

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -300, // 왼쪽으로 스크롤할 거리
      behavior: 'smooth',
    });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 300, // 오른쪽으로 스크롤할 거리
      behavior: 'smooth',
    });
  }
};

// 위험도 가져오기 함수
const getRiskLevel = (category) => {
  if (category === '채권') return '중';
  if (category === '주식') return '상';
  if (category === '코인') return '상';
  return '알 수 없음'; // 기본값 설정
};

// 위험도에 따른 클래스 설정 함수
const getRiskClass = (category) => {
  if (category === '채권') return 'risk-medium';
  if (category === '주식') return 'risk-high';
  if (category === '코인') return 'risk-high';
  return '';
};

onMounted(() => {
  const token = localStorage.getItem('authToken'); // JWT 토큰 가져오기

  if (token) {
    // 전체 자산 가져오기
    axiosInstance.get('/finance/total/sum')
      .then(response => {
        if (response.data.success) {
          totalAssets.value = response.data.response.data.amount; // 총 자산에서 amount 추출

          // 여유 자금 가져오기
          return axiosInstance.get('/invest/available');
        } else {
          console.error("전체 자산 데이터를 가져오는데 실패했습니다.");
        }
      })
      .then(response => {
        if (response && response.data.success) {
          availableCash.value = response.data.response.data.availableCash; // 여유 자금 설정
          availablePercentage.value = calculatePercentage(availableCash.value); // 비율 계산
        } else {
          console.error("여유 자금 데이터를 가져오는데 실패했습니다.");
        }
      })
      .catch(error => {
        console.error("데이터 가져오는 중 에러 발생:", error);
      });

    // 추천 상품 가져오기
    axiosInstance.get('/invest/recommended')
      .then(response => {
        if (response.data.success) {
          recommendedProducts.value = response.data.response.data; // 추천 상품 설정
          isLoadingTendency.value = false; // 데이터 로딩 완료 후 로딩 상태 변경
        } else {
          console.error("추천 상품을 가져오는데 실패했습니다.");
        }
      })
      .catch(error => {
        console.error("추천 상품을 가져오는 중 에러 발생:", error);
      });

    // 투자 성향 및 카테고리 데이터 가져오기
    axiosInstance.get('/invest/tendency')
      .then(response => {
        if (response.data.success) {
          tendency.value = response.data.response.data.tendency; // 투자 성향 데이터 설정
          category.value = response.data.response.data.category; // 카테고리 데이터 설정
        } else {
          console.error("투자 성향 데이터를 가져오는데 실패했습니다.");
        }
      })
      .catch(error => {
        console.error("투자 성향 데이터를 가져오는 중 에러 발생:", error);
      });

    // 닉네임 가져오기
    axiosInstance.get('/member/info')
      .then(response => {
        if (response.data.success) {
          nickname.value = response.data.response.data.data.nickname; // 닉네임 설정
        } else {
          console.error("닉네임 데이터를 가져오는데 실패했습니다.");
        }
      })
      .catch(error => {
        console.error("닉네임 데이터를 가져오는 중 에러 발생:", error);
      });
  } else {
    console.error('JWT 토큰이 localStorage에 없습니다.');
    isLoadingTendency.value = false; // 오류 발생 시에도 로딩 상태 변경
  }
});

// 여유 자금 비율 계산 함수
const calculatePercentage = (cash) => {
  // totalAssets 값이 0이거나 아직 설정되지 않았을 경우 대비
  if (!totalAssets.value || totalAssets.value === 0) {
    return 0; // 비율을 계산할 수 없으므로 0% 반환
  }
  return (cash / totalAssets.value) * 100; // 비율 계산
};
</script>

<style scoped>
* {
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
  max-width: 1704px;
}

.container {
  margin: 80px;
}

.total-asset {
  border-radius: 20px;
  margin-top: 18px;
  background-color: #f9f9f9;
  height: 120px;
  padding: 25px;
}

.total-asset-title {
  margin-top: 8xp;
  color: var(--4, #1D1616);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px;
}

.total-asset-sub {
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: -0.8px;
}

.highlight {
  color: var(--Primary-30, #FF0062);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: -0.8px;
}

.chart-container1 {
  height: 320px;
  margin-top: 18px;
  border-radius: 20px;
  border: 1px solid #e4ebf0;
  background: #FFF;
  display: flex;
  flex-direction: column;
}

.chart-container2 {
  width: 200px;
  height: 200px;
  position: relative;
}
.donut-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.donut-chart svg {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke: #ff0062;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.chart-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: var(--3, #414158);
}
.legend-container {
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  font-size: 14px;
}

.legend-box {
  border-radius: 20%;
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
}

.legend-box.total {
  background-color: #eee; /* 총 자산 색상 */
}

.legend-box.available {
  background-color: #ff0062; /* 여유 자금 색상 */
}

.cha-title {
  margin-top: 100px;
}

.cha-title-sub {
  color: var(--4, #1D1616);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.36px;
}

.cha-title-main {
  color: var(--4, #1D1616);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: -0.36px;
}

.custom-card {
  height: 180px;
  display: flex;
  width: 300px;
  padding: 30px;
  flex-direction: column;
  gap: 17px;
  flex-shrink: 0;
  border-radius: 12px;
  background-color: #f9f9f9;
  text-align: left;
  border-radius: 20px;
  background: #FFF;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);
}

.risk-level {
  color: var(--2, #8A8AA8);
  text-align: left;
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px;
}

.risk-medium {
  color: orange;
}

.risk-low {
  color: green;
}

.risk-high {
  color: red;
}

.product-name {
  color: var(--3, #414158);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 27px;
}

.product-price {
  color: #19181d;
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 27px;
}

.unit-price {
  color: var(--2, #8A8AA8);
  text-align: right;
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
}

.scroll-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 250px;
}

.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  padding: 20px 50px;
  margin: 20px;
}

.scroll-item {
  flex: 0 0 280px;
  scroll-snap-align: start;
  margin-right: 20px;
}

button {
  background-color: #ff0062;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 55px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

button:hover {
  background-color: #d4004f;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #ff0062;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
