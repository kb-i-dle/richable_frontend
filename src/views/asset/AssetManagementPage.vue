<!-- RC-P-09 : 자산 항목 관리 페이지 -->
<template>
  <div>
    <div class="tab-bar">
      <ul class="nav nav-tabs">
        <li
          class="nav-item nav-link"
          @click="selectedTab = 'tab1'"
          :class="{ active: selectedTab === 'tab1' }"
        >
          <a>금융 자산 현황</a>
        </li>
        <li
          class="nav-item nav-link"
          @click="selectedTab = 'tab2'"
          :class="{ active: selectedTab === 'tab2' }"
        >
          <a>현물 자산 포함</a>
        </li>
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
      </ul>
    </div>

    <div class="tab-content">
      <div class="tab-page" v-if="selectedTab === 'tab1'">
        <div class="total-asset">
          <div class="asset-title">김리치님의 총 금융 자산 현황 😎</div>
          <div class="asset-amount">{{ financeTotalAmount.toLocaleString() }} 원</div>
        </div>
        <div class="asset-list">
          <div class="list-title">
            금융 자산 목록
            <font-awesome-icon icon="square-plus" style="color: #c30044" @click="openCreateModal" />
          </div>

          <div class="list-box">
            <div class="asset-item" @click="openCheckModal('bank')">
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 18px">예/적금</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 24px; color: #ff0062">
                  {{ bankAssetAmount.toLocaleString() }}
                </div>
                <div style="font-weight: bold; font-size: 18px; color: #8a8aa8; margin-left: 4px">
                  원
                </div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 60px;
                  margin-top: 8px;
                "
              >
                <font-awesome-icon icon="piggy-bank" />
              </div>
            </div>
            <div class="asset-item" @click="openCheckModal('stock')">
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 18px">주식</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 24px; color: #ff0062">
                  {{ stockAssetAmount.toLocaleString() }}
                </div>
                <div style="font-weight: bold; font-size: 18px; color: #8a8aa8; margin-left: 4px">
                  원
                </div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 60px;
                  margin-top: 8px;
                "
              >
                <font-awesome-icon icon="chart-line" />
              </div>
            </div>
            <div class="asset-item" @click="openCheckModal('bond')">
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 18px">채권</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 24px; color: #ff0062">
                  {{ bondAssetAmount.toLocaleString() }}
                </div>
                <div style="font-weight: bold; font-size: 18px; color: #8a8aa8; margin-left: 4px">
                  원
                </div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 60px;
                  margin-top: 8px;
                "
              >
                <font-awesome-icon icon="money-check-dollar" />
              </div>
            </div>
            <div class="asset-item" @click="openCheckModal('coin')">
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 18px">코인</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center">
                <div style="font-weight: bold; font-size: 24px; color: #ff0062">
                  {{ coinAssetAmount.toLocaleString() }}
                </div>
                <div style="font-weight: bold; font-size: 18px; color: #8a8aa8; margin-left: 4px">
                  원
                </div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 60px;
                  margin-top: 8px;
                "
              >
                <font-awesome-icon icon="fa-brands fa-bitcoin" />
              </div>
            </div>
          </div>
        </div>
        <div class="asset-chart">
          <div class="list-title">총 금융 자산 분포</div>
          <div class="chart-box">
            <canvas ref="pieChart"></canvas>
          </div>
        </div>
      </div>

      <div class="tab-page" v-if="selectedTab === 'tab2'">
        <div class="total-asset">
          <div class="asset-title">김리치님의 총 현물 자산 현황 😎</div>
          <div class="asset-amount">{{ spotTotalAmount.toLocaleString() }} 원</div>
        </div>
        <div class="asset-list">
          <div class="list-title">
            현물 자산 목록
            <font-awesome-icon
              icon="square-plus"
              style="color: #c30044"
              @click="openCreateModal2"
            />
          </div>

          <!-- Carousel for Tangible Assets -->
          <div class="list-box">
            <button class="control-btn" @click="prevSlide" :disabled="currentSlide === 0">
              <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </button>
            <div class="carousel-track">
              <div v-for="(asset, index) in paginatedAssets" :key="index" class="asset-item">
                <div style="display: flex; flex-direction: row; justify-content: center">
                  <div class="asset-category">{{ asset.category }}</div>
                  <div
                    style="color: #c30044; font-size: 16px; margin-left: 4px"
                    @click="openEditModal2(asset)"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </div>
                </div>

                <div class="asset-name">{{ asset.name }}</div>
                <div class="asset-price">
                  <span class="price">{{ Number(asset.price).toLocaleString() }}</span>
                  <span class="currency">원</span>
                </div>
                <div class="asset-icon">
                  <font-awesome-icon :icon="getIcon(asset.category)" />
                </div>
              </div>
            </div>

            <button
              class="control-btn"
              @click="nextSlide"
              :disabled="currentSlide === maxSlide - 1"
            >
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button>
          </div>

          <div class="asset-chart">
            <div class="list-title">총 현물 자산 분포</div>
            <div class="chart-box">
              <canvas ref="pieChart2"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AssetCreateModal ref="createModal" 
      @refresh-data="refreshData" />
    <AssetUpdateModal ref="editModal" />
    <TangibleAssetCreateModal ref="createModal2" @create-asset="handleCreateAsset" />
    <TangibleAssetUpdateModal
      ref="editModal2"
      @update-asset="handleUpdateAsset"
      @delete-asset="handleDeleteAsset"
    />
    <AssetCheckModal
      :selected-asset-type="selectedAssetType"
      :bank-data-list="bankDataList"
      :bond-data-list="bondDataList"
      :coin-data-list="coinDataList"
      :stock-data-list="stockDataList"
      @refresh-data="refreshData"  
      ref="checkModal"
    />
      
    <AssetUpdateModal
      ref="updateModal"
      @update-asset="handleAssetUpdate"
      @delete-asset="handleAssetDelete"
    />

  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick, computed } from 'vue'
import axiosInstance from '@/AxiosInstance'
import { Tooltip as BootstrapTooltip } from 'bootstrap'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
import AssetCreateModal from '../../components/modal/asset/AssetCreateModal.vue'
import AssetUpdateModal from '../../components/modal/asset/AssetUpdateModal.vue'
import AssetCheckModal from '../../components/modal/asset/AssetCheckModal.vue'
import TangibleAssetCreateModal from '../../components/modal/asset/TangibleAssetCreateModal.vue'
import TangibleAssetUpdateModal from '../../components/modal/asset/TangibleAssetUpdateModal.vue'

// Chart.js에 필요한 컴포넌트(컨트롤러, 요소, 플러그인) 등록
Chart.register(PieController, ArcElement, Tooltip, Legend)

// 1. 데이터 정의
const selectedTab = ref('tab1') // 현재 선택된 탭
const tooltipButton = ref(null) // 툴팁 버튼
const tooltipInstance = ref(null) // 툴팁 인스턴스
const tooltipMessage = ref('금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.')

// 현재 페이지 인덱스와 페이지당 항목 수
const currentSlide = ref(0)
const itemsPerPage = 4

// 자산 데이터
const selectedAssetType = ref('bank')
const bankDataList = ref([])
const bondDataList = ref([])
const coinDataList = ref([])
const stockDataList = ref([])
const tangibleAssets = ref([])

// 2. 계산된 속성 정의
const latestAssets = computed(() => tangibleAssets.value.slice().reverse()) // 최신순 정렬

// 현재 페이지에 보여줄 항목 계산
const paginatedAssets = computed(() => {
  const start = currentSlide.value * itemsPerPage
  const end = start + itemsPerPage

  return latestAssets.value.slice(start, end)
})

// 총 슬라이드 개수 계산
const maxSlide = computed(() => Math.ceil(tangibleAssets.value.length / itemsPerPage))

// 카테고리에 따른 아이콘 매핑
const getIcon = (category) => {
  switch (category) {
    case '자동차':
      return 'car'
    case '전자기기':
      return 'desktop'
    case '명품':
      return 'fa-gem'
    case '브랜드':
      return 'tags'
    case '기타':
      return 'question-circle'
    default:
      return 'question-circle'
  }
}

// 3. 차트 렌더링 함수 정의
const pieChart = ref(null)
const pieChart2 = ref(null)
let chartInstance = null
let chartInstance2 = null

// 파이 차트 렌더링 (금융 자산)
const renderPieChart = async () => {
  // 데이터가 설정되었는지 먼저 확인
  await fetchFinanceAmount()

  await nextTick()
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(pieChart.value, {
    type: 'doughnut',
    data: {
      labels: ['예/적금', '주식', '채권', '코인'],
      datasets: [
        {
          data: [
            bankAssetAmount?.value,
            stockAssetAmount?.value,
            bondAssetAmount?.value,
            coinAssetAmount?.value
          ],
          backgroundColor: ['#C30044', '#dda0dd', '#c71585', '#FFF2F6']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 70,
            padding: 100,
            font: { size: 14, weight: 'bold' }
          }
        }
      },
      layout: { padding: { top: 10, bottom: 10 } }
    }
  })
}

// 파이 차트 렌더링 (현물 자산)
const renderPieChart2 = async () => {
  await getSpotList()

  await nextTick()

  if (chartInstance2) chartInstance2.destroy()

  chartInstance2 = new Chart(pieChart2.value, {
    type: 'doughnut',
    data: {
      labels: ['자동차', '전자기기', '브랜드', '명품', '기타'],
      datasets: [
        {
          data: [
            spotCarAmount?.value,
            spotElecAmount?.value,
            spotBrandAmount?.value,
            spotLuxuryAmount?.value,
            spotEtcAmount?.value
          ],
          backgroundColor: ['#C30044', '#dda0dd', '#c71585', '#FFF2F6', '#DA0052']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 70,
            padding: 100,
            font: { size: 14, weight: 'bold' }
          }
        }
      },
      layout: { padding: { top: 10, bottom: 10 } }
    }
  })
}

// 4. 이벤트 핸들러 정의
const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}

const nextSlide = () => {
  if (currentSlide.value < maxSlide.value - 1) currentSlide.value++
}

// 툴팁 업데이트
const updateTooltipMessage = async () => {
  tooltipMessage.value =
    selectedTab.value === 'tab1'
      ? '금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.'
      : '현물 자산은 [자동차], [전자기기], [브랜드], [명품], [기타]를 포함합니다.'

  if (tooltipInstance.value) tooltipInstance.value.dispose()

  tooltipButton.value.setAttribute('title', tooltipMessage.value)
  tooltipInstance.value = new BootstrapTooltip(tooltipButton.value)
}

// 탭 변경 시 차트 렌더링
watch(selectedTab, (newTab) => {
  if (newTab === 'tab1') renderPieChart()
  else if (newTab === 'tab2') renderPieChart2()
})


// 모달 처리
const createModal = ref(null)
const editModal = ref(null)
const editModal2 = ref(null)
const createModal2 = ref(null)
const checkModal = ref(null)

const openCreateModal = () => createModal.value && createModal.value.show()
const openCreateModal2 = () => createModal2.value && createModal2.value.show()
const openEditModal = () => editModal.value && editModal.value.show()
const openEditModal2 = (asset) => editModal2.value && editModal2.value.show(asset)

// 모달 열기 함수 (자산 타입에 따라)
const openCheckModal = (assetType) => {
  if (checkModal.value) {
    selectedAssetType.value = assetType
    checkModal.value.show(assetType)
  }
}

// 자산 추가 처리
const handleCreateAsset = async (newAsset) => {
    tangibleAssets.value.push({ ...newAsset });

    // 비동기 작업 대기
    await fetchSpotTotalAmount();
    await renderPieChart2();
};

// 자산 수정 처리
const handleUpdateAsset = async (updatedAsset) => {
  const index = tangibleAssets.value.findIndex((asset) => asset.index === updatedAsset.index);
  if (index !== -1) {
    tangibleAssets.value.splice(index, 1, { ...updatedAsset });

      // 비동기 작업 대기
      await fetchSpotTotalAmount();
      await renderPieChart2();
  }
};

// 자산 삭제 처리
const handleDeleteAsset = async (deletedAsset) => {
  tangibleAssets.value = tangibleAssets.value.filter((asset) => asset.index !== deletedAsset.index);
  // 비동기 작업 대기
  await fetchSpotTotalAmount();
  await renderPieChart2();
}

const handleAssetUpdate = async (assetType, updatedAsset) => {
  let targetList;
  if (assetType === 'bank') {
    targetList = bankDataList;
  } else if (assetType === 'bond') {
    targetList = bondDataList;
  } else if (assetType === 'coin') {
    targetList = coinDataList;
  } else if (assetType === 'stock') {
    targetList = stockDataList;
  }

  // 여기서 ref.value로 접근해야 함
  const index = targetList.value.findIndex(asset => asset.index === updatedAsset.index);
  if (index !== -1) {
    targetList.value[index] = { ...updatedAsset };
    console.log(`자산 ${assetType}이(가) 업데이트되었습니다.`);
  } else {
    console.warn(`해당 자산을 찾을 수 없습니다: ${updatedAsset.index}`);
  }

  await getFinanceList();
  await fetchFinanceAmount();
  await fetchFinanceAssetList();
  await renderPieChart();
};

const handleAssetDelete = async (assetType, assetIndex) => {
  let targetList;
  if (assetType === 'bank') {
    targetList = bankDataList;
  } else if (assetType === 'bond') {
    targetList = bondDataList;
  } else if (assetType === 'coin') {
    targetList = coinDataList;
  } else if (assetType === 'stock') {
    targetList = stockDataList;
  }

  // ref.value로 접근
  targetList.value = targetList.value.filter(asset => asset.index !== assetIndex);
  console.log(`${assetType} 자산이 삭제되었습니다.`);

  await getFinanceList();
  await fetchFinanceAmount();
  await fetchFinanceAssetList();
  await renderPieChart();
};


const refreshData = async () => {
  console.log("데이터 새로고침 ");
  await fetchFinanceAmount(); 
  await getFinanceList();// 금융 자산 리스트 다시 불러오기
  await fetchFinanceAssetList();
  await renderPieChart();
  console.log("데이터 새로고침 완료");
}


const financeTotalAmount = ref(0)

const fetchFinanceAssetList = async () => {
  try {
    const response = await axiosInstance.get('/finance/fin/sum');
    console.log(response);

    console.log(response.data.response.data.amount)
    financeTotalAmount.value = response.data.response.data.amount
  } catch (error) {
    console.error('금융 자산 합 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 금융 자산별 합
const bankAssetAmount = ref(0)
const stockAssetAmount = ref(0)
const coinAssetAmount = ref(0)
const bondAssetAmount = ref(0)

// 금융 자산별 합 조회 연동
const fetchFinanceAmount = async () => {
  try {
    const response = await axiosInstance.get('/finance/fin')
    const data = response.data.response.data

    // 예적금
    bankAssetAmount.value = data[0] ? data[0].amount : 0
    // 주식
    stockAssetAmount.value = data[1] ? data[1].amount : 0
    // 코인
    coinAssetAmount.value = data[2] ? data[2].amount : 0
    // 채권
    bondAssetAmount.value = data[3] ? data[3].amount : 0
  } catch (error) {
    console.error('금융 자산별 합 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 금융 자산별 목록 조회
const fetchFinanceList = async (category) => {
  try {
    const response = await axiosInstance.get(`/asset/${category}/all`)

    console.log(response.data.response.data)

    const data = response.data.response.data

    const dataMap = {
      bank: bankDataList,
      bond: bondDataList,
      coin: coinDataList,
      stock: stockDataList
    }

    // category가 유효하면 해당 값에 data를 할당
    if (dataMap[category]) {
      dataMap[category].value = data
    }
  } catch (error) {
    console.error(category, ' / 금융 자산별 목록 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 현물 자산 총합
const spotTotalAmount = ref(0);

// 총 현물 자산 현황 연동
const fetchSpotTotalAmount = async () => {
  try {

    const response = await axiosInstance.get('/finance/spot/sum')
    console.log(response.data.response.data.amount)
    spotTotalAmount.value = response.data.response.data.amount;
    
  } catch (error) {
    console.error('현물 자산 합 조회 api 호출을 실패하였습니다. ', error)
  }
}

const spotCarAmount = ref(0)
const spotElecAmount = ref(0)
const spotBrandAmount = ref(0)
const spotLuxuryAmount = ref(0)
const spotEtcAmount = ref(0)

// 카테고리별 현물 자산 총합 조회
const fetchSpotList = async (category) => {
  try {

    const response = await axiosInstance.get(`finance/spot/${category}/sum`)

    const data = response.data.response.data.amount

    const dataMap = {
      car: spotCarAmount,
      elec: spotElecAmount,
      brand: spotBrandAmount,
      luxury: spotLuxuryAmount,
      etc: spotEtcAmount
    }

    // category가 유효하면 해당 값에 data를 할당
    if (dataMap[category]) {
      dataMap[category].value = data
    }
  } catch (error) {
    console.error(category, ' / 카테고리별 현물 자산 목록 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 현물 자산 목록 조회
const fetchFinanceSpotList = async () => {
  try {
    const response = await axiosInstance.get('/finance/spot/all')

    console.log(response.data.response.data)
    tangibleAssets.value = response.data.response.data
  } catch (error) {
    console.error('현물 자산 목록 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 금융 자산별 목록 조회
const getFinanceList = async() => {
  fetchFinanceList('bank')
  fetchFinanceList('stock')
  fetchFinanceList('bond')
  fetchFinanceList('coin')
  console.log("부르기")
}

// 현물 자산별 총합 조회
const getSpotList = async () => {
  await fetchSpotList('car')
  await fetchSpotList('elec')
  await fetchSpotList('brand')
  await fetchSpotList('luxury')
  await fetchSpotList('etc')
}

// 5. 초기 설정
onMounted(() => {
  updateTooltipMessage()
  fetchFinanceAssetList() // 총 금융 자산 현황 조회
  fetchFinanceAmount() // 금융 자산별 합 조회
  getFinanceList() // 금융 자산별 목록 조회
  getSpotList() // 현물 자산별 총합 조회
  fetchSpotTotalAmount() // 총 현물 자산 현황 조회
  fetchFinanceSpotList() // 현물 자산별 목록 조회
  renderPieChart() // 초기 마운트 시 '금융 자산 현황' 차트 렌더링
})
</script>

<style scoped>
.tab-bar {
  width: 1704px;
  margin-left: 80px;
  margin-top: 80px;
  position: relative;
}

.nav-tabs {
  border-bottom: 2px solid #414158;
}

.nav-item {
  color: #ccccd6;
  width: 200px;
  height: 57px;
  text-align: center;
  font-size: 18px;
  line-height: 39px;
  border: 1px solid #ccccd6;
  border-bottom: 1px solid #414158;
}

.nav-item.active {
  background-color: #414158;
  color: white;
  border-bottom: 2px solid #414158;
}

.tooltip-inner {
  white-space: nowrap !important;
}

.tooltip-box {
  position: absolute;
  right: 0;
  top: 0;
}

.tool-btn {
  border: none;
  background-color: white;
  padding-top: 4px;
  margin-top: 12px;
}

.tab-content {
  margin-top: 80px;
  margin-left: 80px;
}

.tab-page {
}

.total-asset {
  background-color: #f9f9f9;
  max-width: 1704px;
  height: 150px;
  border-radius: 20px;
  border: 1px solid #f8f8f8;
  text-align: center;
}
.asset-title {
  font-size: 20px;
  margin-top: 36px;
  margin-bottom: 10px;
}

.asset-amount {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 36.5px;
}

.asset-list {
  margin-top: 117px;
}

.list-title {
  margin: 24px auto;
  font-size: 20px;
  font-weight: bold;
}

.list-box {
  display: flex;
  background-color: #fff2f6;
  border-radius: 10px;
  max-width: 1704px;
  height: 244px;
  margin-bottom: 44px;
  justify-content: space-between;
  align-items: center;
  padding-left: 27px; /* 왼쪽 여백 */
  padding-right: 27px; /* 오른쪽 여백 */
}

.asset-item {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 190px;
  background-color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  padding-top: 28px;
}

.chart-box {
  max-width: 1704px;
  height: 620px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
  padding-bottom: 42.5px;
}

.asset-chart {
  position: relative;
  margin-top: 44px;
  padding-bottom: 80px;
}

.list-box {
  position: relative;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.asset-item {
  width: 300px;
  height: 200px;
  background-color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  padding: 20px;
  margin-right: 20px;
  text-align: center;
}

.asset-category {
  font-weight: bold;
  font-size: 18px;
}

.asset-name {
  font-size: 18px;
  margin-top: 0px;
}

.asset-price {
  margin-top: 0px;
  font-weight: bold;
  font-size: 24px;
  color: #ff0062;
}

.price {
  margin-right: 4px;
}

.currency {
  font-size: 18px;
  color: #8a8aa8;
}

.asset-icon {
  font-size: 50px;
  margin-top: 0px;
}

.carousel-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.control-btn {
  background-color: #c30044;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.control-btn:hover:not(:disabled) {
  background-color: #ff0055;
}
</style>

<style>
body {
  font-family: 'Pretendard';
}
.tooltip-inner {
  font-family: 'Pretendard';
  max-width: 400px !important;
  white-space: normal !important;
  font-size: 12px;
}
</style>
