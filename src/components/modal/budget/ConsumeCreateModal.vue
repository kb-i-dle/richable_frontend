<template>
  <div class="modal fade" id="expenseModal" tabindex="-1" aria-labelledby="expenseLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="expenseLabel" style="font-weight: bold;">소비 등록</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px;">
          <!-- 유형 선택 -->
          <div class="mb-3 form-group" style="display: flex;">
            <label for="expenseType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">유형</label>
            <select class="form-select" id="expenseType" v-model="expenseCategory" style="flex-grow: 1;">
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

          <!-- 날짜 입력 -->
          <div class="mb-3 form-group" style="display: flex;">
            <label for="expenseDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">날짜</label>
            <input type="date" class="form-control" id="expenseDate" v-model="expenseDate" style="flex-grow: 1;">
          </div>

          <!-- 가격 입력 -->
          <div class="mb-3 form-group" style="display: flex;">
            <label for="expenseAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
            <div class="input-group" style="flex-grow: 1;">
              <input type="text" class="form-control" id="expenseAmount" v-model="expenseAmount">
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 입력 -->
          <div class="mb-3 form-group" style="display: flex;">
            <label for="expenseContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
            <input type="text" class="form-control" id="expenseContent" v-model="expenseDescript" style="flex-grow: 1;">
          </div>

          <!-- 메모 입력 -->
          <div class="mb-3 form-group" style="display: flex;">
            <label for="expenseMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
            <input type="text" class="form-control" id="expenseMemo" v-model="expenseMemo" style="flex-grow: 1;">
          </div>

          <!-- 계좌 선택 -->
          <div class="mb-3 form-group" style="display: flex;">
            <label for="selectAccount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">계좌</label>
            <select class="form-select" id="selectAccount" v-model="selectedAccount" style="flex-grow: 1;">
              <option value="" disabled>계좌를 선택하세요</option>
              <option v-for="account in accounts" :key="account.index" :value="account.accountNum">
                {{ account.orgCode }} - {{ account.accountNum }} - {{ account.prodName }}
              </option>
            </select>
          </div>

        </div>

        <!-- 계좌 선택 -->
        <div class="mb-3" style="display: flex">
          <label
            for="selectAccount"
            class="form-label"
            style="font-weight: bold; width: 70px; padding-top: 8px"
            >계좌</label
          >
          <select class="form-select" id="selectAccount" v-model="selectedAccount">
            <option value="" disabled>계좌를 선택하세요</option>
            <option v-for="account in accounts" :key="account.index" :value="account.accountNum">
              {{ account.orgCode }} - {{ account.accountNum }} - {{ account.prodName }}
            </option>
          </select>
        </div>

        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn" data-bs-dismiss="modal"
            style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px; width: 62px;">
            취소
          </button>
          <button type="button" class="btn text-white" style="background-color: #FF0062; width: 62px;" @click="registerExpense">
            완료
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref, onMounted, defineExpose } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
=======
import { ref, onMounted, defineExpose, defineEmits } from 'vue'
import { Modal } from 'bootstrap'
>>>>>>> 3e3263b13425072d0de7937f9e59a7719a3b48bf
import axiosInstance from '@/AxiosInstance'

// 모달 초기화 변수
const emit = defineEmits(['outcomeRegistered']);
const modal = ref(null);
let modalInstance = null;
// 소비 등록을 위한 데이터 바인딩 변수
const expenseCategory = ref('') // 소비 유형
const expenseAmount = ref('') // 소비 가격
const expenseDescript = ref('') // 소비 내용
const expenseMemo = ref('') // 소비 메모
<<<<<<< HEAD
const expenseDate = ref('')
const accounts = ref([])
const selectedAccount = ref(0)
=======
const expenseDate = ref('') // 소비 날짜
const accounts = ref([]) // 계좌 목록
const selectedAccount = ref(0) // 선택한 계좌
>>>>>>> 3e3263b13425072d0de7937f9e59a7719a3b48bf

// 모달 열기 함수
const show = () => {
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true,
    });
    modalInstance.show();
  } else if (modalInstance) {
    modalInstance.show()
  }
}
<<<<<<< HEAD
=======

// 계좌 목록 불러오기
>>>>>>> 3e3263b13425072d0de7937f9e59a7719a3b48bf
const fetchAccounts = async () => {
  try {
    const response = await axiosInstance.get('/asset/account/list')
    if (response.data.success) {
      accounts.value = response.data.response.data.account
    } else {
      console.error('계좌 목록 조회 실패:', response.data)
    }
  } catch (error) {
    console.error('계좌 목록 조회 실패:', error.response ? error.response.data : error)
  }
};

// 컴포넌트가 마운트될 때 모달 초기화
onMounted(() => {
  if (modal.value && !modalInstance) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true
    });
  }
  fetchAccounts()
});

// 소비 등록 버튼 클릭 시 서버로 데이터 전송
const registerExpense = async () => {
  try {
    const expenseData = {
<<<<<<< HEAD
      expCategory: expenseCategory.value,              
      amount: parseInt(expenseAmount.value),           
      descript: expenseDescript.value,                 
      memo: expenseMemo.value,
      date : expenseDate.value,
=======
      expCategory: expenseCategory.value,
      amount: parseInt(expenseAmount.value),
      descript: expenseDescript.value,
      memo: expenseMemo.value,
      date: expenseDate.value,
>>>>>>> 3e3263b13425072d0de7937f9e59a7719a3b48bf
      accountNum: selectedAccount.value
    };

    console.log("전송할 데이터:", expenseData); // 데이터 확인용 로그

    const response = await axiosInstance.post('/outcome/add', expenseData);
    if (response.data.success) {
      console.log("소비 등록 성공:", response.data.response.data);
      if (modalInstance) {
        modalInstance.hide();
      }
      emit('outcomeRegistered'); 
      console.log('outcomeRegistered');
    } else {
      console.error("소비 등록 실패:", response.data);
    }
  } catch (error) {
    console.error("소비 등록 실패:", error.response ? error.response.data : error);
  }
};


defineExpose({ show });
</script>

<style scoped>
.modal-content {
  border-radius: 10px;
}

.btn-pink {
  background-color: #ff007f;
}
</style>
