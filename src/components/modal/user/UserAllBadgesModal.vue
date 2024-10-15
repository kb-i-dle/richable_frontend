<template>
  <div class="modal fade" id="badgeModal" tabindex="-1" aria-labelledby="badgeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="badgeModalLabel">모든 뱃지</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-wrap justify-content-center">
            <div v-for="(badge, index) in badges" :key="index" class="badge-item text-center m-3">
              <img :src="badge.img" :alt="badge.name" class="badge-image" />
              <p class="badge-name">{{ badge.name }}</p>
              <p v-if="badge.having" class="badge-status" style="color: green;">보유</p>
              <p v-else class="badge-status" style="color: red;">미보유</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 뱃지 데이터 저장 변수
const badges = ref([]);

// API 호출 후 데이터 가져오기
const fetchBadges = async () => {
  try {
    const response = await axios.get('http://localhost:8080/member/badge/all/multiearlyer');
    badges.value = response.data.response.data;
  } catch (error) {
    console.error('Error fetching badges:', error);
  }
};

// 컴포넌트가 마운트되면 API 호출
onMounted(() => {
  fetchBadges();
});
</script>

<style scoped>
.badge-item {
  width: 120px;
}

.badge-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.badge-name {
  font-weight: bold;
  margin-top: 10px;
}

.badge-status {
  margin-top: 5px;
}
</style>

  
  <style scoped>
  .badge-item {
    width: 120px;
  }
  
  .badge-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
  
  .badge-name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  </style>
  