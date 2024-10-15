<template>
  <div id="singin" class="login-container">
    <img class="title" src="../../assets/images/navbar-full-rich.png" />
    <form @submit.prevent="login" method="POST">
      <div class="mb-3 text-start">
        <label for="id" class="form-label">아이디</label>
        <input
          type="text"
          v-model="id"
          class="form-control"
          id="id"
          placeholder="아이디를 입력해주세요"
          required
        />
      </div>
      <div class="mb-3 text-start position-relative">
        <label for="password" class="form-label">비밀번호</label>
        <div class="password-input-wrapper position-relative">
    <input
      :type="showPassword ? 'text' : 'password'"
      v-model="password"
      class="form-control"
      id="password"
      placeholder="비밀번호를 입력해주세요"
      required
    />
    <span
      @click="togglePassword"
      class="position-absolute top-50 end-0 translate-middle-y pe-2"
      style="cursor: pointer"
      :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'"
    >
      <font-awesome-icon 
        :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" 
      />
    </span>
  </div>
      </div>
      <button type="submit" class="login-btn" :disabled="!id || !password">로그인</button>
    </form>

    <div class="d-flex justify-content-center mt-3">
      <router-link to="/user/findid" class="join-link">아이디 찾기</router-link>
      <span class="mx-2"> | </span>
      <router-link to="/user/findpassword" class="join-link">비밀번호 찾기</router-link>
    </div>
    <div class="or-divider">또는</div> 

    <div class="sns-buttons">
      <img src="../../assets/images/naver.png" alt="Naver" @click="naverLogin" />
    </div>

    <div class="mt-3">
      <span>Richable이 처음이에요?</span>
      <router-link to="/user/signup" class="join-link">가입하기</router-link>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import axiosinstance from '@/AxiosInstance';

const id = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
const setAuthToken = (key, value) => new Promise((resolve) => {
  localStorage.setItem(key,value);
  resolve();
})

const naverLogin = async () => {
  try {
    const response = await axiosinstance.get(`/member/naverlogin`)
    console.log('Naver login response:', response.data)
    if (response.data.success && response.data.response?.data?.redirectUrl) {
      localStorage.setItem('naverState', response.data.response.data.state)
      window.location.href = response.data.response.data.redirectUrl
    } else {
      console.error('Invalid response format:', response.data)
      alert('네이버 로그인을 시작하는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    }
  } catch (error) {
    console.error('Naver login initiation failed:', error)
    alert(`네이버 로그인 초기화 중 오류: ${error.response?.data?.error || error.message}`)
  }
}

const login = async () => {
  if (!id.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요')
    return
  }
  try {
    const response = await axiosinstance.post(`/member/login` , {
      id: id.value,
      password: password.value
    });
    
    
    // 응답 데이터 구조에 따라 토큰 추출
    if (response.data.success && response.data.response?.data?.token) {
      const token = response.data.response.data.token;
      console.log('Token received:', token);
      // 로그인 성공 시 처리
      alert('Login successful!');
      await setAuthToken("authToken", token).then(() => router.push({ name: 'assetAnalysis' }));
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please check your credentials.');
  }
}
onMounted(() => {
  // 페이지 로드 시 저장된 토큰이 있다면 axios 헤더에 설정
  const token = localStorage.getItem('authToken')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
})
</script>

<style scoped>
body {
  width: 500px;
  font-family: 'pretendard', sans-serif;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.title {
  width: 40%;
  height: 8%;
  padding: 0.5rem;
}
.join-link {
  font-size: 0.9rem;
  color: #777777;
  font-weight: 500;
  text-decoration: underline; /* 밑줄 추가 */
}
.form-label {
  padding: 0.5rem;
}

.login-container {
  width: 500px;
  /* max-width: 400px; */
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 5% auto;
}
.login-btn {
  border: none;
  color: white;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  background-color: #ff0062;
}
.or-divider {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  text-align: center;
}
.or-divider::before,
.or-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
}
.or-divider::before {
  margin-right: 0.25em;
}
.or-divider::after {
  margin-left: 0.25em;
}
.sns-buttons img {
  width: 40px;
  margin: 0 5px;
}
.form-control:focus {
  border-color: #ff0062; /* 원하는 테두리 색상 */
  box-shadow: none;
  outline: none; /* 기본 아웃라인 제거 */
}
.naver-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}
#naver_id_login {
  display: inline-block;
  vertical-align: middle;
}

::placeholder {
  color: #999999; /* 원하는 색상으로 변경 */
  opacity: 1; /* 투명도 조절 */
}
</style>