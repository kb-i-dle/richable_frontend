<template>
  <div>
    <!-- 소득 리스트 출력 -->
    <ul>
      <li v-for="income in incomeList" :key="income.incomeId">
        {{ income.incomeDate }} - {{ income.type }} - {{ income.price }}원
      </li>
    </ul>

    <!-- 수정 모달 -->
    <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <!-- 삭제 모달이 열리면 수정 모달에 흐림 효과 적용 -->
        <div class="modal-content" :class="{ 'blur-background': isDeleteModalVisible }">
          <div class="modal-header">
            <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">소득 수정</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
            <!-- 분류 및 날짜 선택 -->
            <div class="mb-3" style="display: flex; justify-content: space-between; gap: 10px;">
              <!-- 분류 선택 -->
              <div style="flex: 1;">
                <label for="assetType" class="form-label" style="font-weight: bold;"></label>
                <select class="form-select" id="assetType" v-model="type">
                  <option value="월급">월급</option>
        <option value="비정기 소득">비정기 소득</option>
        <option value="이자 소득">이자 소득</option>
        <option value="투자 소득">투자 소득</option>
        <option value="보너스">보너스</option>
                </select>
              </div>

              <!-- 날짜 선택 -->
              <div style="flex: 1;">
                <label for="incomeDate" class="form-label" style="font-weight: bold;"></label>
                <input type="date" class="form-control" id="incomeDate" v-model="incomeDate" placeholder="날짜를 선택해주세요">
              </div>
            </div>

            <!-- 가격 입력 -->
            <div class="mb-3" style="display: flex;">
              <label for="incomeAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
              <div class="input-group">
                <input type="text" class="form-control" id="incomeAmount" v-model="price" placeholder="가격을 입력해주세요">
                <span class="input-group-text">원</span>
              </div>
            </div>

            <!-- 내용 입력 -->
            <div class="mb-3" style="display: flex;">
              <label for="incomeContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
              <input type="text" class="form-control" id="incomeContent" v-model="contents" placeholder="내용을 입력해주세요">
            </div>

            <!-- 메모 입력 -->
            <div class="mb-3" style="display: flex;">
              <label for="incomeMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
              <input type="text" class="form-control" id="incomeMemo" v-model="memo" placeholder="메모를 입력해주세요">
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn" @click="showDeleteConfirmation">
              <font-awesome-icon icon="trash-can" />
            </button>
            <div>
              <button type="button" class="btn" data-bs-dismiss="modal"
                style="background-color: white; border: 1px solid #020202; color : #020202; font-weight: bold; margin-right: 12px; width: 62px;">취소</button>
              <button type="button" class="btn text-white"
                style="background-color: #FF0062; width: 62px;" @click="updateIncome">수정</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationLabel" aria-hidden="true" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteConfirmationLabel" style="font-weight: bold;">삭제 확인</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            정말로 삭제하시겠습니까?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeDeleteModal">아니오</button>
            <button type="button" class="btn text-white" 
              style="background-color: #FF0062;" @click="confirmDelete">예</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose, defineEmits } from 'vue';
import { Modal } from 'bootstrap';
import axiosInstance from '@/AxiosInstance';

// 이벤트 정의
const emit = defineEmits(['incomeUpdated', 'incomeDeleted']);
const incomeList = ref([]);

const modal = ref(null);
const deleteModal = ref(null);  // 삭제 확인 모달
let modalInstance = null;
let deleteModalInstance = null;  // 삭제 확인 모달 인스턴스
const isDeleteModalVisible = ref(false); 

// 데이터 바인딩 변수
const incomeId = ref(null);  
const type = ref(''); 
const incomeDate = ref(''); 
const price = ref(''); 
const contents = ref(''); 
const memo = ref(''); 

// 모달 열기 함수
const show = (data) => {
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true,
    });
    modalInstance.show();
  } else if (modalInstance) {
    modalInstance.show();
  }

  // 데이터 초기화 (수정하려는 데이터를 받으면 할당)
  if (data) {
    incomeId.value = data.incomeId;  
    type.value = data.type;
    incomeDate.value = new Date(data.incomeDate).toISOString().split('T')[0]; 
    price.value = data.price;
    contents.value = data.contents;
    memo.value = data.memo;
  }
};

// 삭제 확인 모달 열기
const showDeleteConfirmation = () => {
  isDeleteModalVisible.value = true;
  if (!deleteModalInstance && deleteModal.value) {
    deleteModalInstance = new Modal(deleteModal.value, {
      backdrop: 'static',
      keyboard: true,
    });
    deleteModalInstance.show();
  } else if (deleteModalInstance) {
    deleteModalInstance.show();
  }
};

// 삭제 모달 닫기 함수
const closeDeleteModal = () => {
  isDeleteModalVisible.value = false;
};

// 삭제 확인 후 실제 삭제 동작
const confirmDelete = async () => {
  try {
    const response = await axiosInstance.delete(`/income/delete/${incomeId.value}`);
    if (response.data.success) {
      console.log("소득 삭제 성공:", response.data.response.data);
      if (modalInstance) {
        modalInstance.hide();
      }
      if (deleteModalInstance) {
        deleteModalInstance.hide();
      }
      isDeleteModalVisible.value = false;
      emit('incomeDeleted', incomeId.value); // 삭제된 데이터의 ID 전달
    } else {
      console.error("소득 삭제 실패:", response.data.message);
    }
  } catch (error) {
    console.error("소득 삭제 실패:", error.response ? error.response.data : error);
  }
};


// 수정 버튼 클릭 시 동작
const updateIncome = async () => {
  try {
    const updatedIncomeData = {
      incomeId: incomeId.value,
      incomeDate: incomeDate.value,
      type: type.value,
      price: parseInt(price.value),
      contents: contents.value,
      memo: memo.value,
    };
    console.log('전송할 데이터:', updatedIncomeData);  // 데이터 확인용 로그
    const response = await axiosInstance.put('/income/update', updatedIncomeData);
    if (response.data.success) {
      console.log("소득 수정 성공:", response.data.response.data);
      if (modalInstance) {
        modalInstance.hide();
      }
      emit('incomeUpdated', updatedIncomeData); // 수정된 데이터 전달
    } else {
      console.error("소득 수정 실패:", response.data);
    }
  } catch (error) {
    console.error("소득 수정 실패:", error.response ? error.response.data : error);
  }
};


// 모달 인스턴스 초기화
onMounted(() => {
  if (modal.value && !modalInstance) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true,
    });
  }
  if (deleteModal.value && !deleteModalInstance) {
    deleteModalInstance = new Modal(deleteModal.value, {
      backdrop: 'static',
      keyboard: true,
    });
  }
});

defineExpose({ show });
</script>

<style scoped>
.modal-content {
  border-radius: 10px;
}

.darken-background {
  opacity: 0.6; /* 살짝 흐릿하게 보이도록 설정 */
  pointer-events: none; /* 삭제 모달이 열릴 때 수정 모달에서 클릭 이벤트를 막음 */
}

.btn-pink {
    background-color: #ff007f;
}

.blur-background {
  backdrop-filter: blur(5px); /* 살짝 흐림 효과 */
  opacity: 0.6;
}
</style>
