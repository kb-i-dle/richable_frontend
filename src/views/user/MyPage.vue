<template>
  <div class="mypage-container">
    <div class="top-section d-flex justify-content-between">
      <!-- 프로필 섹션 -->
      <section class="profile-section box">
        <h5 class="bold-text text-left">나의 프로필</h5>
        <div class="profile">
          <img :src="profileImageUrl" alt="프로필 이미지" />
          <h2 class="mt-3">{{ userProfile.name }}</h2>
          <button class="btn btn-danger mt-3" @click="openProfileModal" style="background-color: #FF0062; border-color: #FF0062;">프로필 수정</button>
        </div>
      </section>

      <!-- API 관리 섹션 -->
      <section class="api-management box text-left">
        <h4 class="bold-text">API 관리</h4><br>
        <ul class="list-unstyled">
          <li class="d-flex align-items-center">
            <span>은행 api key</span>
            <span class="ms-3">{{ apiKeys.bankApiKey }}</span>
            <button class="btn btn-link ms-auto" @click="openApiKeyInput('bank')">➡️</button>
          </li>
          <li class="d-flex align-items-center">
            <span>증권 api key</span>
            <span class="ms-3">{{ apiKeys.stockApiKey }}</span>
            <button class="btn btn-link ms-auto" @click="openApiKeyInput('stock')">➡️</button>
          </li>
          <li class="d-flex align-items-center">
            <span>암호화폐 api key</span>
            <span class="ms-3">{{ apiKeys.cryptoApiKey }}</span>
            <button class="btn btn-link ms-auto" @click="openApiKeyInput('crypto')">➡️</button>
          </li>
        </ul>

        <!-- API 키 입력 -->
        <div v-if="showApiKeyInput" class="mt-3">
          <input type="text" class="form-control mb-2" :placeholder="currentApiKeyLabel + ' API 키 입력'" v-model="newApiKey" />
          <button class="btn btn-primary" @click="saveApiKey">저장</button>
        </div>
      </section>
    </div>

    <!-- 뱃지 섹션 -->
    <section class="badge-section box mt-5">
      <div class="d-flex justify-content-between align-items-center">
        <h1 class="badge-title bold-text">나의 뱃지</h1>
        <!-- 전체보기 클릭 시 모달 오픈 -->
        <a href="#" class="text-end" @click.prevent="openBadgeModal" style="color: #FF0062;">전체보기</a>
      </div>

      <div class="badges d-flex justify-content mt-5">
        <div class="representative-badge text-center">
          <h6 class="bold-text">대표 뱃지</h6><br>
          <div v-if="selectedBadge" class="text-center">
            <p>{{ selectedBadge.name }}</p>
            <img :src="selectedBadge.imageUrl" alt="대표 뱃지 이미지" class="badge-image" />
            <label class="d-flex align-items-center justify-content-center mt-2">
              <input type="checkbox" v-model="selectedBadge.isSelected" @change="toggleBadgeSelection(selectedBadge)">
              <p class="mb-0 ms-2">대표 뱃지 등록</p>
            </label>
          </div>
          <div v-else>
            <p>뱃지</p>
          </div>
        </div>

        <div class="d-flex flex-column align-items-start">
          <h6 class="bold-text">내가 획득한 뱃지</h6><br>
          <div class="d-flex justify-content-start">
            <div v-for="(badge, index) in badges" :key="badge.id" class="badge-item text-center" @click="selectBadge(badge)">
              <p class="badge-name">{{ badge.name }}</p>
              <img :src="badge.imageUrl" alt="뱃지 이미지" class="badge-image" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- UserAllBadgesModal 모달 삽입 -->
    <UserAllBadgesModal ref="badgeModal" />

    <!-- 회원 탈퇴 확인 모달 -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">회원 탈퇴 확인</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>정말로 회원 탈퇴하시겠습니까?</p><br>
            <p>모든 정보가 삭제됩니다.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelDeletion">아니오</button>
            <button type="button" class="btn btn-danger" @click="deleteAccount">예</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="profileModalLabel">회원 정보 수정</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="profile-edit text-center">
            <img :src="profileImageUrl" alt="프로필 이미지" class="img-thumbnail" style="width: 400px; height: 400px;" /><br>
            <button class="btn btn-outline-secondary mt-1 bold-text" @click="triggerFileUpload">프로필 이미지 변경</button>
            <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display: none" />

            <div class="form-group mt-2 d-flex align-items-center">
              <label for="nickname" class="me-2" style="white-space: nowrap;">닉네임</label>
              <input type="text" class="form-control" id="nickname" v-model="userProfile.name" style="width: auto; flex-grow: 1;" />
            </div>
            <div class="form-group mt-2 d-flex align-items-center">
              <label for="email">E-Mail</label>
              <input type="email" class="form-control" id="email" v-model="userProfile.email" style="width: auto; flex-grow: 1;" />
            </div>
            <div class="form-group mt-2 d-flex align-items-center">
              <label for="birthYear">생년월일</label>
              <input type="number" class="form-control" id="birthYear" v-model="userProfile.birthYear" style="width: auto; flex-grow: 1;" />
            </div>
            <div class="form-group mt-2 d-flex align-items-center">
              <label for="gender">성별</label>
              <input class="form-control" id="gender" :value="genderLabel" style="width: auto;flex-grow: 1;" readonly>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" style="position: absolute; left: 10px; background-color: #FF0062;" @click="openDeleteModal">회원 탈퇴</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-danger" @click="saveProfile" style="background-color: #FF0062; border-color: #FF0062;">수정</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import noprofileImage from '@/assets/images/noprofile1.png'; // 이미지 import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useBadgeStore } from '@/stores/mypage/badge.js';
import UserAllBadgesModal from '@/components/modal/user/UserAllBadgesModal.vue';

const badgeStore = useBadgeStore();
const badges = computed(() => badgeStore.badges);

// 모달 관리
const openBadgeModal = () => {
  const badgeModal = new bootstrap.Modal(document.getElementById('badgeModal'));
  badgeModal.show();
};

// JWT 토큰을 localStorage에서 가져오기
const token = localStorage.getItem('authToken');

// 프로필 및 API 키 관리용 변수
const userProfile = ref({
  id: '',  // ID 값 추가
  name: '',
  email: '',
  birthYear: '',
  gender: '',
  profileImage: noprofileImage, // 기본 프로필 이미지 설정
});

const profileImageUrl = ref(userProfile.value.profileImage);
const showApiKeyInput = ref(false);
const currentApiKeyLabel = ref('');
const newApiKey = ref('');

// API 키 입력 창 토글
const toggleApiKeyInput = () => {
  showApiKeyInput.value = !showApiKeyInput.value;
};

const openApiKeyInput = (type) => {
  currentApiKeyLabel.value = type === 'bank' ? '은행' :
                             type === 'stock' ? '증권' :
                             type === 'crypto' ? '암호화폐' : '동의';
  showApiKeyInput.value = true;
};

const saveApiKey = () => {
  if (currentApiKeyLabel.value === '은행') {
    apiKeys.value.bankApiKey = newApiKey.value;
  } else if (currentApiKeyLabel.value === '증권') {
    apiKeys.value.stockApiKey = newApiKey.value;
  } else if (currentApiKeyLabel.value === '암호화폐') {
    apiKeys.value.cryptoApiKey = newApiKey.value;
  }
  showApiKeyInput.value = false;
};

// 성별 표시용 computed
const genderLabel = computed(() => userProfile.value.gender === 'M' ? '남자' :
                                           userProfile.value.gender === 'F' ? '여자' : '성별 정보 없음');

// Axios 인터셉터 설정 (JWT 토큰 포함)
axios.interceptors.request.use(
  (config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 프로필 이미지 업로드 트리거
const triggerFileUpload = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.click();

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => profileImageUrl.value = e.target.result;
      reader.readAsDataURL(file);
    }
  });
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/member"

// 사용자 ID를 userProfile에서 가져오는지 확인합니다.
const deleteAccount = () => {
  const userId = userProfile.value.name;
  console.log("닉네임:", userId); // 로그로 확인
  if (!userId) {
    alert("사용자 ID가 없습니다.");
    return;
  }

  axios
    .delete(`${BASE_URL}/delete/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('authToken');
      window.location.href = '/user/SignIn';
    })
    .catch((error) => {
      console.error('회원 탈퇴 중 에러 발생:', error);
      alert('회원 탈퇴에 실패했습니다.');
    });
};

// "아니오" 버튼 클릭 시 프로필 수정 모달 다시 열기
const cancelDeletion = () => {
  const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
  if (deleteModal) deleteModal.hide();

  const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
  profileModal.show();
};

// 모달 오픈 함수들
const openProfileModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('profileModal'));
  modal.show();
};

const openDeleteModal = () => {
  const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
  if (profileModal) profileModal.hide(); // 프로필 모달 닫기

  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  deleteModal.show(); // 회원 탈퇴 모달 열기
};

// API 키 및 사용자 정보 초기화
const apiKeys = ref({
  bankApiKey: '',
  stockApiKey: '',
  cryptoApiKey: '',
  consentStatus: '',
});

const selectedBadgeId = ref(null);

const selectedBadge = computed(() => badges.value.length > 0 ? badges.value.find(badge => badge.id === selectedBadgeId.value) : null);

const selectBadge = (badge) => selectedBadgeId.value = badge.id;

const toggleBadgeSelection = (badge) => {
  if (!badge.isSelected) selectedBadgeId.value = null;
};

// 사용자 정보 로드
onMounted(() => {
  axios.get(`${BASE_URL}/info`)
    .then((response) => {
      const responseData = response.data.response.data?.data || {};
      userProfile.value = {
        id: responseData.id || '', // ID 값 추가
        name: responseData.nickname || '이름 없음',
        email: responseData.email || '이메일 없음',
        birthYear: responseData.birthYear || '',
        gender: responseData.gender || '',
        profileImage: responseData.img || noprofileImage, // 기본 이미지 설정
      };
      profileImageUrl.value = userProfile.value.profileImage;

      if (responseData.api) {
        apiKeys.value = {
          bankApiKey: responseData.api.bank || 'API 키 없음',
          stockApiKey: responseData.api.stock?.base || 'API 키 없음',
          cryptoApiKey: responseData.api.coin?.base || 'API 키 없음',
          consentStatus: responseData.certification ? '동의함' : '동의 안함',
        };
      } else {
        apiKeys.value = {
          bankApiKey: 'API 키 없음',
          stockApiKey: 'API 키 없음',
          cryptoApiKey: 'API 키 없음',
          consentStatus: '동의 안함',
        };
      }
    })
    .catch((error) => console.error('프로필 정보와 API 키를 가져오는 중 오류 발생:', error));
    badgeStore.fetchBadges();
});
</script>


<style scoped>
/* 기본 스타일 (웹) */
.mypage-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.top-section {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.box {
  background-color: #f9f9f9;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.profile img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 20px;
  border: 2px solid #FF0062;
}

.api-management {
  text-align: left; 
}

.api-management ul {
  list-style-type: none;
  padding: 0;
}

.api-management li {
  justify-content: flex-start; 
}

.badge-section {
  position: relative;
  margin-top: 40px;
}

.badge-title {
  font-weight: bold;
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
}

.badges {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}

.bold-text {
  font-weight: bold;
}

.representative-badge {
  margin-right: 50px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}

.badge-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.badge-item .badge-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-body .profile-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}

a.text-end {
  position: absolute;
  top: 10px;
  right: 10px;
}

.bold-text {
  font-weight: bold;
}

/* 태블릿 환경 */
@media (max-width: 1023px) and (min-width: 768px) {
  .mypage-container {
    padding: 15px;
    max-width: 800px;
  }

  .top-section {
    flex-direction: column;
    gap: 20px;
  }

  .box {
    padding: 30px;
  }

  .profile img {
    width: 120px;
    height: 120px;
  }

  .badge-title {
    font-size: 18px;
  }

  .badges {
    flex-direction: column;
    align-items: center;
  }

  .representative-badge {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .badge-item {
    width: 120px;
  }

  .badge-image {
    width: 100px;
    height: 100px;
  }
}

/* 모바일 환경 */
@media (max-width: 767px) {
  .mypage-container {
    padding: 10px;
    max-width: 100%;
  }

  .top-section {
    flex-direction: column;
    gap: 20px;
  }

  .box {
    padding: 20px;
    border-radius: 5px;
  }

  .profile img {
    width: 100px;
    height: 100px;
  }

  .profile h2 {
    font-size: 18px;
  }

  .badge-title {
    font-size: 16px;
  }

  .badges {
    flex-direction: column;
    align-items: center;
  }

  .representative-badge {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .badge-item {
    width: 100px;
  }

  .badge-image {
    width: 80px;
    height: 80px;
  }

  .modal-body .profile-image img {
    width: 100px;
    height: 100px;
  }

  .modal-footer .btn {
    width: 100%;
  }

  .btn {
    font-size: 14px;
  }
}
</style>

