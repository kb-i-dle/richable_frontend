<template>
  <div class="container">
    <div v-if="!isAuthenticated">
      <h1>관리자 페이지 로그인</h1>
      <form @submit.prevent="login">
        <div class="mb-3 text-start">
          <label for="id" class="form-label">아이디</label>
          <input
            type="text"
            v-model="id"
            class="form-control"
            id="id"
            placeholder="이메일 주소를 입력해주세요"
            required
          />
        </div>
        <div class="mb-3 text-start position-relative">
          <label for="password" class="form-label">비밀번호</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-control"
              id="password"
              placeholder="비밀번호를 입력해주세요"
              required
            />
            <button
              type="button"
              class="btn btn-outline-secondary password-toggle pw-btn"
              @click="togglePassword"
            >
              {{ showPassword ? 'off' : 'on' }}
            </button>
          </div>
        </div>
        <button type="submit" class="login-btn" :disabled="!id || !password">로그인</button>
      </form>
    </div>

    <div v-else>
      <h1>관리자 페이지</h1>
      <div>
        <p>접속 시간 : {{ currentTime }}</p>
      </div>
      <div>
        <button class="update-btn" @click="updateStock">주식 가격 update</button>
        <p v-if="stockUpdateTime" class="update-time">최근 업데이트: {{ stockUpdateTime }}</p>
      </div>
      <div>
        <button class="update-btn" @click="updateCoin">코인 가격 update</button>
        <p v-if="coinUpdateTime" class="update-time">최근 업데이트: {{ coinUpdateTime }}</p>
      </div>
      <div>
        <button class="update-btn">베지 추가</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const currentTime = ref('')
const stockUpdateTime = ref('')
const coinUpdateTime = ref('')
const checkError = ref('')
const isAuthenticated = ref(false)

const id = ref('')
const password = ref('')
const showPassword = ref(false)

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const login = async () => {
  if (!id.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요')
    return
  }

  try {
    const response = await axios.post(`${BASE_URL}/member/login`, {
      id: id.value,
      password: password.value
    })
    const token = response.data.response.data.token
    console.log('Token received:', token)

    if ((response.status === 200) & (id.value == 'admin')) {
      alert('Login successful!')
      isAuthenticated.value = true
      localStorage.setItem('authToken', token)
    } else {
      alert('권한 없음')
    }
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials.')
  }
}

const updateTime = () => {
  const now = new Date()
  return now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    hour12: false
  })
}

const updateStock = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/master/update/stock`)
    stockUpdateTime.value = updateTime()
    alert('주식 가격 업데이트 성공!')
  } catch (error) {
    console.error('주식 가격 업데이트 오류:', error)
    checkError.value = '주식 가격 업데이트에 실패했습니다. 다시 시도하세요.'
  }
}

const updateCoin = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/master/update/coin`)
    coinUpdateTime.value = updateTime()
    alert('코인 가격 업데이트 성공!')
  } catch (error) {
    console.error('코인 가격 업데이트 오류:', error)
    checkError.value = '코인 가격 업데이트에 실패했습니다. 다시 시도하세요.'
  }
}

onMounted(() => {
  currentTime.value = updateTime()
  setInterval(() => {
    currentTime.value = updateTime()
  }, 1000)
})
</script>

<style>
.container {
  width: 500px;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 5% auto;
}
.update-btn {
  border: none;
  color: white;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  background-color: #ff0062;
}
.update-time {
  font-size: 0.8em;
  color: #666;
  margin-top: 0.5rem;
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

.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}
.input-group > .form-control {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
}
/* .pw-btn {
  border: none;
  color: white;
  border-radius: 5px;
} */
</style>
