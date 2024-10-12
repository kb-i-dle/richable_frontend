<template>
    <div class="wrapper">

        <div class="text-center total-asset">
            <div class="asset-title">김리치님의 이번 달 총 소비💸</div>
            <div class="asset-amount">{{ totalSum !== null ? totalSum.toLocaleString() : '0' }} 원</div>
        </div>

    <div style="margin-top: 100px;">
        <div class="text-left category-comparison">
        <div class="main-title">나의 소비</div>
      </div>

      <div class="analyzeText">
        <div>
          <span id="month">{{ month.month }}월</span>에는
          <span id="mostCategory">{{ topCategories[0]?.category || '데이터 없음' }}</span>에 가장 많은 소비를 하였습니다.
        </div>
      </div>
  
      <div style="margin-top: 8px;" class="analyzeWrapper">
        <div class="analyze">
          <div class="chart">
            <canvas ref="doughnutChart"></canvas>
          </div>
  
          <div class="consumeSummary">
            <table class="consumeList">
              <thead>
                  <tr class="total-row">
                  <th style="width: 30%;">총 소비</th>
                  <th style="width: 30%;"></th>
                  <th style="width: 40%;">{{ totalSum !== null ? totalSum.toLocaleString() : '0' }} 원</th>
                </tr>
              </thead>

              <tbody>
                <!-- 각 카테고리별 소비 -->
                <tr v-for="(category, index) in topCategories" :key="index" @click="showDetail(category)">
                  <td>
                    <font-awesome-icon :icon="['fas', 'circle']" class="icon" :style="{ color: iconColors[index] || '#000' }" />
                    {{ category.category || '없음' }}
                  </td>
                  <td>{{ totalSum > 0 ? Math.round((category.sum / totalSum) * 100) : 0 }}%</td>
                  <td>{{ category.sum !== null ? category.sum.toLocaleString() : '0' }} 원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

  
      <div v-if="showDetailModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeDetailModal">&times;</span>
          <h3>{{ selectedCategory.category }}의 세부 항목</h3>
          <ul>
            <li v-for="(detail, index) in filteredItems" :key="index">
              {{ detail.category }}: {{ detail.sum.toLocaleString() }} 원
            </li>
          </ul>
  
          <router-link style="text-decoration: none;":to="{ path: '/budget/list', query: { category: selectedCategory.category } }">
            <button class="btn btn-pink">세부항목 보러가기</button>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useMonthStore } from '@/stores/consume/curMonth';
  import axios from 'axios';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController } from 'chart.js';
  import { nextTick, onMounted, ref, watch } from 'vue';
  import axiosinstance from '@/AxiosInstance';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController);
  
  const month = useMonthStore();
  const doughnutChart = ref(null);
  let chartInstance = null;
  
  const totalSum = ref(0);
  const categories = ref([]);
  const topCategories = ref([]);
  const filteredItems = ref([]);
  let labels = ref([]);
  let data = ref([]);
  const iconColors = ['#FF0062', '#C30044', '#DA0052', '#FFF2F6', '#DCD4D4'];
  
  const showDetailModal = ref(false);
  const selectedCategory = ref({});
  
  const categoryMapping = {
    '식료품': '식료품',
    '식료품 · 비주류음료': '식료품',
    '주류 · 담배': '유흥',
    '의류 · 신발': '쇼핑',
    '주거 · 수도 · 광열': '공과금',
    '가정용품 · 가사서비스': '생활용품',
    '보건': '의료비',
    '교통': '교통비',
    '통신': '통신비',
    '오락 · 문화': '문화',
    '교육': '교육비',
    '음식 · 숙박': '외식·숙박',
    '기타상품 · 서비스': '기타',
  };
  
  const showDetail = (category) => {
    if (category.category === '그 외') {
      selectedCategory.value = category;
      filteredItems.value = categories.value.slice(4);
    } else {
      selectedCategory.value = category;
      filteredItems.value = categories.value.filter(item => item.category === category.category);
    }
    showDetailModal.value = true;
  };
  
  const closeDetailModal = () => {
    showDetailModal.value = false;
  };
  
  const processCategories = () => {
    const processedData = {};
  
    categories.value.forEach(item => {
      const mappedCategory = categoryMapping[item.category] || '기타';
      if (!processedData[mappedCategory]) {
        processedData[mappedCategory] = 0;
      }
      processedData[mappedCategory] += item.sum;
    });
  
    const mappedCategories = Object.entries(processedData).map(([category, sum]) => ({
      category,
      sum,
    }));
  
    if (mappedCategories.length > 5) {
      const top4 = mappedCategories.slice(0, 4);
      const others = mappedCategories.slice(4);
  
      const othersSum = others.reduce((sum, item) => sum + item.sum, 0);
      topCategories.value = [...top4, { category: '그 외', sum: othersSum }];
    } else {
      topCategories.value = mappedCategories;
    }
  
    labels.value = topCategories.value.map(item => item.category || '없음');
    data.value = topCategories.value.map(item => item.sum || 0);
  };
  
  const renderDoughnutChart = async () => {
    await nextTick();
  
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    try {
      const response = await axiosinstance.get(`/outcome/category/sum/${month.year}/${month.month}`);
      const responseData = response.data.response.data;
  
      categories.value = responseData.categorys || [];
      totalSum.value = responseData.sum || 0;
  
      processCategories();
    } catch (error) {
      console.error('Axios 요청 실패:', error);
      labels.value = [];
      data.value = [];
      totalSum.value = 0;
      categories.value = [];
      topCategories.value = [];
    }
  
    chartInstance = new ChartJS(doughnutChart.value, {
      type: 'doughnut',
      data: {
        labels: labels.value,
        datasets: [{
          data: data.value,
          backgroundColor: iconColors,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 20,
              padding: 20,
            },
          },
        },
      },
    });
  };
  
  onMounted(() => {
    renderDoughnutChart();
  });
  
  watch(() => month.month, () => {
    renderDoughnutChart();
  });
  </script>
  
  <style scoped>
  * {
    max-width: 1980px;
    font-family: 'Pretendard', sans-serif;
    font-size: 18px;
  }
  
  .wrapper {
    margin: 0 auto;
    /* padding: 20px; */
  }
  
  .analyzeWrapper {
    width: 1000px;
    border-radius: 20px;
    border: 1px solid var(--1, #D9D9D9);
    background: #FFF;
    padding: 30px;
    margin-bottom: 40px;
  }
  
  .analyzeText {
    text-align: center;
    margin-top: 8px;
    flex-shrink: 0;
    border-radius: 20px;
    background: #FAFAFB;
    display: flex;
    height: 120px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    border: 1px solid #f8f8f8;
  }
  
  span {
    color: var(--black-default, #19181D);
    text-align: center;
    font-family: Pretendard;
    font-size: 18px;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: -0.8px;
  }
  
  .total-asset {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 20px;
}

.asset-title {
  font-size: 20px;
  font-weight: 400;
  margin-top: 10px;
}

.asset-amount {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

  .analyzeText #month,
  .analyzeText #mostCategory {
    font-size: 18px;
    color: #FF0062;
  }
  
  .analyze {
    width: 900px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .chart {
    width: 450px;
    height: 300px;
  }
  
  .chart canvas {
    width: 100% !important;
    height: 100% !important;
  }
  
  .consumeSummary {
    width: 450px;
  }
  
  .totalConsumeAmount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .consumeList {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    background-color: #ffffff;
    border-radius: 10px;
  }
  
  .consumeList th {
    text-align: left;
    padding: 12px;
    font-size: 16px;
    background-color: #f2f2f2;
    font-weight: 500;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .consumeList td {
    padding: 12px;
    font-size: 16px;
    color: #333333;
    vertical-align: middle;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .consumeList tr:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }
  
  .icon {
    margin-right: 10px;
    width: 12px;
    height: 12px;
  }
  
  .modal {
  z-index: 1000;
  position: fixed; /* 화면 전체를 덮기 위해 fixed 설정 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    position: relative;
  }
  
  .modal-content h3 {
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .modal-content ul {
    list-style-type: none;
    padding: 0;
  }
  
  .modal-content li {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    cursor: pointer;
  }
  
  .btn{
    text-decoration: none;
  }
  
  .btn-pink {
    display: block;
    margin: 0 auto;
    padding: 10px 20px;
    background-color: #ff007f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    text-decoration: none;
  }
  
  .btn-pink:hover {
    background-color: #e60073;
  }

  .analyzeWrapper {
  border-radius: 20px;
  border: 1px solid #e4ebf0;
  background: #FFF;
  padding: 30px;
  margin-bottom: 40px;
}

.analyze {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 가운데 정렬 */
}

.chart {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center; /* 차트도 세로 가운데 정렬 */
}

.consumeSummary {
  width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 가운데 정렬 */
}

.consumeList {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.consumeList th, .consumeList td {
  padding: 12px;
  text-align: left;
}

.total-row th {
  font-weight: bold;
  font-size: 16px;
}

.sub-title{
  color: var(--3, #414158);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;
}

.main-title{
  margin-top : 8xp;
  color: var(--3, #414158);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px; /* 135% */  
}

  </style>
  