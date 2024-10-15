<template>
  <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <!-- 삭제 모달이 열리면 수정 모달에 흐림 효과 적용 -->
      <div class="modal-content" :class="{ 'blur-background': isDeleteModalVisible }">
        <div class="modal-header">
          <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">소비 수정</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
          <!-- 분류 및 날짜 선택 -->
          <div class="mb-3" style="display: flex; justify-content: space-between; gap: 10px;">
            <!-- 분류 선택 -->
            <div style="flex: 1;">
              <label for="assetType" class="form-label" style="font-weight: bold;"></label>
              <select class="form-select" id="assetType" v-model="props.detail.expCategory">
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

            <!-- 날짜 선택 -->
            <div style="flex: 1;">
              <label for="expenseDate" class="form-label" style="font-weight: bold;"></label>
              <input type="date" class="form-control" id="expenseDate" v-model="$props.detail.date" placeholder="날짜를 선택해주세요">
            </div>
          </div>

          <!-- 가격 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
            <div class="input-group">
              <input type="text" class="form-control" id="expenseAmount" v-model="$props.detail.amount" placeholder="가격을 입력해주세요">
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
            <input type="text" class="form-control" id="expenseContent" v-model="$props.detail.descript" placeholder="내용을 입력해주세요">
          </div>

          <!-- 메모 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
            <input type="text" class="form-control" id="expenseMemo" v-model="$props.detail.memo" placeholder="메모를 입력해주세요">
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
              style="background-color: #FF0062; width: 62px;" @click="updateOutcome">수정</button>
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
import { ref, onMounted, defineExpose, defineEmits, defineProps } from 'vue';
import { Modal } from 'bootstrap';
import axiosInstance from '@/AxiosInstance';

const props = defineProps({ detail: { type: Object, required: true } });

// 이벤트 정의
const emit = defineEmits(['consumeUpdated', 'consumeDeleted']);

const modal = ref(null);
const deleteModal = ref(null);
let modalInstance = null;
let deleteModalInstance = null;
const isDeleteModalVisible = ref(false);

// 소비 데이터 바인딩
const index = ref('');
const expCategory = ref('');
const date = ref('');
const amount = ref('');
const descript = ref('');
const memo = ref('');

// 모달 열기 함수
const show = () => {
  if (props.detail && props.detail.index) {
    if (!modalInstance && modal.value) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true,
      });
    }
    modalInstance.show();  // 모달을 화면에 표시
  } else {
    console.error('유효하지 않은 소비 데이터입니다:', props.detail);
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
      if (modalInstance) {
        modalInstance.hide();
      }
      if (deleteModalInstance) {
        deleteModalInstance.hide();
      }
      emit("consumeDeleted");
  } catch (error) {
    console.error("소득 삭제 실패:", error.response ? error.response.data : error);
  }
};


const updateOutcome = async () => {
  try {
   
   console.log('전송할 데이터:', props.detail);  // 데이터 확인용 로그
   if (modalInstance) {
     modalInstance.hide();
   }
   emit("consumeUpdated");
 } catch (error) {
   console.error("소득 수정 실패:", error.response ? error.response.data : error);
 }
};

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

.btn-pink {
    background-color: #ff007f;
}

/* 삭제 모달이 열리면 흐리게 표시 */
.blur-background {
  backdrop-filter: blur(5px);
  opacity: 0.6;
}
</style>
