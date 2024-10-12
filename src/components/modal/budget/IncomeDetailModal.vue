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
            <input type="text" class="form-control" readonly v-model="detail.type" />
          </div>

          <!-- 날짜 -->
          <div class="mb-3" style="display: flex; align-items: center;">
            <label for="incomeDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 0;">날짜</label>
            <input type="text" class="form-control" readonly v-model="detail.incomeDate" />
          </div>

          <!-- 가격 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">가격</label>
            <div class="input-group" style="flex-grow: 1;">
              <input type="text" class="form-control" readonly v-model="detail.price" />
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">내용</label>
            <input type="text" class="form-control" readonly v-model="detail.contents" />
          </div>

          <!-- 메모 -->
          <div class="mb-3" style="display: flex;">
            <label class="form-label" style="font-weight: bold; width: 70px;">메모</label>
            <input type="text" class="form-control" readonly v-model="detail.memo" />
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
  <IncomeUpdateModal ref="updateModal2" />
</template>

<script setup>
import { ref, defineExpose, defineProps } from 'vue';
import { Modal } from 'bootstrap';
import IncomeUpdateModal from '@/components/modal/budget/IncomeUpdateModal.vue';
import axiosInstance from '@/AxiosInstance';


const props = defineProps({ detail: { type: Object, required: true } });

const modal = ref(null);
let modalInstance = null;
const updateModal2 = ref(null);

// 소득 상세 조회 API 호출 함수
const fetchIncomeDetail = async (index) => {
  try {
    const response = await axiosInstance.get(`/income/detail/${index}`);
    if (response.data.success) {
      // props.detail 업데이트
      detail.value = response.data.response.data;
    } else {
      console.error('소득 상세 조회 실패:', response.data);
    }
  } catch (error) {
    console.error('소득 상세 조회 중 오류 발생:', error);
  }
};

// 모달 열기 함수
const show = (index) => {
  fetchIncomeDetail(index);  // 소득 상세 조회
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

  // IncomeUpdateModal 열기
  if (updateModal2.value && updateModal2.value.show) {
    updateModal2.value.show(props.detail);
  } else {
    console.log('IncomeUpdateModal이 로드되지 않음');
  }
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
