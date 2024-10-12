<template>
  <div id="findid" class="find-id-container">
    <h2 class="text-center mb-4" style="font-size: 20px">아이디 찾기</h2>

    <form @submit.prevent="submitForm">
      <!-- Email Input Field -->
      <div class="mb-4 text-start">
        <label for="email" class="form-label">이메일</label>
        <div class="input-group">
          <input
            type="email"
            v-model="email"
            class="form-control"
            id="email"
            placeholder="richable@email.com"
            required
          />
          <button
            type="button"
            class="btn btn-secondary"
            @click="sendVerificationCode"
          >
            인증번호
          </button>
        </div>
      </div>

      <!-- Verification Code Input Field -->
      <div class="mb-5 text-start">
        <label for="verificationCode" class="form-label">인증코드</label>
        <div class="input-group">
          <input
            type="text"
            v-model="verificationCode"
            class="form-control"
            id="verificationCode"
            placeholder="인증 코드 6자를 입력하세요."
            required
          />
          <button type="button" class="btn btn-secondary" @click="verifyCode">확인</button>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="mb-5">
        <button type="button" class="btn btn-secondary w-100 mb-3" @click="goNext">계속</button>
      </div>

      <!-- Additional Links -->
      <div class="mb-5 text-center">
        <router-link to="/user/signin" class="join-link">다른 방법으로 로그인</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const email = ref('')
const verificationCode = ref('')
const isCodeSent = ref(false)
const isVerified = ref(false)
const foundId = ref('')

const BASE_URL = 'http://localhost:8080/member'

const sendVerificationCode = async () => {
  if (email.value) {
    try {
      const response = await axios.post(`${BASE_URL}/find/id`, { email: email.value })
      if (response.data.success) {
        alert(response.data.response?.data?.message)
        isCodeSent.value = true
      } else {
        alert(response.data.response?.data?.message || '인증 코드 전송에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error sending verification code:', error)
      alert(error.response?.data?.data?.message || '오류가 발생했습니다.')
    }
  } else {
    alert('이메일을 입력해주세요.')
  }
}

const verifyCode = async () => {
  if (verificationCode.value) {
    try {
      const response = await axios.post(`${BASE_URL}/find/id/auth`, {
        email: email.value,
        code: verificationCode.value
      })
      if (response.data.success) {
        foundId.value = response.data.response?.data?.id || '';
        isVerified.value = true;
        alert('이메일 인증이 성공적으로 완료되었습니다.');
      } else {
        alert(response.data.response?.data?.message || '인증에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      alert('인증 과정에서 오류가 발생했습니다.')
    }
  } else {
    alert('인증 코드를 입력해주세요.')
  }
}

const goNext = async () => {
  if (isVerified.value) {
    router.push({ name: 'findid2', params: { id: foundId.value } })
  } else {
    alert('먼저 이메일 인증을 완료해주세요.')
  }
}

const submitForm = () => {
  if (isVerified.value) {
    goNext()
  } else {
    verifyCode()
  }
}
</script>

<style scoped>
.body {
  color: #19181d;
  font-family: pretendard;
}
.find-id-container {
  width: 500px;
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
  margin-bottom: 5rem;
}

button {
  background-color: #ff0062;
  color: white; /* 버튼 텍스트 색상 */
  border: none; /* 버튼 테두리 제거 */
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.1s ease; /* 부드러운 전환 효과 */
}

/* 버튼 호버 시 */
button:hover {
  background-color: #e60056; /* 약간 더 어두운 핑크 */
}

/* 버튼 클릭 시 (active 상태) */
button:active {
  background-color: #cc004d !important; /* 클릭 시 더 어두운 색상 */
  transform: translateY(2px) !important; /* 눌렸을 때의 시각적 효과 */
}

/* input-group 내 버튼 스타일 */
.input-group .btn {
  background-color: #ff0062;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 0 5px 5px 0; /* 오른쪽만 둥글게 */
  transition:
    background-color 0.3s ease,
    transform 0.1s ease;
}

/* input-group 버튼 호버 시 */
.input-group .btn:hover {
  background-color: #e60056;
}

/* input-group 버튼 클릭 시 (active 상태) */
.input-group .btn:active {
  background-color: #cc004d;
  transform: translateY(2px); /* 눌렸을 때의 시각적 효과 */
}

.form-control:focus {
  border-color: #ff0062; /* 원하는 테두리 색상 */
  box-shadow: none;
  outline: none; /* 기본 아웃라인 제거 */
}

.join-link {
  font-size: 0.9rem;
  color: #777777;
  font-weight: 500;
  text-decoration: underline; /* 밑줄 추가 */
}

.input-group .btn {
  width: 100px;
}
</style>
