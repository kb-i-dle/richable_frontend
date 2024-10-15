<template>
  <div class="content-container">
    <!-- 상단 자산 정보 -->
    <div class="total-asset">
      <div class="asset-title">{{ userName }}님의 자산 현황 😎</div>
      <div class="asset-amount">{{ currentAsset ? currentAsset.toLocaleString() : 0 }}원</div>
    </div>

    <!-- 전체 자산 비교 -->
    <div class="asset-graph-container">
      <div class="asset-analysis-nav">
        <div class="tooltip-box">
              <button
                class="tool-btn"
                ref="tooltipButton"
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                :title="tooltipMessage"
              >
                <font-awesome-icon icon="circle-question" style="font-size: 25px" />
              </button>
            </div>
        <div class="asset-title">전체 자산 비교</div>
      </div>

      <div class="asset-graph-container2">
        <!-- 20대 평균 자산과 나의 자산 비교 (막대 차트) -->
        <div class="graph-container">
          <div class="graph-container-title">
            {{ userName }}님의 자산은 <br />
            20대 평균보다 
<strong style="color:#ff0062">
  {{ assetDifference > 0 
    ? Math.floor(assetDifference).toLocaleString() + '만원 많습니다.' 
    : Math.floor(Math.abs(assetDifference)).toLocaleString() + '만원 적습니다.' }}
</strong>
</div>
          <canvas id="barChart" class="chart-size"></canvas>
        </div>

        <!-- 카테고리별 자산 비교 (레이더 차트) -->
        <div class="graph-container">
          <div class="graph-container-title">
            {{ userName }}님의 카테고리별 자산 비교
          </div>
          <canvas id="radarChart" class="chart-size"></canvas>
        </div>
      </div>
    </div>

<!-- 자산 비교 테이블 -->
<div class="compare-table">
  <table>
    <thead>
      <tr>
        <th>종목</th>
        <th>나의 자산</th>
        <th>평균 자산</th>
        <th>비교</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in assetList" :key="index">
        <td><strong>{{ item.category }}</strong></td>
        <td>{{ item.myAsset ? Math.floor(item.myAsset / 10000).toLocaleString() : 0 }}만원</td>
        <td>{{ item.averageAsset ? Math.floor(item.averageAsset / 10000).toLocaleString() : 0 }}만원</td>
        <td>
          <span v-if="item.difference > 0">
            <strong style="color:#FF0062">
              {{ Math.floor(item.difference / 10000).toLocaleString() }}만원 
              <font-awesome-icon style="color:#FF0062" :icon="['fas', 'caret-up']" />
            </strong>
          </span>
          <span v-else-if="item.difference < 0">
            <strong style="color:#2768FF">
              {{ Math.floor(Math.abs(item.difference / 10000)).toLocaleString() }}만원 
              <font-awesome-icon style="color:#2768FF" :icon="['fas', 'caret-down']" />
            </strong>
          </span>
          <span v-else style="color:#2768FF">
            차이 없음
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>


    <!-- 로딩 및 오류 메시지 -->
    <div v-if="loading">로딩 중...</div>
    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables, Tooltip } from 'chart.js';
import axiosInstance from '@/AxiosInstance.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Tooltip as BootstrapTooltip } from 'bootstrap'


Chart.register(...registerables);

// 사용자 이름
const userName = "김리치";


// 현재 자산 정보 및 자산 차이
const currentAsset = ref(0);
const peerAverageAsset = ref(0); // 20대 평균 자산
const assetDifference = ref(0); // 내 자산과 20대 평균 자산의 차이

// 자산 리스트 (카테고리별)
const assetList = ref([]);

// 로딩 상태 및 오류 메시지
const loading = ref(false);
const errorMessage = ref('');

const tooltipButton = ref(null) // 툴팁 버튼
const tooltipInstance = ref(null) // 툴팁 인스턴스
const tooltipMessage = ref('평균값은 KOSIS 산업별 가구당 월 [평균] 가계수지 입니다.')


const fetchFinancialAssetsSum = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axiosInstance.get('/finance/fin/sum');
    console.log('Financial Assets Sum Response:', response.data); // 응답 확인

    if (response.data.success && response.data.response.data) {
      const total = response.data.response.data.amount; // amount 추출
      currentAsset.value = total; // 총 자산 값 설정
      console.log('Current Asset:', currentAsset.value); // 자산 값 확인
    } else {
      errorMessage.value = '자산 데이터가 올바르지 않습니다.';
    }
  } catch (error) {
    errorMessage.value = '금융 자산을 가져오는 데 실패했습니다.';
    console.error('Error fetching financial asset sum:', error);
  } finally {
    loading.value = false;
  }
};

// 20대 평균 자산 데이터를 가져오는 함수
const fetchPeerData = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axiosInstance.get('/finance/peer');
    console.log('Peer Data Response:', response.data); // 응답 확인

    if (response.data.success && response.data.response.data) {
      peerAverageAsset.value = response.data.response.data.spotAvgAmount; // 평균 자산 설정
      assetDifference.value = (currentAsset.value - peerAverageAsset.value) / 10000; // 만원 단위로 차이 계산
      console.log('Peer Average Asset:', peerAverageAsset.value); // 평균 자산 값 확인
      console.log('Asset Difference:', assetDifference.value); // 자산 차이 확인
    } else {
      errorMessage.value = '동료 자산 데이터를 가져오는 데 실패했습니다.';
    }
  } catch (error) {
    errorMessage.value = '동료 자산 데이터를 가져오는 데 실패했습니다.';
    console.error('Error fetching peer data:', error);
  } finally {
    loading.value = false;
  }
};


// 카테고리 매핑 (영어 -> 한국어)
const categoryMapping = {
  bond: '채권',
  deposit: '예금',
  saving: '적금',
  subscription: '청약',
  withdrawal: '입출금',
  stock: '주식',
  cash: '현금',
  coin: '코인'
};

// 금융 자산별 또래 자산 비교 데이터를 가져오는 함수
const fetchPeerFinanceData = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await axiosInstance.get('/finance/peer/finance');
    const financeData = response.data.response.data;

    if (Array.isArray(financeData)) {
      console.log(financeData)
      assetList.value = financeData.map(item => ({
        category: categoryMapping[item.category] || item.category, // 카테고리 한국어 변환
        myAsset: item.bsAmount,
        averageAsset: item.categoryAvgAmount,
        difference: item.bsAmount - item.categoryAvgAmount // 비교값 계산
      }));
    } else {
      console.error("Expected an array but got: ", financeData);
      errorMessage.value = "예상한 배열을 받지 못했습니다.";
      assetList.value = [];
    }
  } catch (error) {
    errorMessage.value = '금융 자산 비교 데이터를 가져오는 데 실패했습니다.';
    console.error('Error fetching peer finance data:', error);
  } finally {
    loading.value = false;
  }
};

// 차트 생성 함수
const createCharts = () => {
  const barCtx = document.getElementById('barChart').getContext('2d');
  const radarCtx = document.getElementById('radarChart').getContext('2d');

  // 카테고리별 자산 데이터 가져오기
  const categories = assetList.value.map(item => item.category);
  const myAssets = assetList.value.map(item => item.myAsset / 10000);
  const avgAssets = assetList.value.map(item => item.averageAsset / 10000);

  // 그라디언트 색상 설정
  const gradientBar = barCtx.createLinearGradient(0, 0, 0, 400);
  gradientBar.addColorStop(0, '#ff0062');
  gradientBar.addColorStop(1, '#ff80b2');

  const gradientRadarMyAssets = radarCtx.createLinearGradient(0, 0, 0, 400);
  gradientRadarMyAssets.addColorStop(0, '#ff6384');
  gradientRadarMyAssets.addColorStop(1, '#ff80b2');

  const gradientRadarAvgAssets = radarCtx.createLinearGradient(0, 0, 0, 400);
  gradientRadarAvgAssets.addColorStop(0, '#4bc0c0');
  gradientRadarAvgAssets.addColorStop(1, '#80e1e1');

// 막대 차트
new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: ['20대 평균', '나의 자산'],
    datasets: [
      {
        label: '자산 비교',
        data: [peerAverageAsset.value, currentAsset.value],
        backgroundColor: ['#CCCCCC', '#FF0062'], // 첫 번째 바는 회색, 두 번째 바는 핑크색
        borderColor: ['#CCCCCC', '#FF0062'], // 나의 자산 테두리 색상
        borderWidth: 2, // 테두리 두께
        hoverBorderWidth: 3, // 호버 시 강조 효과
        hoverBorderColor: '#ff4081', // 호버 시 색상
        borderRadius: 10, // 막대 모서리 둥글게 설정
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // 차트 비율 유지 안함 (화면에 맞게 조절)
    scales: {
      y: {
        display: true,
        beginAtZero: true, // y축 0부터 시작
        grid: {
          drawBorder: false, // y축 테두리 안 그림
          color: 'rgba(200, 200, 200, 0.3)', // y축 그리드 라인 색상
        },
        ticks: {
          font: {
            size: 12, // y축 글자 크기
          },
          color: '#666', // y축 글자 색상
        }
      },
      x: {
        grid: {
          display: false, // x축 그리드 숨김
        },
        ticks: {
          color: '#666', // x축 글자 색상
          font: {
            size: 12, // x축 글자 크기
            weight: 500, // x축 글자 굵게
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // 범례 숨김
      },
      tooltip: {
        backgroundColor: '#ff4081', // 툴팁 배경색
        titleFont: {
          size: 12, // 툴팁 제목 글자 크기
        },
        bodyFont: {
          size: 12, // 툴팁 내용 글자 크기
        },
      },
    },
  },
});


  // 레이더 차트
new Chart(radarCtx, {
  type: 'radar',
  data: {
    labels: categories,
    datasets: [
      {
        label: '평균 자산',
        data: avgAssets,
        backgroundColor: 'rgba(204, 204, 204, 0.55)',
        borderColor: '#cccccc',
        borderWidth: 2,
        // pointBackgroundColor: '#ff6384', // 포인트 색상
        // pointHoverRadius: 7, // 포인트 호버 반경
        // pointHoverBackgroundColor: '#ff0062', // 포인트 호버 색상
        pointBorderColor: '#fff', // 포인트 테두리 색상
        // pointBorderWidth: 2, // 포인트 테두리 두께
      },
      {
        label: '나의 자산',
        data: myAssets,
        backgroundColor: 'rgba(255, 84, 150, 0.55)',
        borderColor: '#ff6384',
        borderWidth: 2,
        // pointBackgroundColor: '#ff6384', // 포인트 색상
        // pointHoverRadius: 7, // 포인트 호버 반경
        // pointHoverBackgroundColor: '#ff0062', // 포인트 호버 색상
        pointBorderColor: '#fff', // 포인트 테두리 색상
        // pointBorderWidth: 2, // 포인트 테두리 두께
      }
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: Math.max(...myAssets, ...avgAssets),
        ticks: {
          stepSize: 1000,
          font: {
            size: 11,
            family: "'Pretendard', sans-serif",
          }
        },
        grid: {
          color: '#ddd', // 그리드 색상
        },
        angleLines: {
          color: '#bbb', // 각 라인의 색상
        },
        pointLabels: {
          font: {
            size: 14,
            family: "'Pretendard', sans-serif",
          },
          color: '#333', // 각 축 라벨 색상
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Pretendard', sans-serif",
          },
          color: '#333', // 범례 라벨 색상
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 툴팁 배경색
        titleFont: {
          size: 14,
          family: "'Pretendard', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Pretendard', sans-serif",
        },
        bodyColor: '#fff', // 툴팁 내용 글자색
        borderColor: '#333', // 툴팁 테두리 색상
        borderWidth: 1, // 툴팁 테두리 두께
      }
    }
  },
});

};

// 데이터 가져오기 후 차트 생성 및 테이블 반영
onMounted(async () => {
  await fetchFinancialAssetsSum();
  await fetchPeerData();
  await fetchPeerFinanceData();
  createCharts(); // 차트 생성을 데이터 fetch 후에 실행
});
</script>

<style scoped>
* {
  text-align: center;
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}

.content-container {
  margin: 40px auto;
  max-width: 1440px;
  padding: 0 40px;
}

.total-asset {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 40px;
}

.asset-title {
  font-size: 20px;
  font-weight: 500;
  margin-top: 10px;
}

.asset-amount {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.asset-graph-container {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.asset-analysis-nav {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.graph-container-title {
  font-size: 18px;
  padding: 30px;
  background-color: #f9f9f9;
  border: 1px solid #e4ebf0;
  color: var(--black-default, #19181D);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  border-radius: 20px;
}

.asset-graph-container2 {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.graph-container {
  margin: 0 20px;
  width: 450px; /* 폭 조정 */
  height: 400px; /* 높이 조정 */
}

.chart-size {
  margin-top: 8px;
  border: 1px solid #e4ebf0;
  border-radius: 20px;
  width: 100%;
  height: 300px; /* 차트 크기 축소 */
}

.compare-table {
  margin-top: 150px;
}

table {
  font-family: pretendard;
  font-size: 18px;
  width: 100%;
  text-align: center;
}

th, td {
  font-size: 18px;
  height: 35px;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

th {
  font-weight: 600;
  background-color: #f9f9f9;
  color: #333;
}

td {
  font-size: 16px;
  color: #555;
}

.tooltip-inner {
  white-space: nowrap !important;
}

.tooltip-box {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
}

.tooltip-box button {
  border: none; /* 테두리 제거 */
  background: none; /* 배경 제거 */
  padding: 0; /* 여백 제거 */
  cursor: pointer; /* 클릭 가능한 마우스 커서 */
  outline: none; /* 버튼 선택 시 나타나는 윤곽선 제거 */
}


.tooltip-inner {
  font-family: 'Pretendard';
  max-width: 400px !important;
  white-space: normal !important;
  font-size: 12px;
}
</style>
