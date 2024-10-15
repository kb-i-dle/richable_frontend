<template>
    <div>
      <p>네이버 로그인을 처리 중입니다...</p>
      <p v-if="error">오류 발생: {{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const error = ref(null);
  
  const setAuthToken = (key, value) => new Promise((resolve) => {
  localStorage.setItem(key,value);
  resolve();
  })


  const handleNaverCallback = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
  
    console.log('Received token:', token); // 디버그 로그
  
    if (token) {
      try {
        // JWT 토큰을 세션 스토리지에 저장
        await setAuthToken('authToken', token);
        //sessionStorage.setItem('authToken', token);
  
        // Axios의 기본 인증 헤더 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
        console.log('Token saved and Axios header set'); // 디버그 로그
  
        // 사용자 정보 요청 (선택적)
        //const userInfoResponse = await axios.get('/user/info');
        //console.log('User info:', userInfoResponse.data); // 디버그 로그
  
        // 리다이렉트할 페이지로 이동
        router.push({ name: 'assetAnalysis' });
      } catch (e) {
        console.error('Error in handleNaverCallback:', e);
        error.value = e.message;
      }
    } else {
      console.error('Token not found in query parameters');
      error.value = '토큰을 찾을 수 없습니다.';
    }
  };
  
  onMounted(() => {
    handleNaverCallback();
  });
  </script>