<template>
  <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="detailModalLabel" style="font-weight: bold;">소득 상세 조회</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding:20px; padding-bottom: 12px;">
          <!-- 분류 -->
          <div class="mb-3" style="display: flex; align-items: center;">
            <label for="incomeType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 0;">분류</label>
            <input type="text" class="form-control" readonly v-model="props.detail.type" />
          </div>

          <!-- 날짜 -->
          <div class="mb-3" style="display: flex; align-items: center;">
            <label for="incomeDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 0;">날짜</label>
            <input type="text" class="form-control" readonly v-model="props.detail.incomeDate" />
          </div>

          <!-- 가격 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">가격</label>
            <div class="input-group" style="flex-grow: 1;">
              <input type="text" class="form-control" readonly v-model="props.detail.price" />
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">내용</label>
            <input type="text" class="form-control" readonly v-model="props.detail.contents" />
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
import { ref, defineExpose, defineProps, defineEmits } from 'vue';
import { Modal } from 'bootstrap';

// Props로 전달된 detail 객체
const props = defineProps({ detail: { type: Object, required: true } });
const emit = defineEmits(['close']);

const modal = ref(null);
let modalInstance = null;


// 모달 열기 함수
const show = (incomeId) => {
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: false,
    });
    modalInstance.show();
  } else if (modalInstance) {
    modalInstance.show();
  }
};

// 수정 모달 열기 함수
const editEntry = () => {
  if (modalInstance) {
    modalInstance.hide();
  }
  emit('close');
};

defineExpose({ show });
</script>

<style scoped>
.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}

.btn {
  font-weight: bold;
}

.btn-pink {
  background-color: #ff007f;
  color: white;
}

.input-group-text {
  background-color: white;
}

.input-group-text i {
  font-size: 1.2em;
}
</style>
