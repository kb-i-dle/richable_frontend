<template>
  <div class="container">
    <!-- 탭 바 -->
    <div class="tab-bar">
      <ul class="nav nav-tabs" style="display: flex; margin-right: 20px;">
        <li 
          class="nav-item nav-link" @click="selectedTab = 'expense'" :class="{ active: selectedTab === 'expense' }">
          소비
        </li>
        <li
        class="nav-item nav-link" @click="selectedTab = 'income'" :class="{ active: selectedTab === 'income' }">
          소득
        </li>
      </ul>
    </div>
    <!-- 소비 탭 -->
    <div v-if="selectedTab === 'expense'">
  
      <div class="nav" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
        <div class="filter-bar">
        <label class = "select-title" for="expenseCategory">소비 카테고리</label>
        <select style="height: 48px; margin-left:8px; " id="expenseCategory" v-model="selectedExpenseCategory" class="form-select short-select">
          <option value="">전체</option>
          <option value="식료품 · 비주류음료">식료품 · 비주류음료</option>
          <option value="주류 · 담배">주류 · 담배</option>
          <option value="의류 · 신발">의류 · 신발</option>
          <option value="주거 · 수도 · 광열">주거 · 수도 · 광열</option>
          <option value="가정용품 · 가사서비스">가정용품 · 가사서비스</option>
          <option value="보건">보건</option>
          <option value="교통">교통</option>
          <option value="통신">통신</option>
          <option value="오락 · 문화">오락 · 문화</option>
          <option value="교육">교육</option>
          <option value="음식">음식</option>
          <option value="기타상품">기타상품</option>
          <option value="비소비지출">비소비지출</option>
        </select>
      </div>

      </div>
      <div v-if="paginatedExpenses.length === 0" class="empty-state">
        등록된 소비가 없어요 <br/>
        나의 소비 내역에 등록해보세요!
      </div>

      <div v-else>
        <table class="table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>분류</th>
              <th>내용</th>
              <th>메모</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in paginatedExpenses" 
                :key="index" 
                @click="openDetailModal2(expense)" 
                @mouseover="hoverEffect(index)"
                @mouseleave="removeHoverEffect(index)"
                :class="{ 'hover-row': hoveredIndex === index }">
              <td>{{ expense.date }}</td>
              <td>{{ expense.expCategory }}</td>
              <td>{{ expense.descript }}</td>
              <td>{{ expense.memo }}</td>
              <td>{{ expense.amount.toLocaleString() }} 원</td>
            </tr>
          </tbody>
        </table>

      <!-- 페이지네이션 -->
      <Pagination :total="filteredExpenses.length" :page="currentPage" :perPage="itemsPerPage" @update:page="updatePage" />
    </div>
  </div>
    <!-- 소득 탭 -->

<div v-if="selectedTab === 'income'">
  <div class="nav" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">    
    <!-- 소득 카테고리 필터 -->
    <div class="filter-bar">
      <label class = "select-title" for="incomeCategory">소득 카테고리</label>
      <select  style="height: 48px; margin-left: 8px;"  v-model="selectedIncomeCategory" id="incomeCategory" class="form-select short-select">
        <option value="">전체</option>
        <option value="월급">월급</option>
        <option value="비정기 소득">비정기 소득</option>
        <option value="이자 소득">이자 소득</option>
        <option value="투자 소득">투자 소득</option>
        <option value="보너스">보너스</option>
      </select>
    </div>
  </div>

  <div v-if="paginatedIncomes.length === 0" class="empty-state">
    등록된 소득가 없어요 <br/>
    나의 소득 내역에 등록해보세요!
  </div>
  <div v-else>
  <!-- 소득 테이블 -->
  <table class="table">
    <thead>
      <tr>
        <th>날짜</th>
        <th>분류</th>
        <th>내용</th>
        <th>메모</th>
        <th>가격</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(income, index) in paginatedIncomes" 
          :key="index" 
          @click="openDetailModal(income)" 
          @mouseover="hoverEffect(index)"
          @mouseleave="removeHoverEffect(index)"
          :class="{ 'hover-row': hoveredIndex === index }">
        <td>{{ income.incomeDate }}</td>
        <td>{{ income.type }}</td>
        <td>{{ income.contents }}</td>
        <td>{{ income.memo }}</td>
        <td>{{ income.price.toLocaleString() }} 원</td>
      </tr>
    </tbody>
  </table>

  <!-- 페이지네이션 -->
  <Pagination :total="filteredIncomes.length" :page="currentPage" :perPage="itemsPerPage" @update:page="updatePage" />
</div>
</div>

    <!-- 등록 버튼 -->
    <button class="btn btn-pink" @click="selectedTab === 'expense' ? openCreateModal2() : openCreateModal()">
      <font-awesome-icon icon="plus" />
    </button>

    <!-- 소비/소득 등록 모달 -->
    <IncomeCreateModal ref="createModal" @incomeRegistered="fetchIncomes"/>
    <IncomeDetailModal ref="detailModal" :detail="selectedDetail" @close="switchModalInput"/>
    <IncomeUpdateModal ref="updateModal" :detail="selectedDetail"  @incomeUpdated="IncomeUpdated" @incomeDeleted="incomeDeleted" />

    <ConsumeCreateModal ref="createModal2" @outcomeRegistered="fetchExpenses" />
    <ConsumeDetailModal ref="detailModal2" :detail="selectedDetail2" @close="switchModalConsume"/>
    <ConsumeUpdateModal ref="updateModal2"  :detail="selectedDetail2"  @consumeUpdated="consumeUpdated" @consumeDeleted="consumeDeleted"/>
  </div>
</template>

<script setup>

import { ref, computed, watch, onMounted } from 'vue';
import Pagination from '@/components/modal/pagenation/Pagenation.vue';
import IncomeCreateModal from '@/components/modal/budget/IncomeCreateModal.vue'; 
import IncomeDetailModal from '@/components/modal/budget/IncomeDetailModal.vue';
import IncomeUpdateModal from '@/components/modal/budget/IncomeUpdateModal.vue'; 
import ConsumeCreateModal from '@/components/modal/budget/ConsumeCreateModal.vue'; 
import ConsumeDetailModal from '@/components/modal/budget/ConsumeDetailModal.vue';
import ConsumeUpdateModal from '@/components/modal/budget/ConsumeUpdateModal.vue';
import axiosInstance from '@/AxiosInstance';

import { useRoute } from 'vue-router';


// hoveredIndex 선언
const route = useRoute();
const selectedExpenseCategory2 = ref('');

const hoveredIndex = ref(null);
const isLoggedIn = ref(null);
const selectedTab = ref('expense');
const expenses = ref([]);
const incomes = ref([]);
const selectedExpenseCategory = ref('');
const selectedIncomeCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(9);
const totalExpenses = computed(() => expenses.value.length);
const totalIncomes = computed(() => incomes.value.length);

// 카테고리 매핑
const categoryMapping = {
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
  '음식': '외식',
  '기타상품': '기타',
  '비소비지출': '비소비지출'
};

const sortOrder = ref('desc');  // 최신순(desc) 또는 오래된순(asc)을 저장할 변수
const errorMessage = ref('');

function hoverEffect() { }

function removeHoverEffect() {}
// 소비 데이터 불러오기
const fetchExpenses = async () => {
  try {
    const response = await axiosInstance.get('/outcome/all');

    if (Array.isArray(response.data.response.data)) {
      expenses.value = response.data.response.data;
    } else {
      console.error('응답이 배열이 아닙니다:', response.data);
    }
  } catch (error) {
    console.error('소비 리스트 불러오기 실패:', error);
    errorMessage.value = '소비 데이터를 불러오는 중 오류가 발생했습니다.';
  }
};

// 소득 데이터 불러오기
const fetchIncomes = async () => {
  try {
    console.log("fetch");
    const response = await axiosInstance.get('/income/all');
    if (Array.isArray(response.data.response.data)) {
      incomes.value = response.data.response.data;
    } else {
      console.error('소득 리스트가 없습니다:', response.data);
    }
  } catch (error) {
    console.error('소득 리스트 불러오기 실패:', error);
    errorMessage.value = '소득 데이터를 불러오는 중 오류가 발생했습니다.';
  }
};

// 수정 모달 열기
const openEditModal = (income) => {
  const modalRef = ref(null);
  modalRef.value.show(income);  // 자식 컴포넌트에서 수정할 데이터 전달
};
//소득 수정
const IncomeUpdated = async ()=>{
  console.log( selectedDetail.value );
  const response = await axiosInstance.put('/income/update',  selectedDetail.value );
    if (response.data.success) {
      console.log("소득 수정 성공:", response.data);
      fetchIncomes();
      //화면 다시 불러오기 
    } else {
      console.error("소득 수정 실패:", response.data);
    }
}
// 소득 삭제
const incomeDeleted = async ()=>{
  console.log( selectedDetail.value.incomeId );
  const incomeId =  selectedDetail.value.incomeId;
  console.log(`/income/delete/${incomeId}`);

  const response = await axiosInstance.delete(`/income/delete/${incomeId}` );
    if (response.data.success) {
      console.log("소득 삭제 성공:", response.data);
      
      //화면 다시 불러오기 
      fetchIncomes();
    } else {
      console.error("소득 삭제 실패:", response.data);
    }
}

//소비 수정
const consumeUpdated = async ()=>{
  console.log( selectedDetail2.value );
  const response = await axiosInstance.put('/outcome/update',  selectedDetail2.value );
    if (response.data.success) {
    
      console.log("소득 수정 성공:", response.data);
      fetchExpenses();
      //화면 다시 불러오기 
    } else {
      console.error("소득 수정 실패:", response.data);
    }
}

//소비 수정
const consumeDeleted = async ()=>{
  const index = selectedDetail2.value.index;
  const response = await axiosInstance.delete(`/outcome/delete/${index}`);
    if (response.data.success) {
      console.log("소득 삭제 성공:", response.data);
      fetchExpenses();
      //화면 다시 불러오기 
    } else {
      console.error("소득 수정 실패:", response.data);
    }
}

// 모달 관련 상태
const createModal = ref(null);
const detailModal = ref(null);
const updateModal = ref(null);

const createModal2 = ref(null);
const detailModal2 = ref(null);
const updateModal2 = ref(null);

const selectedDetail = ref({}); 
const selectedDetail2 = ref({}); 

// 소득 모달 열기
const openDetailModal = (detail) => {
  if (detail && detail.incomeId) {
    selectedDetail.value = { ...detail };  // 소득 데이터를 복사하여 selectedDetail에 저장
    console.log('선택된 소득 데이터:', selectedDetail.value); // 데이터가 제대로 저장되었는지 확인
    detailModal.value?.show();  // 모달 열기
  } else {
    console.error('유효하지 않은 소득 데이터:', detail);
  }
};
const openUpdateModal = () => {

  updateModal.value?.show();
};

function switchModalInput(){
  //closeDetailModal();
  openUpdateModal();
}

// 소비 모달 열기
const openCreateModal = () => createModal.value?.show();
const openCreateModal2 = () => createModal2.value?.show();
const openDetailModal2 = (detail) => {
  selectedDetail2.value = detail;
  detailModal2.value?.show();
};

const openUpdateModal2 = () => {
  updateModal2.value?.show();
};

function switchModalConsume(){
  openUpdateModal2();
}
// 모달 닫기
const outcomeUpdate = (updatedoutcome) => {
  const index = outcome.value.findIndex(outcome => outcome.index === updatedoutcome.index); 
  if (index !== -1) {
    outcome.value.splice(index, 1, updatedoutcome); 
  }
};
// 소비 필터링 및 정렬
const filteredExpenses = computed(() => {
  let filtered = expenses.value;
  if (selectedExpenseCategory.value) {
    const selectedCategory = selectedExpenseCategory.value.trim().toLowerCase();
    filtered = filtered.filter(expense => expense.expCategory?.toLowerCase().includes(selectedCategory));
  }
  return filtered;
});

// 페이지네이션 적용된 최신순 소비 데이터
const paginatedExpenses = computed(() => {
  const sortedExpenses = [...filteredExpenses.value].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB; // 정렬 순서에 따라 변경
  });

  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedExpenses.slice(start, start + itemsPerPage.value);
});

// 소득 필터링 및 정렬
const filteredIncomes = computed(() => {
  let filtered = incomes.value;
  if (selectedIncomeCategory.value) {
    const selectedCategory = selectedIncomeCategory.value.trim().toLowerCase();
    filtered = filtered.filter(income => income.type?.toLowerCase().includes(selectedCategory));
  }
  return filtered;
});

// 페이지네이션 적용된 최신순 소득 데이터
const paginatedIncomes = computed(() => {
  const sortedIncomes = [...filteredIncomes.value].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB; // 정렬 순서에 따라 변경
  });
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedIncomes.slice(start, start + itemsPerPage.value);
});

// 정렬 순서 변경 함수
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'; // 최신순/오래된순 토글
};

// 페이지 변경
const updatePage = (newPage) => {
  currentPage.value = newPage;
};

// 탭 변경 시 데이터 로드
watch(selectedTab, (newTab) => {
  if (newTab === 'expense') {
    fetchExpenses();
  } else if (newTab === 'income') {
    fetchIncomes();
  }
});
onMounted(() => {
  const categoryFromQuery = route.query.category;
  if (categoryFromQuery) {
    // 카테고리 매핑을 사용하여 매칭되는 값을 설정
    selectedExpenseCategory.value = Object.keys(categoryMapping).find(key => categoryMapping[key] === categoryFromQuery) || categoryFromQuery;
  }
});
// 초기 데이터 로드
fetchExpenses(); 
</script>
<style scoped>
* {
  max-width: 1704px;
}

.short-select {
  width: 150px;
}

.filter-bar {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-left: 20px;
  overflow: auto;
  position: sticky;
}

.select-title {
  padding-bottom: 18px;
  padding-top: 18px;
  height: 12px;
  color: var(--gray-gray-90, #1D1D1D);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
}

#expenseCategory {
  color: #060606;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}

.tab-bar {
  margin-top: 20px;
  margin-left: 20px;
}

.nav-tabs {
  border-bottom: 2px solid #414158;
}

.nav-item {
  color: #CCCCD6;
  width: 150px;
  height: 45px;
  text-align: center;
  font-size: 18px;
  line-height: 30px;
  border: 1px solid #CCCCD6;
}

.nav-item.active {
  background-color: #414158;
  color: white;
  border-bottom: 2px solid #414158;
}

.table {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.table th, .table td {
  padding: 15px;
  border: none;
}

.table thead th {
  font-size: 18px;
  background-color: #f9f9f9;
  color: var(--3, #414158);
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  letter-spacing: -0.36px;
  border-radius: 10px 10px 0px 0px;
}

.table tbody tr {
  background-color: white;
  border-radius: 8px;
}

.table tbody tr:hover {
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table td {
  padding: 15px;
  color: var(--3, #414158);
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.32px;
}

.btn-pink {
  background-color: #ff007f;
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 57px;
  height: 57px;
  border-radius: 50%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  color: white;
  border: none;
  z-index: 100;
}

.empty-state {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 18px;
  font-family: Pretendard;
  font-weight: 400;
}

.container {
  margin-left: 104px;
}

/* 웹용 */
@media (min-width: 1024px) {
  .container {
    margin-left: 104px;
  }
  .short-select {
    width: 150px;
  }
  .nav-item {
    font-size: 18px;
    width: 150px;
  }
}

/* 태블릿용 */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    margin-left: 50px;
  }
  .short-select {
    width: 120px;
  }
  .nav-item {
    font-size: 16px;
    width: 120px;
  }
  .table td {
    font-size: 14px;
  }
}

/* 모바일용 */
@media (max-width: 767px) {
  .container {
    margin-left: 10px;
  }
  .short-select {
    width: 100px;
  }
  .nav-item {
    font-size: 14px;
    width: 100px;
  }
  .table td {
    font-size: 12px;
  }
  .btn-pink {
    width: 50px;
    height: 50px;
    bottom: 30px;
    right: 30px;
  }
}
</style>

