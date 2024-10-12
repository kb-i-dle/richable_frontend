import axios from 'axios';
import router from './router'; // Vue Router 가져오기

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 환경 변수에서 API의 기본 URL 가져오기
  headers: {
    Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` // JWT 토큰 설정, 없으면 빈 문자열
  }
});

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {

    // 응답이 성공적인 경우 그대로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 에러 발생 시 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 중복 요청 방지
      try {
        // 리프레시 토큰으로 액세스 토큰 재발급 요청
        const response = await axiosInstance.post('/auth/refresh-token', {
          refreshToken: localStorage.getItem('refreshToken'),
        });

        // 새로운 액세스 토큰을 로컬 스토리지에 저장
        localStorage.setItem('authToken', response.data.accessToken);

        // 새로운 토큰을 axiosInstance의 Authorization 헤더에 설정
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

        // 원래 요청을 새로운 토큰으로 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료되었으면 로그인 페이지로 이동
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');


        // 원래 요청 URL을 리디렉션 쿼리로 전달
        router.push({
          path: '/user/signin',
          query: { redirect: originalRequest.url } // 원래 요청한 경로를 쿼리로 전달

        });
      }
    }

    // 그 외의 에러는 그대로 전달
    return Promise.reject(error);
  }
);

export default axiosInstance;
