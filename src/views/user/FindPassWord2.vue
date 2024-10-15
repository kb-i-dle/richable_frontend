<!-- RC-P-03-1 -->
<template>
  <div id="findpassword2" class="find-pw-container">
    <h1 class="my-5">
      <i class="fa-solid fa-lock"></i>
      비밀번호 변경
    </h1>
    <form @submit.prevent="resetPassword">
      <div class="mb-4 text-start">
        <label for="newPassword" class="form-label">
          <i class="fa-solid fa-lock"></i>
          새 비밀번호:
        </label>
        <input
          type="password"
          class="form-control"
          id="newPassword"
          placeholder="새 비밀번호"
          v-model="newPassword"
          @input="resetError"
        />
      </div>
      <div class="mb-4 text-start">
        <label for="confirmPassword" class="form-label">
          <i class="fa-solid fa-lock"></i>
          새 비밀번호 확인:
        </label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="새 비밀번호 확인"
          v-model="confirmPassword"
          @input="resetError"
        />
      </div>
      <div v-if="error" class="text-danger">{{ error }}</div>
      <button
        type="submit"
        class="btn btn-primary mt-4"
        :disabled="!newPassword || !confirmPassword"
      >
        <i class="fa-solid fa-check"></i>
        확인
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePasswordResetStore } from '@/stores/passwordResetStore'
import axios from 'axios'

const router = useRouter()
const passwordResetStore = usePasswordResetStore()

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')

const BASE_URL =  import.meta.env.VITE_API_BASE_URL + "/member"

onMounted(() => {
  if (!passwordResetStore.isVerified) {
    alert('비정상적인 접근입니다. 비밀번호 찾기 페이지로 이동합니다.')
    router.push({ name: 'findpassword' })
  }
})

const resetError = () => {
  error.value = ''
}

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  try {
    // API 호출로 비밀번호 재설정
    const response = await axios.post(`${BASE_URL}/set/pw`, {
      id: passwordResetStore.userId,
      newPassword: newPassword.value
    })

    if (response.data.success) {
      alert('비밀번호가 성공적으로 재설정되었습니다.')
      passwordResetStore.reset() // 상태 초기화
      router.push({ name: 'signIn' })
    } else {
      error.value = response.data.message || '비밀번호 재설정 중 오류가 발생했습니다.'
    }
  } catch (err) {
    console.error('Error resetting password:', err)
    error.value = '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.'
  }
}
</script>

<style scoped>
.find-pw-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 5rem;
}
</style>
