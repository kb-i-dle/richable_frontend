<template>
  <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <!-- 삭제 모달이 열리면 수정 모달에 흐림 효과 적용 -->
      <div class="modal-content" :class="{ 'blur-background': isDeleteModalVisible }">
        <div class="modal-header">
          <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">소비 상세</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
       
        <div class="modal-body" style="padding:20px; padding-bottom: 12px;">
          <!-- 분류 -->
          <div class="mb-3" style="display: flex; align-items: center;">
            <label for="incomeType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 0;">분류</label>
            <input type="text" class="form-control" readonly v-model="props.detail.expCategory" />
          </div>

          <!-- 날짜 -->
          <div class="mb-3" style="display: flex; align-items: center;">
            <label for="incomeDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 0;">날짜</label>
            <input type="text" class="form-control" readonly v-model="props.detail.date" />
          </div>

          <!-- 가격 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">가격</label>
            <div class="input-group" style="flex-grow: 1;">
              <input type="text" class="form-control" readonly v-model="props.detail.amount" />
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">내용</label>
            <input type="text" class="form-control" readonly v-model="props.detail.descript" />
          </div>

          <!-- 메모 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">메모</label>
            <input type="text" class="form-control" readonly v-model="props.detail.memo" />
          </div>
        </div>

        <!-- 모달 하단 버튼 -->
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn" @click="editEntry" style="background-color: white; border: 1px solid #020202;">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />
          </button>
          <div>
            <button type="button" class="btn" data-bs-dismiss="modal" style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; width: 62px;">취소</button>
            <button type="button" class="btn text-white" style="background-color: #FF0062; width: 62px;">완료</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits } from 'vue';
import { Modal } from 'bootstrap';

// 이벤트 정의
const props = defineProps({ detail: { type: Object, required: true } });
const emit = defineEmits(['close']);

const modal = ref(null);
let modalInstance = null;

// 모달 열기 함수
const show = (Index) => {  

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

const editEntry = () => {
  if(modalInstance) {
    modalInstance.hide();
  }
  emit('close');
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

/* 삭제 모달이 열리면 흐리게 표시 */
.blur-background {
  backdrop-filter: blur(5px);
  opacity: 0.6;
}
</style>
