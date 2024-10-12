<template>
  <div
    class="modal fade"
    id="editAssetModal"
    tabindex="-1"
    aria-labelledby="editAssetLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold">
            현물 자산 항목 수정
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px">
          <!-- 분류 선택 -->
          <div class="mb-3" style="display: flex">
            <label
              for="assetType"
              class="form-label"
              style="font-weight: bold; width: 70px; letter-spacing: 13px; padding-top: 8px"
              >분류</label
            >
            <select class="form-select" id="assetType" v-model="editedAsset.category" disabled>
              <option value="자동차">자동차</option>
              <option value="전자기기">전자기기</option>
              <option value="브랜드">브랜드</option>
              <option value="명품">명품</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <!-- 자산명 입력 -->
          <div class="mb-3" style="display: flex">
            <label
              for="assetName"
              class="form-label"
              style="font-weight: bold; width: 70px; padding-top: 8px"
              >자산명</label
            >
            <div class="input-group">
              <input type="text" class="form-control" id="assetName" v-model="editedAsset.name" />
            </div>
          </div>
          <!-- 자산량 입력 -->
          <div class="mb-3" style="display: flex">
            <label
              for="assetAmount"
              class="form-label"
              style="font-weight: bold; width: 70px; padding-top: 8px"
              >자산량</label
            >
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                id="assetAmount"
                v-model="editedAsset.price"
              />
              <span class="input-group-text">원</span>
            </div>
          </div>
          <div class="mb-3" style="padding-top: 14px; color: #6c757d; font-size: 14px">
            <div>자산 항목을 다음과 같이 수정하시겠습니까?</div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn" @click="deleteAsset">
            <font-awesome-icon icon="trash-can" />
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
                width: 62px;
              "
            >
              취소
            </button>
            <button
              type="button"
              class="btn text-white"
              style="background-color: #ff0062; width: 62px"
              @click="updateAsset"
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
import { ref } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import axiosInstance from '@/AxiosInstance';

// 이벤트를 상위 컴포넌트로 전달하기 위한 emit 정의
const emit = defineEmits(['update-asset', 'delete-asset'])

const modal = ref(null)
let modalInstance = null
const originalAsset = ref(null)
const editedAsset = ref({
  index: 0,
  category: '',
  name: '',
  price: 0
})

// 모달 열기 함수 (선택된 자산 데이터를 받음)
const show = (asset) => {
  const { addDate, ...rest } = asset
  originalAsset.value = { ...rest } // 원본 데이터를 originalAsset에 저장
  editedAsset.value = { ...rest } // 선택한 자산 데이터를 editedAsset에 복사하여 입력 필드에 바인딩
  console.log(editedAsset.value)
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static', // 명시적으로 backdrop 설정
      keyboard: true // 키보드 이벤트 처리 허용
    })
    modalInstance.show() // 모달 표시
  } else if (modalInstance) {
    modalInstance.show() // 이미 초기화된 경우 다시 표시
  }
}

// update 데이터 정의
const updateData = ref({
  index: 0,
  name: '',
  price: 0
})

// 현물 자산 수정 API 호출 함수
const fetchSpotUpdate = async (updateData) => {
  try {
    const response = await axiosInstance.put('/finance/spot/update', updateData);

    // 수정 성공 여부 반환
    return response.data.success;
  } catch (error) {
    console.error('현물 자산 수정을 실패하였습니다. ', error);
    return false; // 실패 시 false 반환
  }
};

// 자산 수정 함수
const updateAsset = async () => {
  // 원본 데이터를 기준으로 변경 여부 확인 (원본 데이터를 비교 대상)
  const isChanged = Object.keys(editedAsset.value).some((key) => {
    // category, id 같은 필드를 제외하고 비교
    if (key === 'id' || key === 'category') {
      return false;
    }
    // 원본 데이터 originalAsset과 현재 editedAsset을 비교
    return editedAsset.value[key] !== originalAsset.value[key];
  });

  // 변경된 값이 없는 경우 예외 처리
  if (!isChanged) {
    alert('변경된 값이 없습니다.');
    return;
  }

  // 수정 확인 알림
  const isConfirmed = window.confirm('자산 항목을 수정하시겠습니까?');

  // 확인을 누른 경우에만 API 호출
  if (isConfirmed) {
    // updateData 생성 (category 제외)
    const { category, ...rest } = editedAsset.value;
    updateData.value = { ...rest };

    // API 호출 후 수정 성공 여부 확인
    const isSuccess = await fetchSpotUpdate(updateData.value);

    if (isSuccess) {
      // 수정 성공 시 상위 컴포넌트로 수정된 자산 데이터 전달
      emit('update-asset', { ...editedAsset.value });
      // 모달 닫기
      modalInstance.hide();
    } else {
      console.error('자산 수정이 실패했습니다.');
    }
  } else {
    console.log('자산 수정이 취소되었습니다.');
  }
};


// 현물 자산 삭제 API 호출 함수
const fetchSpotDelete = async (assetId) => {
  try {
    const response = await axiosInstance.delete(`/finance/spot/delete/${assetId}`);

    // 삭제 성공 여부 반환
    return response.data.success;
  } catch (error) {
    console.error('자산 삭제에 실패하였습니다.', error);
    return false; // 실패 시 false 반환
  }
};

// 자산 삭제 함수
const deleteAsset = async () => {
  // 삭제 확인 알림
  const isConfirmed = window.confirm('이 자산을 삭제하시겠습니까?');

  // 확인을 누른 경우에만 삭제 처리
  if (isConfirmed) {
    // API 호출
    const isSuccess = await fetchSpotDelete(editedAsset.value.index);

    if (isSuccess) {
      // 삭제된 자산의 id를 상위 컴포넌트로 전달
      emit('delete-asset', { index: editedAsset.value.index });

      // 삭제 후 모달 닫기
      modalInstance.hide();
    } else {
      console.error('삭제에 실패했습니다.');
    }
  } else {
    console.log('자산 삭제가 취소되었습니다.');
  }
};

// 모달 표시 함수 내보내기
defineExpose({ show })
</script>

<style scoped>
/* 커스텀 스타일 추가 */
.btn-pink {
  background-color: #ff007f;
}
</style>
