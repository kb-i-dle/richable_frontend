<template>
  <div class="modal fade" id="expenseModal" tabindex="-1" aria-labelledby="expenseLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="expenseLabel" style="font-weight: bold;">소득 등록</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px;">
          <!-- 유형 선택 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">유형</label>
            <select class="form-select" v-model="incomeType" id="expenseType" placeholder="유형을 선택해주세요">
              <option value="월급">월급</option>
              <option value="비정기소득">비정기 소득</option>
              <option value="보너스">보너스</option>
            </select>
          </div>

          <!-- 날짜 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">날짜</label>
            <input type="date" v-model="incomeDate" class="form-control" id="expenseDate" placeholder="날짜를 선택해주세요">
          </div>

          <!-- 가격 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
            <div class="input-group">
              <input type="text" v-model="incomeAmount" class="form-control" id="expenseAmount" placeholder="가격을 입력해주세요">
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
            <input type="text" v-model="incomeContent" class="form-control" id="expenseContent" placeholder="내용을 입력해주세요">
          </div>

          <!-- 메모 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
            <input type="text" v-model="incomeMemo" class="form-control" id="expenseMemo" placeholder="메모를 입력해주세요">
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
          <button type="button" class="btn text-white" style="background-color: #FF0062; width: 62px;" @click="registerIncome">
            완료
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import axios from 'axios';
import { Modal } from 'bootstrap';
import axiosInstance from '@/AxiosInstance'

// 모달 초기화 변수
const modal = ref(null);
let modalInstance = null;

// 소득 등록을 위한 데이터 바인딩 변수
const incomeType = ref('');       // 소득 유형
const incomeDate = ref('');       // 소득 날짜
const incomeAmount = ref('');     // 소득 가격
const incomeContent = ref('');    // 소득 내용
const incomeMemo = ref('');       // 소득 메모
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
    modalInstance.show();
  }
};
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
}

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

// 소득 등록 버튼 클릭 시 서버로 데이터 전송
const registerIncome = async () => {
  const incomeData = {
    type: incomeType.value,        // 소득 유형
    price: incomeAmount.value,     // 소득 가격
    date: incomeDate.value,        // 소득 날짜
    contents: incomeContent.value, // 소득 내용
    memo: incomeMemo.value,        // 메모
    accountNum: selectedAccount.value
  };
  
  try {
    const response = await axiosInstance.post('/income/add', incomeData);
    if (response.data.success) {
      console.log("소득 등록 성공:", response.data.response.data);
      // 추가 동작 (모달 닫기 등)
      if (modalInstance) {
        modalInstance.hide();  // 소득 등록 성공 시 모달 닫기
      }
    } else {
      console.error("소득 등록 실패:", response.data);
    }
  } catch (error) {
    console.error("소득 등록 실패:", error);
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
