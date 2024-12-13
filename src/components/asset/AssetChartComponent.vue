<template>
    <div class="asset-analysis-container">
        <div class="asset-analysis-nav">
          <div class="asset-analysis-title">나의 자산</div>
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
          <div  style="margin-top: 50px;"class="asset-analysis-btn">
            <!-- 체크박스 클릭 이벤트를 통해 값을 업데이트 -->
            <input style="margin-bottom: 16px;" type="checkbox" v-model="includePhysicalAssets" @change="handleCheckboxChange" />
            <p>현물자산 포함</p>
          </div>
        </div>

        <div class="asset-analysis-content">
          <div class="asset-analysis-content-container1">
            <div class="graph-container2">
              <p class="graph-title2">
                {{ highestAsset.prodCategory }} 자산 비중이 <br />
                제일 높아요
              </p>
              <div class="asset-analysis-graph">
                <canvas ref="pieChart"></canvas>
              </div>
            </div>
            <div style="width: 350px" class="asset-analysis-table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th style="text-align: center">총 상품자산</th>
                    <th style="text-align: center">{{ formatCurrency(displayAsset) }}원</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(asset, index) in paginatedAssets"
                    :key="index"
                    @click="toggleDetails(asset)"
                    class="clickable-row"
                  >
                    <td style="text-align: center">{{ asset.prodCategory }}</td>
                    <td style="text-align: center">{{ formatCurrency(asset.amount) }}원</td>
                  </tr>
                </tbody>
              </table>
              <!-- Pagination -->
              <nav>
                <ul class="pagination justify-content-center">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="prevPage">
                        <font-awesome-icon :icon="['fas', 'chevron-left']" />
                    </a>
                  </li>
                  <li class="page-item disabled">
                    <a class="page-link" href="#">{{ currentPage }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="nextPage">
                        <font-awesome-icon :icon="['fas', 'chevron-right']" />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- 자산 변화 그래프 -->
          <div class="text-center asset-analysis-content-container2" style="margin-top: 60px;">
            <p>
              총자산이 지난달보다 <br />
              <strong>{{ assetDifferenceMessage }}</strong>
            </p>
            <div class="asset-analysis-graph-container2">
              <canvas class="text-center" ref="barChart"></canvas>
            </div>
          </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import instance from '@/AxiosInstance.js'
import { Tooltip as BootstrapTooltip } from 'bootstrap'
import { useAuthStore } from '@/stores/auth';

Chart.register(
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
)

// 상태 관리
const includePhysicalAssets = ref(false)
const finAsset = ref(0)
const totalAsset = ref(0)
const finAssetTotal = ref([])
const electronicSpot = ref({})
const otherSpot = ref({})
const carSpot = ref({})
const brandSpot = ref({})
const luxSpot = ref({})
const paginatedAssets = ref([])
const changedFin = ref([])
const changedSpot = ref([])
const assetDifferenceMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(6)
const pieChart = ref(null)
const barChart = ref(null)

const tooltipButton = ref(null) // 툴팁 버튼
const tooltipButton2 = ref(null) // 툴팁 버튼
const tooltipInstance = ref(null) // 툴팁 인스턴스
const tooltipInstance2 = ref(null) // 툴팁 인스턴스
const tooltipMessage = ref('예적금은 [예금], [적금], [현금], [입출금] 이 포함된 값 입니다.')
const tooltipMessage2 = ref('금융자산과 등록해주신 현물을 합산한 값 입니다.')

const auth = useAuthStore();

let chartInstance = null
let barChartInstance = null

watch(() => tooltipButton2.value, (newVal) => {
  if (newVal) {
    newVal.setAttribute('title', tooltipMessage2.value);
    tooltipInstance2.value = new BootstrapTooltip(newVal);
    resetTooltips();
    console.log('Tooltip 2 initialized');
  }
});

const displayAsset = computed(() =>
  includePhysicalAssets.value ? totalAsset.value : finAsset.value
)
const displayedSixMonth = computed(() =>
  includePhysicalAssets.value ? changedSpot.value : changedFin.value
)


const categoryMapping = {
  car: '자동차',
  elec: '전자기기',
  brand: '브랜드',
  luxury: '명품',
  etc: '기타'
}

// 가장 큰 자산 항목 계산
const highestAsset = computed(() => {
  if (displayedAssetList.value.length > 0) {
    const highest = displayedAssetList.value.reduce((prev, current) =>
      prev.amount > current.amount ? prev : current
    )

    // 매핑된 카테고리로 변환하여 반환
    return {
      prodCategory: categoryMapping[highest.prodCategory] || highest.prodCategory, // 매핑되지 않은 카테고리는 원래 값 유지
      amount: highest.amount
    }
  }

  // 기본 값 반환
  return { prodCategory: '자산', amount: 0 }
})

// 금액 포맷 함수
const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) {
    return '0' // 금액이 없거나 유효하지 않을 때 기본값으로 '0' 반환
  }
  return amount.toLocaleString('ko-KR')
}


const fetchData = async () => {
  try {
    const [
      finSum,
      totalSum,
      fin,
      changedFinData,
      changedSpotData,
      elecSpotData,
      etcSpotData,
      carSpotData,
      luxSpotData,
      brandSpotData,
    ] = await Promise.all([
      instance.get('/finance/fin/sum').catch((err) => ({ error: true, err })),
      instance.get('/finance/total/sum').catch((err) => ({ error: true, err })),
      instance.get('/finance/fin').catch((err) => ({ error: true, err })),
      instance.get('/finance/changed/fin').catch((err) => ({ error: true, err })),
      instance.get('/finance/changed/spot').catch((err) => ({ error: true, err })),
      instance.get('/finance/spot/elec/sum').catch((err) => ({ error: true, err })),
      instance.get('/finance/spot/etc/sum').catch((err) => ({ error: true, err })),
      instance.get('/finance/spot/car/sum').catch((err) => ({ error: true, err })),
      instance.get('/finance/spot/luxury/sum').catch((err) => ({ error: true, err })),
      instance.get('/finance/spot/brand/sum').catch((err) => ({ error: true, err })),
    ])

    // 데이터 저장
    finAsset.value = finSum?.error ? 0 : finSum?.data?.response?.data?.amount || 0
    totalAsset.value = totalSum?.error ? 0 : totalSum?.data?.response?.data?.amount || 0
    finAssetTotal.value = fin?.error ? [] : fin?.data?.response?.data || []
    changedFin.value = changedFinData?.error ? {} : changedFinData?.data?.response?.data || {}
    changedSpot.value = changedSpotData?.error ? {} : changedSpotData?.data?.response?.data || {}

    // 자산 카테고리별 데이터가 없을 때 기본값 설정
    electronicSpot.value = elecSpotData?.error
      ? { prodCategory: '전자기기', amount: 0 }
      : elecSpotData?.data?.response?.data || { prodCategory: '전자기기', amount: 0 }
    otherSpot.value = etcSpotData?.error
      ? { prodCategory: '기타', amount: 0 }
      : etcSpotData?.data?.response?.data || { prodCategory: '기타', amount: 0 }
    carSpot.value = carSpotData?.error
      ? { prodCategory: '자동차', amount: 0 }
      : carSpotData?.data?.response?.data || { prodCategory: '자동차', amount: 0 }
    luxSpot.value = luxSpotData?.error
      ? { prodCategory: '명품', amount: 0 }
      : luxSpotData?.data?.response?.data || { prodCategory: '명품', amount: 0 }
    brandSpot.value = brandSpotData?.error
      ? { prodCategory: '브랜드', amount: 0 }
      : brandSpotData?.data?.response?.data || { prodCategory: '브랜드', amount: 0 }

    // 자산 변화 계산 함수 호출
    calculateAssetDifference()

    // 페이지네이션을 위한 자산 목록 슬라이스
    paginatedAssets.value = displayedAssetList.value.slice(
      (currentPage.value - 1) * itemsPerPage.value,
      currentPage.value * itemsPerPage.value
    )

    // await nextTick();

    // 차트 렌더링
    renderChart(
      pieChart,
      'doughnut',
      displayedAssetList.value.map((item) => item.prodCategory),
      displayedAssetList.value.map((item) => item.amount)
    )

    // Defensive check before mapping
    if (Array.isArray(displayedSixMonth.value)) {
      renderBarChart(
        displayedSixMonth.value.map((item) => mapMonthToLabel(item.month)),
        displayedSixMonth.value.map((item) => item.balance)
      )
    } else {
      console.error('displayedSixMonth.value는 배열이 아닙니다:', displayedSixMonth.value)
    }

  } catch (error) {
    console.error('API 호출 중 오류 발생:', error)
  }
}

// 자산 변화 계산
const calculateAssetDifference = () => {
  const currentMonthBalance = displayedSixMonth.value[0]?.balance || 0
  const lastMonthBalance = displayedSixMonth.value[1]?.balance || 0
  const difference = currentMonthBalance - lastMonthBalance

  // Convert the difference to 억 (hundred million) and 만 (ten thousand)
  const differenceInEok = Math.floor(difference / 100000000) // 1억 = 100,000,000
  const differenceInMan = Math.floor((difference % 100000000) / 10000) // Remaining 만

  // Constructing the message based on the difference
  if (difference > 0) {
    if (difference >= 100000000) {
      assetDifferenceMessage.value = `${differenceInEok}억 ${differenceInMan}만원 늘었어요 🥰`
    } else {
      assetDifferenceMessage.value = `${differenceInMan}만원 늘었어요 🥰`
    }
  } else if (difference < 0) {
    if (Math.abs(difference) >= 100000000) {
      assetDifferenceMessage.value = `${Math.abs(differenceInEok)}억 ${Math.abs(differenceInMan)}만원 줄었어요 🥺`
    } else {
      assetDifferenceMessage.value = `${Math.abs(differenceInMan)}만원 줄었어요 🥺`
    }
  } else {
    assetDifferenceMessage.value = '변화가 없어요'
  }
}

const displayedAssetList = computed(() => {
  const assetList = includePhysicalAssets.value
    ? [
        ...(Array.isArray(finAssetTotal.value) ? finAssetTotal.value : []),
        ...(electronicSpot.value ? [electronicSpot.value] : []),
        ...(otherSpot.value ? [otherSpot.value] : []),
        ...(brandSpot.value ? [brandSpot.value] : []),
        ...(carSpot.value ? [carSpot.value] : []),
        ...(luxSpot.value ? [luxSpot.value] : [])
      ]
    : Array.isArray(finAssetTotal.value)
      ? finAssetTotal.value
      : []

  // 매핑된 자산 목록 생성
  const mappedAssetList = assetList.map((asset) => ({
    ...asset,
    prodCategory: categoryMapping[asset.prodCategory] || asset.prodCategory // 카테고리 매핑
  }))

  // assetList가 빈 배열이 아닌지 확인
  if (mappedAssetList.length === 0) {
    console.error('displayedAssetList is empty:', mappedAssetList)
  }
  return mappedAssetList
})


const mapMonthToLabel = (month) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 현재 월 (1월은 1, 2월은 2...)

  // 문자열인 경우 (YYYY-MM 형식)
  if (typeof month === 'string') {
    const [year, monthString] = month.split("-");
    const targetYear = parseInt(year, 10);
    const targetMonth = parseInt(monthString, 10);

    // 현재 연도와 비교
    const currentYear = today.getFullYear();

    if (currentYear === targetYear && targetMonth === currentMonth) {
      return '이번달';
    }else {
      return `${targetMonth}월`;
    }
  }

  // 숫자 형식인 경우 (1 ~ 12)
  if (typeof month === 'number') {


    const today = new Date()
  const currentMonth = today.getMonth() // 현재 월 (0부터 시작, 1월은 0)

  // 현재 달에서 month 값을 빼서 라벨을 결정
  const calculatedMonth = currentMonth + 2 - month // month 값이 1부터 시작하므로 +1
  const targetMonth = calculatedMonth > 0 ? calculatedMonth : 12 + calculatedMonth

  // month가 1일 경우 "이번달", 2일 경우 "9월" 이런 식으로 처리
  if (month === 1 || month==="2024-10") {
    return '이번달'
  }

  return `${targetMonth}월` // 나머지 경우에 대한 월 반환
  }

  return ''; // 해당되지 않을 경우 빈 문자열 반환
};


// 차트 렌더링 함수
const renderBarChart = async (labels, data) => {
  // await nextTick();
  if (!barChart.value) return

  if (barChartInstance) barChartInstance.destroy()

  const reversedLabels = labels.reverse()
  const reversedData = data.reverse()

  barChartInstance = new Chart(barChart.value, {
    type: 'bar',
    data: {
      labels: reversedLabels,
      datasets: [
        {
          data: reversedData,
          backgroundColor: reversedLabels.map((label) =>
            label === '이번달' ? 'rgba(255,0,98,0.67)' : 'rgba(220,212,212,0.63)'
          ),
          borderRadius: { topLeft: 10, topRight: 10 }, // 위쪽 두 꼭짓점만 둥글게 설정
          borderSkipped: 'bottom' // 아래쪽 모서리만 직각으로 유지
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        y: { display: false },
        x: { grid: { display: false } }
      }
    }
  })
}

// 차트 렌더링 함수 (0원인 항목을 제외한 데이터만 렌더링)
const renderChart = async (chartRef, chartType, labels, data) => {
  // await nextTick();
  if (!chartRef.value) return

  // 데이터가 비어 있거나 잘못된 경우 확인
  if (!labels || labels.length === 0 || !data || data.length === 0) {
    console.error('차트 렌더링에 필요한 데이터가 비어있습니다.')
    return
  }

  // 0원인 데이터는 차트에서 제외
  const filteredLabels = labels.filter((_, index) => data[index] > 0)
  const filteredData = data.filter((value) => value > 0)

  // 기존 차트가 있으면 파괴
  if (chartInstance) chartInstance.destroy()

  // 차트 렌더링
  chartInstance = new Chart(chartRef.value.getContext('2d'), {
    type: chartType,
    data: {
      labels: filteredLabels, // 0원 항목 제외한 라벨
      datasets: [
        {
          data: filteredData, // 0원 항목 제외한 데이터
          backgroundColor: ['#C30044', '#FF0062', '#DA0052', '#FFF2F6', '#FF99CC', '#FF6699'] // 파이 차트 색상
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  })
}

const nextPage = () => {
  if (currentPage.value < Math.ceil(displayedAssetList.value.length / itemsPerPage.value)) {
    currentPage.value++
    paginatedAssets.value = displayedAssetList.value.slice(
      (currentPage.value - 1) * itemsPerPage.value,
      currentPage.value * itemsPerPage.value
    )
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    paginatedAssets.value = displayedAssetList.value.slice(
      (currentPage.value - 1) * itemsPerPage.value,
      currentPage.value * itemsPerPage.value
    )
  }
}

// 차트 리셋
const resetCharts = () => {
  // 데이터 재로딩
  fetchData()
}
// 체크박스 변경 시 툴팁 메시지 업데이트 및 차트 리셋
const handleCheckboxChange = () => {
  if (includePhysicalAssets.value) {
    tooltipMessage.value = tooltipMessage2.value; // 체크하면 tooltipMessage2로 변경
  } else {
    tooltipMessage.value = '예적금은 [예금], [적금], [현금], [입출금] 이 포함된 값 입니다.'; // 체크 해제하면 기본 메시지로 변경
  }
  resetTooltips(); // 툴팁 업데이트
  resetCharts();   // 차트 리셋 (기존 기능)
};


// 툴팁 메시지 변경 및 초기화 함수
const resetTooltips = () => {
  // 첫 번째 툴팁
  nextTick(() => {
    if (tooltipInstance.value) {
      tooltipInstance.value.dispose(); // 기존 툴팁 제거
    }
    if (tooltipButton.value) {
      tooltipButton.value.setAttribute('title', tooltipMessage.value);
      tooltipInstance.value = new BootstrapTooltip(tooltipButton.value); // 툴팁 다시 초기화
    }
  });

  // 두 번째 툴팁
  nextTick(() => {
    if (tooltipInstance2.value) {
      tooltipInstance2.value.dispose(); // 기존 툴팁 제거
    }
    if (tooltipButton2.value) {
      tooltipButton2.value.setAttribute('title', tooltipMessage2.value);
      tooltipInstance2.value = new BootstrapTooltip(tooltipButton2.value); // 툴팁 다시 초기화
      console.log('Tooltip 2 initialized');
    }
  });
};
// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  auth.fetchUserProfile();
  nextTick(() => {
    // 첫 번째 툴팁 초기화
    if (tooltipButton.value) {
      tooltipButton.value.setAttribute('title', tooltipMessage.value);
      tooltipInstance.value = new BootstrapTooltip(tooltipButton.value);
    }

    // 두 번째 툴팁 초기화
    if (tooltipButton2.value) {
      tooltipButton2.value.setAttribute('title', tooltipMessage2.value);
      tooltipInstance2.value = new BootstrapTooltip(tooltipButton2.value);
    }
  });

  fetchData()
})
</script>

<style scoped>
* {
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}

.asset-title,
.asset-analysis-title,
.asset-level-title {
  font-size: 22px;
  font-weight: 500;
  line-height: 150%;
  color: var(--black-default, #19181d);
  letter-spacing: -0.4px;
  text-align: center;
  margin-top: 36px;
}

.asset-amount {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 36.5px;
  line-height: 150%;
  margin-top: 10px;
  letter-spacing: -0.48px;
}


.asset-analysis-container {
  background-color: #fff;
  padding: 50px;
  border: 1px solid #e4ebf0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 1318px;
}

.asset-analysis-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.asset-analysis-btn {
  display: flex;
  align-items: center;
}

.asset-analysis-btn input {
  margin-right: 10px;
}

.asset-analysis-btn p {
  font-size: 16px;
  color: #333;
}

.asset-analysis-content {
  height: 930px;
  padding: 30px;
}

.asset-analysis-content-container1 {
  border-radius: 10px;
  background-color: #f9f9f9;
  display: flex;
  padding: 10px 30px;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  width: 1000px;
  height: 500px;
}

.asset-analysis-content-container2 {
  display: flex;
  align-items: center;
  margin-top: 40px;
  width: 1000px;
  height: 500px;
  flex-direction: column;
  justify-content: center;
}

.asset-analysis-graph-container2,
.asset-analysis-graph-contanier1 {
  width: 470px;
  height: 370px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.asset-analysis-graph {
  height: 250px;
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
}

.asset-analysis-table {
  margin-left: 0; /* 여백 제거 */
  width: 100%; /* 테이블이 컨테이너의 전체 너비를 차지하도록 수정 */
  padding: 0; /* 패딩 제거 */
}

.asset-analysis-table-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%; /* 모바일 환경에서도 유동적으로 대응 */
}

.asset-analysis-table table {
  width: 100%;
  border-collapse: collapse; /* 셀 간의 간격 제거 */
}

.asset-analysis-table th,
.asset-analysis-table td {
  padding: 15px 0; /* 위아래로만 패딩 추가, 좌우는 제거 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.asset-analysis-table th {
  font-weight: normal; /* 기본 굵기 */
  background-color: transparent; /* 배경색 제거 */
  border-bottom: none; /* 테두리 제거 */
}

.asset-analysis-table td {
  font-size: 16px;
  color: #333; /* 기본 텍스트 색상 */
  border-bottom: none; /* 테두리 제거 */
  background-color: transparent; /* 배경색 제거 */
  transition: none; /* 마우스 오버 시 효과 제거 */
}

.pagination .page-link {
  border-radius: 5px;
  color: #333;
  padding: 8px 16px;
  background-color: #f2f4f7;
  margin: 0 5px;
  transition: background-color 0.3s ease;
}

.pagination .page-link:hover {
  background-color: #e0e4e8;
}

.pagination .page-item.disabled .page-link {
  background-color: #f7f7f7;
  color: #dcdcdc;
}

.graph-container-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  width: 946px;
}

.graph-container {
  width: 100%; /* 전체 너비 사용 */
  height: 350px;
  font-family: 'Pretendard', sans-serif;
  border: 1px solid #e4e4e4;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.graph-container canvas {
  width: 100%;
  height: 100%;
}

.graph-title {
  color: #19181d;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.graph-title2 {
  color: #19181d;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  line-height: 150%;
  letter-spacing: -0.36px;
}

.tooltip-box {
  position: absolute;
  right: 0;
  top: -20px;
  z-index: 10;
}

.tooltip-box button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.tooltip-inner {
  font-family: 'Pretendard';
  max-width: 400px !important;
  white-space: normal !important;
  font-size: 12px;
}

.tooltip-inner::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -10px;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #f9f9f9 transparent transparent; /* 툴팁 화살표 */
}

</style>