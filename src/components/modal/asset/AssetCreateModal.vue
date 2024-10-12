<template>
  <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">금융 자산 등록</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
          <!-- 분류 선택 -->
          <div class="mb-3" style="display: flex;">
            <label for="assetType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">분류</label>
            <select class="form-select" id="assetType" v-model="selectedAssetType">
              <option value="stock">주식</option>
              <option value="bond">채권</option>
              <option value="coin">코인</option>
              <option value="cash">현금</option>
            </select>
          </div>

          <!-- 자산 이름 선택 (주식, 채권, 코인일 때만 표시) -->
          <div v-if="selectedAssetType == 'coin'" class="mb-3" style="display: flex;">
            <label for="assetName" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">이름</label>
            <select class="form-select" id="assetName" v-model="selectedAssetName">
              <option v-for="item in coinList" :key="item.idex" :value="item">{{ item.coinName }}</option>
            </select>
          </div>
             
          <!-- 자산 이름 선택 (주식, 채권, 코인일 때만 표시) -->
          <div v-if="selectedAssetType == 'stock'" class="mb-3" style="display: flex;">
            <label for="assetName" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">이름</label>
            <select class="form-select" id="assetName" v-model="selectedAssetName">
              <option v-for="item in stockList" :key="item.id" :value="item">{{ item.krStockNm }}</option>
            </select>
          </div>

          <!-- 자산 이름 선택 (주식, 채권, 코인일 때만 표시) -->
          <div v-if="selectedAssetType == 'bond'" class="mb-3" style="display: flex;">
            <label for="assetName" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">이름</label>
            <select class="form-select" id="assetName" v-model="selectedAssetName">
              <option v-for="item in bondList" :key="item.id" :value="item">{{ item.isinCdNm }}</option>
            </select>
          </div>

          <!-- 자산 가격 입력 (수정 가능) -->
          <div class="mb-3" style="display: flex;">
            <label for="assetAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">평단가</label>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                id="assetAmount" 
                :placeholder="selectedAssetType !== 'cash' ? '자동 입력' : '자산 가격 입력'" 
                v-model="selectedAssetPrice"
              />
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 추가 자산량 입력 (주식, 채권, 코인 선택 시에만 표시) -->
          <div v-if="showAdditionalInput" class="mb-3" style="display: flex;">
            <label for="additionalAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">수량</label>
            <div class="input-group">
              <input type="text" class="form-control" id="additionalAmount" placeholder="추가하실 수량을 입력해주세요" v-model="additionalAmount" />
              <span class="input-group-text">개</span>
            </div>
          </div>

          <!-- 총액 계산 -->
          <div  v-if="selectedAssetType !== 'cash'" class="mb-3" style="display: flex;">
            <label for="assetTotalAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">총액</label>
            <div class="input-group">
              <input 
                type="text" 
                id="assetTotalAmount" 
                class="form-control" 
                :value="formattedTotalAmount"
                disabled
              />
              <span class="input-group-text">원</span>
            </div>
          </div>

          <div class="mb-3" style="padding-top: 14px; color: #6C757D; font-size: 14px;">
            <div>자산 항목을 다음과 같이 등록하시겠습니까?</div>
          </div>
        </div>
        <div class="modal-footer d-flex">
          <div>
            <button type="button" class="btn" data-bs-dismiss="modal"
              style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px; width: 62px;">
              취소
            </button>
            <button type="button" class="btn text-white" style="background-color: #FF0062; width: 62px;" @click="submitData">등록</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';  // 여기서 watch를 추가
import { Modal } from 'bootstrap';
import axiosInstance from '@/AxiosInstance';

// 상태 관리
const modal = ref(null);
let modalInstance = null;

const stockList = ref([]);
const coinList = ref([]);
const bondList = ref([]);
const selectedStock = ref(null);
const selectedCoin = ref(null);
const selectedBond = ref(null);
const selectedAssetName = ref(null);
const customAssetName = ref('');
const selectedAssetType = ref('stock');
const selectedAssetPrice = ref('');
const additionalAmount = ref('');

// 총액을 계산하고 포맷팅하는 함수
const formattedTotalAmount = computed(() => {
  const total = selectedAssetPrice.value * additionalAmount.value || 0;
  return total.toLocaleString(); // 천 단위 쉼표 추가
});



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

// 추가 입력 필드 표시 여부
const showAdditionalInput = computed(() => {
  return selectedAssetType.value === 'stock' || selectedAssetType.value === 'bond' || selectedAssetType.value === 'coin';
});

// 선택된 자산의 가격을 자동으로 반영
watch(selectedAssetName, (newValue) => {
  if (selectedAssetType.value === 'bond') {
    selectedAssetPrice.value = newValue?.price || ''; // 채권의 가격 필드 확인
  } else if (selectedAssetType.value === 'stock') {
    selectedAssetPrice.value = newValue?.price || ''; // 주식의 price 필드 확인
  } else if (selectedAssetType.value === 'coin') {
    selectedAssetPrice.value = newValue?.closingPrice || ''; // 코인의 price 필드 확인
  } else {
    selectedAssetPrice.value = ''; // 현금일 때는 수동 입력
  }
});

// 데이터 가져오기 함수
const fetchData = async () => {
  try {
    const [stockRes, coinRes, bondRes] = await Promise.all([
      axiosInstance.get('/finance/product/stock'),
      axiosInstance.get('/finance/product/coin'),
      axiosInstance.get('/finance/product/bond'),
    ]);

    stockList.value = stockRes?.data?.response?.data || [];
    coinList.value = coinRes?.data?.response?.data || [];
    bondList.value = bondRes?.data?.response?.data || [];
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
  }
};

// 컴포넌트가 마운트될 때 데이터 가져오기 및 모달 초기화
onMounted(() => {
  fetchData();

  setTimeout(() => {
    if (modal.value && !modalInstance) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true,
      });
    }
  }, 500);
});

// 자산 데이터를 서버로 전송하는 함수
const submitData = async () => {
  try {
    let payload = {};
    
    if (selectedAssetType.value === 'stock') {
      payload = {
        pdno: selectedAssetName.value?.id || 0,
        prdtName: selectedAssetName.value?.krStockNm || '',
        hldgQty: additionalAmount.value,
        avgBuyPrice: selectedAssetPrice.value
      };
    } else if (selectedAssetType.value === 'bond') {
      payload = {
        name: selectedAssetName.value?.isinCdNm || '',
        cnt: additionalAmount.value,
        price: selectedAssetPrice.value
      };
    } else if (selectedAssetType.value === 'coin') {
      payload = {
        currency: selectedAssetName.value?.coinName || '',
        balance: additionalAmount.value,
        avgBuyPrice: selectedAssetPrice.value
      };
    } 
    

    // 데이터 전송 (Axios 사용)
    const response = await axiosInstance.post(`/asset/${selectedAssetType.value}/add`, payload);
    console.log('등록 성공:', response.data);
    // 성공시 모달 닫기나 다른 로직 실행
    
  } catch (error) {
    console.error('데이터 전송 중 오류 발생:', error);
  }
};

defineExpose({ show });
</script>

<style scoped>
.btn-pink {
  background-color: #ff007f;
}
</style>
