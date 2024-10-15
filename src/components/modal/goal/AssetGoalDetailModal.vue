<template>
  <div
    class="modal fade"
    id="assetGoalDetailModal"
    tabindex="-1"
    aria-labelledby="assetGoalDetailLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="assetGoalDetailLabel" style="font-weight: bold">
            목표 자산 항목 조회
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px">
          <div class="mb-3" style="display: flex; justify-content: space-between">
            <label class="form-label" style="font-weight: bold">분 류</label>
            <div>{{ goalDetail.title }}</div>
            <!-- 제목 표시 -->
          </div>
          <div class="mb-3" style="display: flex; justify-content: space-between">
            <label class="form-label" style="font-weight: bold; white-space: nowrap; margin-right: 10px;">목표량</label>
            <div class="input-group" style="text-align: right">
              <!-- 사용자 입력 필드 -->
              <input v-model="goalDetail.amount" type="number" class="form-control" />
              <span class="input-group-text">원</span>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button
            type="button"
            class="btn"
            @click="deleteGoal"
            style="
              background-color: white;
              border: 1px solid #020202;
              color: #020202;
              font-weight: bold;
            "
          >
            <font-awesome-icon icon="trash" />
          </button>
          <div>
            <button
              type="button"
              class="btn"
              data-bs-dismiss="modal"
              style="
                background-color: white;
                border: 1px solid #020202;
                color: #020202;
                font-weight: bold;
                margin-right: 12px;
              "
            >
              취소
            </button>
            <button
              type="button"
              class="btn text-white"
              style="background-color: #ff0062"
              @click="submitGoal"
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { Modal } from 'bootstrap'
// import axios from 'axios'
import Instance from '@/AxiosInstance.js'

// emit 함수 정의 (Vue 3)
const emit = defineEmits(['goalDeleted', 'goalUpdated'])

// 목표 세부 정보를 위한 데이터
const goalDetail = ref({
  index: null, // 고유한 목표 ID (index)
  title: '자산 형성', // 분류
  amount: 100000000 // 목표량
})

const modal = ref(null)
let modalInstance = null

// 모달 열기 함수
const show = (goalData) => {
  goalDetail.value = {
    index: goalData.index || null, // index 값이 제대로 들어왔는지 확인
    title: goalData.title || '자산 형성', // title 할당
    amount: goalData.amount || 0, // amount 할당
    category: goalData.category || '자산' // category 할당
  }

  console.log('Goal Detail Set:', goalDetail.value) // index와 category가 제대로 들어왔는지 로그로 확인

  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true
    })
    modalInstance.show()
  } else if (modalInstance) {
    modalInstance.show()
  }
}

// 목표 자산을 수정하는 함수 (PUT 요청)
const submitGoal = async () => {
  try {
    const response = await Instance.put(`/goal/${goalDetail.value.index}`, {
      amount: goalDetail.value.amount // 수정된 목표량 전송
    })

    if (response.data.success) {
      console.log('Goal successfully updated:', response.data.response.data)
      emit('goalUpdated', goalDetail.value) // 부모 컴포넌트로 수정된 목표 전달
      modalInstance.hide() // 모달 닫기
    } else {
      console.error('Failed to update goal:', response.data)
    }
  } catch (error) {
    console.error('Error updating goal:', error)
  }
}

// 목표 삭제 함수 (DELETE 요청)
const deleteGoal = async () => {
  if (goalDetail.value.index === null || !goalDetail.value.category) {
    console.error('Invalid index or category, cannot delete goal.')
    alert('새로고침 후 다시 시도해주세요.')
    return
  }

  try {
    console.log('Attempting to delete goal with index:', goalDetail.value.index)

    const response = await Instance({
      method: 'delete',
      url: '/goal/delete',
      data: {
        index: goalDetail.value.index,
        category: goalDetail.value.category
      }
    })

    if (response.data && response.data.success) {
      emit('goalDeleted')
      modalInstance.hide()
    } else {
      console.error('Failed to delete goal:', response.data)
      alert('새로고침 후 다시 시도해주세요.')
    }
  } catch (error) {
    console.error('Error deleting goal:', error)
  }
}

defineExpose({ show })
</script>

<style scoped>
.modal-header {
  font-weight: bold;
}

.input-group-text {
  border: none;
  background: transparent;
}

.modal-footer .btn-pink {
  background-color: #ff007f;
}

.modal-footer .btn {
  border-radius: 6px;
  padding: 8px 16px;
}
</style>
