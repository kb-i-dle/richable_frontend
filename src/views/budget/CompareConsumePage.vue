<template>
  <div class="container">
    <!-- 월간 네비게이션 -->
    <div class="month-navigation text-center">
      <!-- 이전 달 버튼 -->
      <button @click="previousMonth" class="btn custom-btn-left"></button>
      <div>{{ curMonth }}월</div>
      <!-- 다음 달 버튼 -->
      <button @click="nextMonth" class="btn custom-btn-right"></button>
    </div>

    <!-- 상단 소비 정보 -->
    <div class="text-center total-asset">
      <div class="asset-title">
        {{
          saveAmount.value - possibleSaveAmount.value > 0
            ? '이번 달에 아낄 수 있었던 비용이에요 😢'
            : '이번달에 아낀 비용이에요 😲'
        }}
      </div>
      <div class="asset-amount">{{ Math.abs(couldsaving).toLocaleString() }}원</div>
    </div>

    <!-- 카테고리 선택 및 비교 -->
    <div class="avg-content">
      <div class="text-left category-comparison">
        <div class="sub-title">대한민국 평균 소비금액을 기준으로 비교해요</div>
        <div class="main-title">나는 평균 대비 얼마나 지출할까요?</div>
      </div>

      <div class="text-center">
        <div class="total-consume">
          <div class="consume-title">
            나의 이번 달
            <select
              v-model="category"
              class="form-select custom-inline-select"
              style="font-size: 18px; font-weight: 700; background-color: none"
            >
              <option v-for="option in categories" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            소비는
          </div>

          <div class="consume-title">
            평균보다
            <span
              :style="{
                color: diffAmount > 0 ? '#EB003B' : '#2768FF',
                fontSize: '18px',
                fontWeight: '700'
              }"
            >
              {{ Math.abs(diffAmount).toLocaleString() }}원
            </span>
            <span
              :style="{
                color: diffAmount > 0 ? '#EB003B' : '#2768FF',
                fontSize: '18px',
                fontWeight: '700'
              }"
              v-if="diffAmount > 0"
            >
              많습니다</span
            >
            <span
              :style="{
                color: diffAmount > 0 ? '#EB003B' : '#2768FF',
                fontSize: '18px',
                fontWeight: '700'
              }"
              v-else
              >적습니다</span
            >.
          </div>
        </div>
        <!-- 차트 -->
        <div class="chart-container">
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
          <canvas style="margin-top: 20px" id="myChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 6개월 절역 시뮬레이션 -->
    <div class="saving-content">
      <div class="summary-header">
        <div class="main-title">6개월 간 소비를 절약했을 때</div>
      </div>

      <div v-if="possibleSaveAmount.length > 0">
        <div class="total-consume">
          <div class="consume-title">
            <!-- 이번 달 소비 중 줄일 수 있는 소비는 -->
            {{
              saveAmount.value - possibleSaveAmount.value > 0
                ? '이번 달 소비 중 줄일 수 있는 소비는 😢'
                : '이번달에 아낀 소비는 😲'
            }}
            <span style="font-size: 18px; font-weight: 500; color: #ff0062">
              {{ Math.abs(couldsaving).toLocaleString() }}</span
            >
            원 이에요.
          </div>

          <div class="consume-title">
            6개월 동안
            <span style="font-size: 18px; font-weight: 500; color: #ff0062">{{
              Math.abs(couldsaving * 6).toLocaleString()
            }}</span>
            원 절약이 가능해요!
          </div>
        </div>
        <!-- 절약 차트 -->
        <div class="save-chart-container">
          <!-- 두 번째 차트 우상단에 툴팁 버튼 -->
          <div class="tooltip-box">
            <button
              class="tool-btn"
              ref="tooltipButton2"
              type="button"
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              :title="tooltipMessage2"
            >
              <font-awesome-icon icon="circle-question" style="font-size: 25px" />
            </button>
          </div>
          <canvas style="margin-top: 20px" id="savingChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables, Tooltip } from 'chart.js'
import { nextTick } from 'vue'
import axiosInstance from '@/AxiosInstance'
import { useMonthStore } from '@/stores/consume/curMonth.js'
import { Tooltip as BootstrapTooltip } from 'bootstrap'

// 차트.js 등록
Chart.register(...registerables)

// pinia store 사용
// 달별 네비게이션
const monthStore = useMonthStore() // Pinia store 사용
const curMonth = ref(monthStore.month) // store에서 월 가져오기
const curYear = ref(monthStore.year) // store에서 연도 가져오기
console.log(curMonth, curYear)
const category = ref('식료품') // 기본 카테고리를 '식료품'으로 설정
const categories = ref([
  '식료품',
  '유흥',
  '쇼핑',
  '공과금',
  '생활용품',
  '의료비',
  '교통비',
  '통신비',
  '문화',
  '교육비',
  '외식',
  '비소비지출',
  '기타'
])
const userSpending = ref(0)
const couldsaving = ref(0)
const averageSpending = ref(0)
const diffAmount = computed(() => userSpending.value - averageSpending.value)
const possibleSaveAmount = ref([]) // 빈 배열로 초기화
const saveAmount = ref([]) // 빈 배열로 초기화

const tooltipButton = ref(null) // 툴팁 버튼
const tooltipInstance = ref(null) // 툴팁 인스턴스
const tooltipMessage = ref('평균값은 KOSIS 산업별 가구당 월 [평균] 가계수지 입니다.')
const tooltipMessage2 = ref('이번달에 아낀 소비를 6개월 뒤 까지 누적으로 합산합니다.')

// 통화 포맷 함수
const formatCurrency = (amount) => {
  if (amount >= 100000) {
    return `${(amount / 10000).toFixed(0)}만원`
  } else {
    return `${amount.toLocaleString()}원`
  }
}

const wordMapping2 = {
  식료품: '식료품 · 비주류음료',
  유흥: '주류 · 담배',
  쇼핑: '의류 · 신발',
  공과금: '주거 · 수도 · 광열',
  생활용품: '가정용품 · 가사서비스',
  의료비: '보건',
  교통비: '교통',
  통신비: '통신',
  문화: '오락 · 문화',
  교육비: '교육',
  외식: '음식',
  기타: '기타상품',
  비소비지출: '비소비지출'
}

// 매핑 함수
function mapColumnToKeyword2(keyword) {
  return wordMapping2[keyword] || '매핑되지 않은 컬럼'
}

// 차트 초기화 변수
let myChart = null
let savingChart = null

// 이전/다음 달 버튼 클릭 시
const previousMonth = () => {
  const { year: updatedYear, month: updatedMonth } = monthStore.decreaseMonth()
  curMonth.value = updatedMonth
  curYear.value = updatedYear

  fetchComparisonData() // 데이터를 다시 가져오기
  fetchCouldSaving()
  fetchSimulationData()
}

const nextMonth = () => {
  const { year: updatedYear, month: updatedMonth } = monthStore.increaseMonth()
  curMonth.value = updatedMonth
  curYear.value = updatedYear

  fetchComparisonData() // 데이터를 다시 가져오기
  fetchCouldSaving()
  fetchSimulationData()
}

// 카테고리 변경 시 데이터 가져오기
watch(category, () => {
  fetchComparisonData()
})

// 월과 연도 변경 시 데이터 업데이트
watch([curMonth, curYear], () => {
  fetchCouldSaving()
  fetchSimulationData()
  fetchComparisonData()
})

// 소비 비교 데이터를 API에서 가져와 차트에 반영
const fetchComparisonData = async () => {
  const cntYear = curYear.value
  const cntMonth = curMonth.value

  const tempCategory = mapColumnToKeyword2(category.value) // category의 매핑된 값을 가져옴
  const encodedCategory = encodeURIComponent(tempCategory) // 카테고리를 URL 인코딩
  const response = await axiosInstance.get(
    `/outcome/compare/${cntYear}/${cntMonth}/${encodedCategory}`
  )

  const data = response.data.response.data
  userSpending.value = data.mySum
  averageSpending.value = data.averageSum
  console.log(userSpending.value, averageSpending.value)

  createComparisonChart() // 데이터를 받아온 후 차트 생성
}

// 이번달 아낄 수 있었던 비용
const fetchCouldSaving = async () => {
  const cntYear = curYear.value
  const cntMonth = curMonth.value

  const response = await axiosInstance.get(`/outcome/review/sum/${cntYear}/${cntMonth}`)
  const data = response.data.response.data
  couldsaving.value = Math.abs(data.possibleSaveAmount) // 음수값을 절대값으로 변환
  console.log(couldsaving.value)
}

// 6개월 절약 시뮬레이션 데이터 가져오기
const fetchSimulationData = async () => {
  const cntYear = curYear.value
  const cntMonth = curMonth.value

  const response = await axiosInstance.get(`/outcome/simulation/${cntYear}/${cntMonth}`)
  const data = response.data.response.data
  console.log(data)

  possibleSaveAmount.value = data.possibleSaveAmount.map((amount) => Math.abs(amount))
  saveAmount.value = data.saveAmount.map((amount) => Math.abs(amount))

  nextTick(() => {
    const canvasElement = document.getElementById('savingChart')
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d')
      if (ctx) {
        createSavingChart(data.months, saveAmount.value, possibleSaveAmount.value)
      } else {
        console.error('Cannot find canvas element for savingChart')
      }
    }
  })
}

// 막대 그래프 생성
const createComparisonChart = () => {
  const ctx1 = document.getElementById('myChart').getContext('2d')

  if (myChart) myChart.destroy() // 이전 차트 삭제

  // 카테고리 비교 차트
  myChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['평균 소비', '나의 소비'],
      datasets: [
        {
          label: '소비 비교',
          data: [averageSpending.value, userSpending.value],
          backgroundColor: ['#d3d3d3', '#ff6384'],
          borderWidth: 1,
          borderRadius: 10,
          barThickness: 50
        }
      ]
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      scales: {
        y: {
          grid: {
            display: false // y축 배경선 숨기기
          },
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString() + '원' // y축에 '원' 추가
            }
          }
        },
        x: {
          grid: {
            display: false // x축 배경선 숨기기
          },
          ticks: {
            color: '#767676' // x축 라벨 색상
          }
        }
      },
      plugins: {
        legend: {
          display: false // 범례 비활성화
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw.toLocaleString() + '원' // 툴팁에 '원' 추가
            }
          }
        }
      }
    },
    plugins: [
      {
        id: 'barLabels',
        afterDatasetsDraw(chart) {
          const {
            ctx,
            data,
            scales: { x, y }
          } = chart

          ctx.save()
          ctx.font = '12px Pretendard'
          ctx.fillStyle = '#767676'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'

          data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach((bar, index) => {
              const value = dataset.data[index]
              const formattedValue =
                value >= 100000
                  ? `${Math.floor(value / 10000)}만원` // Use Math.floor() to truncate instead of rounding
                  : `${value.toLocaleString()}원`

              ctx.fillText(formattedValue, bar.x, bar.y - 5)
            })
          })

          ctx.restore()
        }
      }
    ]
  })
}

const createSavingChart = (months, saveAmount, possibleSaveAmount) => {
  const ctx2 = document.getElementById('savingChart')?.getContext('2d')

  if (!ctx2) {
    console.error('Cannot get context for savingChart')
    return
  }

  if (savingChart) savingChart.destroy() // 기존 차트가 있으면 삭제

  console.log(saveAmount, possibleSaveAmount)

  savingChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: '절약했을 때 저축',
          data: possibleSaveAmount,
          borderColor: '#FF6384',
          fill: false,
          borderWidth: 2
        },
        {
          label: '평소 저축',
          data: saveAmount,
          borderColor: '#D3D3D3',
          fill: false,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString() + '원'
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom' // 범례를 아래로 이동
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw.toLocaleString() + '원'
            }
          }
        }
      }
    }
  })
}

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchComparisonData() // 초기 로드 시 데이터 가져오기
  fetchCouldSaving() // 절약 가능 금액 데이터 가져오기
  fetchSimulationData() // 시뮬레이션 데이터 가져오기

  curMonth.value = monthStore.month
  curYear.value = monthStore.year
})
</script>

<style scoped>
* {
  font-family: pretendard;
  color: #19181d;
  font-size: 20px;
  max-width: 1704px;
}

.container {
  margin: 80px;
}

.total-asset {
  margin-top: 40px;
  display: flex;
  height: 107px;
  padding: 10px 10px 10px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  max-width: 1704px;
  border-radius: 20px;
  background-color: #f9f9f9;
  height: 150px;
  border: 1px solid #f8f8f8;
}

.asset-title {
  color: var(--black-default, #19181d);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 30px */
  letter-spacing: -0.4px;
}

.asset-amount {
  color: var(--black-default, #19181d);
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 36px */
  letter-spacing: -0.48px;
}

.total-consume {
  margin-top: 21px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fafafb;
  display: flex;
  height: 125px;
  padding: 10px 10px 10px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: #f9f9f9;
  height: 150px;
  border: 1px solid #f8f8f8;
  position: relative;
}

.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  background: #fff;
}

.consume-title {
  color: var(--black-default, #19181d);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 177.778% */
  letter-spacing: -0.8px;
}

.avg-content {
  margin-top: 100px;
}

.saving-content {
  margin-top: 100px;
}

#myChart {
  width: 100%; /* 캔버스 너비를 부모 요소에 맞춤 */
  max-width: 800px; /* 캔버스 최대 너비 설정 */
  height: auto; /* 높이는 자동으로 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  display: block; /* block 요소로 설정 */
  border-radius: 20px;
  border: 1px solid #e4ebf0;
}

/* 월 네비게이션 */
.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0px;
}

.month-navigation h2 {
  margin: 0 20px;
  font-size: 24px;
}

.sub-title {
  color: var(--3, #414158);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;
}

.main-title {
  margin-top: 8xp;
  color: var(--3, #414158);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px; /* 135% */
}

.custom-btn-left,
.custom-btn-right {
  width: 0;
  height: 0;
  border: 10px solid transparent;
  background: none;
  padding: 0;
  margin: 10px;
}

.custom-btn-left {
  border-right-color: #c0c0c0;
}

.custom-btn-right {
  border-left-color: #c0c0c0;
}

/* 상단 소비 정보 */
.saved-info h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.saved-amount {
  font-size: 36px;
  font-weight: bold;
  color: #ff6384;
}

/* 카테고리 비교 */
.category-comparison h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

.category-comparison h5 {
  font-size: 16px;
  margin-bottom: 20px;
}

.custom-inline-select {
  display: inline-block;
  width: auto; /* select 박스 크기를 자동으로 맞춤 */
  margin-left: 5px; /* 약간의 여백 추가 */
  margin-right: 5px;
}

/* 6개월 절약 시뮬레이션 */
.savings-summary-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.savings-summary-container h4 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: left;
}

.savings-summary-container p {
  font-size: 16px;
  color: #666;
}

.highlight {
  color: #ff6384;
  font-weight: bold;
  font-size: 18px;
}

/* 차트 스타일 */
canvas {
  max-width: 100%;
  width: 800px;
  height: 400px;
  margin: 0 auto;
  display: block;
  border-radius: 20px;
  border: 1px solid #e4ebf0;
}

.tooltip-inner {
  white-space: nowrap !important;
}

.tooltip-box {
  position: absolute;
  bottom: 20px;
  right: 410px;
  top: 30px;
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

.save-chart-container {
  position: relative; /* 차트 컨테이너 기준으로 툴팁 위치 설정 */
  width: 100%;
  height: auto;
  background: #fff;
}
</style>
