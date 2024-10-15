<template>
    <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true"
        ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">금융 자산 항목 수정</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
                    <!-- 분류 선택 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetType" class="form-label"
                            style="font-weight: bold; width: 70px; letter-spacing: 13px; padding-top: 8px;">분류</label>
                        <select class=" form-select" id="assetType">
                            <option value="saving">예/적금</option>
                            <option value="stock">주식</option>
                            <option value="bond">채권</option>
                            <option value="coin">코인</option>
                            <option value="cash">현금</option>
                        </select>
                    </div>
                    <!-- 자산량 입력 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetAmount" class="form-label"
                            style="font-weight: bold; width: 70px; padding-top: 8px;">자산량</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="assetAmount" value="1,000,000">
                            <span class="input-group-text">원</span>
                        </div>
                    </div>
                    <div class="mb-3" style="padding-top: 14px; color : #6C757D; font-size: 14px;">
                        <div>
                            자산 항목을 다음과 같이 수정하시겠습니까?
                        </div>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn">
                        <font-awesome-icon icon="trash-can" />
                    </button>
                    <div>
                        <button type="button" class="btn" data-bs-dismiss="modal"
                            style="background-color: white; border: 1px solid #020202; color : #020202; font-weight: bold; margin-right: 12px; width: 62px;">취소</button>
                        <button type="button" class="btn text-white"
                            style="background-color: #FF0062; width: 62px;">수정</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import { Modal } from 'bootstrap';

const modal = ref(null);
let modalInstance = null;

// 모달 열기 함수
const show = () => {
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static', // 명시적으로 backdrop 설정
      keyboard: true, // 키보드 이벤트 처리 허용
    });
    modalInstance.show(); // 모달 표시
  } else if (modalInstance) {
    modalInstance.show(); // 이미 초기화된 경우 다시 표시
  }
};

// 컴포넌트가 마운트될 때 모달 초기화
onMounted(() => {
  // setTimeout을 사용하여 DOM이 완전히 준비된 후 모달 초기화
  setTimeout(() => {
    if (modal.value && !modalInstance) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true,
      });
    }
  }, 500); // 500ms 정도 딜레이를 줌
});

defineExpose({ show });
</script>

<style scoped>
/* 커스텀 스타일 추가 */
.btn-pink {
    background-color: #ff007f;
}
</style>
