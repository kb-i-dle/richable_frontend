<template>
  <div style="margin-bottom:100px;" class="top-return-asset-page container">

    <div class="total-asset">
      <div class="total-asset-sub">리치들이 투자한 상품 중 </div>
      <div class="total-asset-title">전일 대비 수익률이 높은 자산은?</div>
    </div>

    <!-- 필터 섹션 -->
    <div class="filters">
      <button
        v-for="(filter, index) in filters"
        :key="index"
        :class="['filter-btn', selectedFilter === filter ? 'active' : 'inactive']"
        @click="filterAssets(filter)"
      >
        {{ filter }}
      </button>
    </div>

    <!-- 상위 수익 자산 카드 -->
    <div class="card-container">
      <div v-if="topAssets.length === 0">상위 자산이 없습니다.</div>
      <div v-else v-for="(asset, index) in topAssets" :key="index" class="custom-card">
        <div class="rank"> {{ index + 1 }} </div>
        <div style="margin-left:30px;">
          <div class="type">{{ asset.category }}</div>
          <div class="name">{{ asset.name }} </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
          <div style="font-size: 24px;"class="return-rate">{{ asset.rate }}%</div>
          <div class="price" style="margin-left: 45px;">{{ asset.price }}원</div>
        </div>
        </div>
      </div>
    </div>

    <!-- 자산 목록 표 -->
    <div class="table-card card">
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th style="width: 10%;">순위</th>
            <th style="width:15%">종류</th>
            <th style="width:30%">자산명</th>
            <th style="width:25%">가격</th>
            <th style="width:25%">수익률</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(asset, index) in filteredAssets" :key="index">
            <td>{{ index+1  }}</td>
            <td>{{ asset.category }}</td>
            <td>{{ asset.name }}</td>
            <td>{{ asset.price }}원</td>
            <td class="return-rate">{{ asset.rate }} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import axiosInstance from '@/AxiosInstance';

// JWT 토큰을 저장 (예: 로그인 후 받은 토큰)
const token = localStorage.getItem('authToken');

// 필터 항목들
const filters = ['전체', '주식', '코인']
const selectedFilter = ref('전체')

// 상위 수익 자산 데이터
const topAssets = ref([])

// 필터링된 자산 목록
const filteredAssets = ref([])

// 전체 자산 데이터 (API 호출 결과를 저장할 변수)
let allAssets = ref([])

// 필터 클릭 시 실행되는 함수
const filterAssets = async (filter) => {
  selectedFilter.value = filter;
  let url = '/invest/highreturn'; // 전체 조회

  if (filter === '주식') {
    url = '/invest/highreturn/stock';
  } else if (filter === '코인') {
    url = '/invest/highreturn/coin';
  }

  try {
    const response = await axiosInstance.get(url);
    if (response.data.success) {
      allAssets.value = response.data.response.data.map(item => ({
        name: item.name,
        category: item.category,
        rate: parseFloat(item.rate.replace('%', '')), // 수익률을 숫자로 변환
        price: item.price.toLocaleString() // 천 단위 구분 추가
      }));
      filterAssetsByType();
    } else {
      console.error('API 응답 실패:', response.data.message);
    }
  } catch (error) {
    console.error('자산 데이터를 불러오는 중 오류 발생:', error);
  }
}

// 선택된 필터에 따른 자산 필터링 및 정렬
const filterAssetsByType = () => {
  let filtered = allAssets.value;
  
  if (selectedFilter.value !== '전체') {
    filtered = allAssets.value.filter(asset => asset.category === selectedFilter.value);
  }

  // 수익률 기준으로 내림차순 정렬
  filtered.sort((a, b) => b.rate - a.rate);

  filteredAssets.value = filtered;
  topAssets.value = filteredAssets.value.slice(0, 3); // 상위 3개만 topAssets에 저장
}

// 페이지 로드 시 전체 자산을 불러옴
onMounted(() => {
  filterAssets('전체'); // 초기 로드 시 전체 자산 조회
})
</script>

<style scoped>
*{
  font-family: pretendard;
  color: #19181d;
}

.total-asset-title {
  color: var(--4, #1D1616);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
}

.total-asset-sub {
  text-align: left;
  color: var(--4, #1D1616);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px; /* 160% */
  letter-spacing: -0.8px;
}

/* 전체 페이지 여백 */
.top-return-asset-page {
  margin-top: 40px;
  padding: 20px;
}

/* 필터 스타일 */
.filters {
  display: flex;
  border-bottom: 2px solid #414158;
  margin-top: 22px;
}

.filter-btn {
  padding: 10px 25px;
  width: 100px;
  height: 48px;
  margin-bottom: -2px;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #9e9e9e;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
}

.filter-btn.active {
  background-color: #3e3e3e;
  color: white;
}

.filter-btn.inactive {
  border: 1px solid #ccccd6;
}

/* 카드 스타일 */
.card-container {
  display: flex;
  gap: 30px;
  margin-top: 40px;
  justify-content: center; /* 가로 중앙 정렬 */
}


.custom-card {

  text-align: left;
  height: 200px;
  width: 350px;
  display: flex;

  padding: 55px 20px;

  flex-direction: row;

  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  
  border: 1px solid #e0e0e0;
  font-size: 18px;
}

/* 순위, 타입, 이름, 수익률, 가격을 세로로 중앙 정렬 */
.rank {
  color: #414158;
  font-family: pretendard;
  font-size: 48px;
  font-weight: 400;
  align-self: flex-start; /* 순위를 위에 고정 */
}

.name {
  color: var(--3, #19181d);
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
  line-height: 27px;
}

.type {
  color: var(--2, #8a8aa8);
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 400;
  line-height: 27px;
}

/* 카드 안의 요소를 좌우 끝에 배치 */
.price,
.return-rate {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.price {
  color: var(--2, #8a8aa8);
  text-align: right;
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
}

.return-rate {
  font-size: 24px;
  color: var(--primary-30, #ff0062);
}

/* 표 스타일 */
.table-card {
  margin-top: 40px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 18px;
}

.table th,
.table td {
  text-align: center;
  padding: 20px;
}

table {
  font-family: pretendard;
  font-size: 18px;
  width: 100%;
  text-align: center;
}


th {
  border-radius: 10px;
  font-weight: 600;
  background-color: #f9f9f9;
  color: #333;
}

td {
  font-size: 16px;
  color: #555;
}

.return-rate {
  color: var(--primary-30, #ff0062);
  text-align: right;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.48px;
}
/* 태블릿용 */
@media (min-width: 768px) and (max-width: 1023px) {
  .top-return-asset-page {
    padding: 15px;
  }

  .filters {
    justify-content: space-between;
  }

  .custom-card {
    height: 180px;
    width: 300px;
    padding: 40px 15px;
  }

  .rank {
    font-size: 36px;
  }

  .table th, .table td {
    font-size: 16px;
  }
}

/* 모바일용 */
@media (max-width: 767px) {
  .top-return-asset-page {
    padding: 10px;
  }

  .filters {
    justify-content: space-around;
  }

  .custom-card {
    height: 150px;
    width: 240px;
    padding: 30px 10px;
  }

  .rank {
    font-size: 28px;
  }

  .name {
    font-size: 16px;
  }

  .type {
    font-size: 14px;
  }

  .price, .return-rate {
    font-size: 16px;
  }

  .table th, .table td {
    font-size: 14px;
    padding: 10px;
  }
}
</style>
