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
          <div class="mb-3" style="display: flex;">
            <label for="expenseType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">유형</label>
            <select class="form-select" id="expenseType" v-model="expenseCategory">
              <option value="식료품">식료품</option>
              <option value="유흥">유흥</option>
              <option value="쇼핑">쇼핑</option>
              <option value="공과금">공과금</option>
              <option value="생활용품">생활용품</option>
              <option value="의료비">의료비</option>
              <option value="교통비">교통비</option>
              <option value="통신비">통신비</option>
              <option value="문화">문화</option>
              <option value="교육비">교육비</option>
              <option value="외식 · 숙박">외식 · 숙박</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <!-- 날짜 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">날짜</label>
            <input type="date" class="form-control" id="expenseDate" v-model="expenseDate">
          </div>

          <!-- 가격 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
            <div class="input-group">
              <input type="text" class="form-control" id="expenseAmount" v-model="expenseAmount">
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
            <input type="text" class="form-control" id="expenseContent" v-model="expenseDescript">
          </div>

          <!-- 메모 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
            <input type="text" class="form-control" id="expenseMemo" v-model="expenseMemo">
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
import { ref, onMounted, defineExpose } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import axiosInstance from '@/AxiosInstance'

// 모달 초기화 변수
const modal = ref(null);
let modalInstance = null;

// 소비 등록을 위한 데이터 바인딩 변수
const expenseCategory = ref('') // 소비 유형
const expenseAmount = ref('') // 소비 가격
const expenseDescript = ref('') // 소비 내용
const expenseMemo = ref('') // 소비 메모
const expenseDate = ref('')
const accounts = ref([])
const selectedAccount = ref(0)

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
const registerExpense = async () => {
  try {
    const expenseData = {
      expCategory: expenseCategory.value,              
      amount: parseInt(expenseAmount.value),           
      descript: expenseDescript.value,                 
      memo: expenseMemo.value,
      date : expenseDate.value,
      accountNum: selectedAccount.value
    };

    console.log(expenseData);

    const response = await axiosInstance.post('/outcome/add', expenseData);
    console.log(response.data);
    if (response.data.success) {
      console.log("소비 등록 성공:", response.data.response.data);
      if (modalInstance) {
        modalInstance.hide();
      }
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
