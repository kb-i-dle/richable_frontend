<template>
  <aside
    @mouseenter="expandSidebar"
    @mouseleave="collapseSidebar"
    :class="{ active: isSideBarActive }"
  >
     <div :class="isSideBarActive ? 'expanded-logo' : 'collapsed-logo'">
      <router-link to="/">
        <img
          :src="
            isSideBarActive
              ? fullLogoUrl
              : logoUrl
          "
          alt="로고"
        />
      </router-link>
    </div>
    
    <div class="menu">

        <div  @mouseenter="toggleAssetMenu" @mouseleave="toggleAssetMenu" class="wrapButton">
            <div :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'wallet']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle" style="margin-left: 8px; font-weight: 450;">자산</span>
            </div>
            <transition name="slide-fade">
                <div v-if="isAssetMenuOpen" class="subButton">
                    <router-link to="/asset/analysis" class="button">
                        <span class="text">자산 분석</span>
                    </router-link>
                    <router-link to="/asset/comparison" class="button">
                        <span class="text">또래 자산 비교</span>
                    </router-link>
                    <router-link to="/asset/management" class="button">
                        <span class="text">자산 관리</span>
                    </router-link>
                </div>
            </transition>
        </div>
      

      
      
        <div @mouseenter="toggleIncomeMenu" @mouseleave="toggleIncomeMenu" class="wrapButton">
            <div :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'receipt']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle" style="margin-left: 8px; font-weight: 450;">소득/소비</span>
            </div>

            <div v-if="isIncomeMenuOpen" class="subButton">
                <router-link to="/budget/consume/analysis" class="button">
                <span class="text">소비 분석</span>
                </router-link>
                <router-link to="/budget/consume/compare" class="button">
                <span class="text">평균 소비 비교</span>
                </router-link>
                <router-link to="/budget/list" class="button">
                <span class="text">소득/소비 관리</span>
                </router-link>
            </div>
        </div>

        <div @mouseenter="toggleInvestMenu" @mouseleave="toggleInvestMenu" class="wrapButton">
            <div :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'arrow-trend-up']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle" style="margin-left: 8px; font-weight: 450;">투자</span>
            </div>

            <div v-if="isInvestMenuOpen" class="subButton">
                <router-link to="/invest/advisor" class="button">
                <span class="text">투자 상품 추천</span>
                </router-link>
                <router-link to="/invest/return/top" class="button">
                <span class="text">수익률 상위 자산</span>
                </router-link>
            </div>
        </div>

        <router-link to="/goal/list">
            <div @click="toggleGoalMenu" :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'bullseye']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle" style="margin-left: 8px ;font-weight: 450;">목표</span>
            </div>
        </router-link>
      

      <!-- <div v-if="isGoalMenuOpen" class="subButton">
                <router-link to="/" class="button">
                    <span class="text">목표 자산 관리</span>
                </router-link>
            </div> -->

        <router-link to="/knowhow/list">
            <div @click="toggleCommunityMenu" :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'users']" class="icon" />
                <span v-if="isSideBarActive" class="sideToggle" style="margin-left: 8px; font-weight: 450; ">리치 노하우</span>
            </div>
        </router-link>
    <!-- <div v-if="isCommunityMenuOpen" class="subButton">
                <router-link to="/" class="button">
                    <span class="text">리치 노하우</span>
                </router-link>
            </div> -->
        
    </div>


      <!-- 로그인/유저 정보/로그아웃 -->
      <div class="menu-bottom">
      <router-link v-if="!isLoggedIn" to="/user/signin" :class="isSideBarActive ? 'expanded-button login-button' : 'collapsed-button login-button'">
        <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" class="icon" />
        <span v-if="isSideBarActive" class="text" style="margin-left: 8px; font-weight: 450;">로그인</span>
      </router-link>
      
      <!-- <div v-if="isLoggedIn" :class="isSideBarActive ? 'expanded-user' : 'collapsed-user'">
        <div class="user-info" :class="isSideBarActive ? 'expanded-user' : 'collapsed-user'">
          <font-awesome-icon :icon="['fas', 'user']" class="icon" />
          <div v-if="isSideBarActive">
            <p class="user-name">{{ user.name }}</p>
            <p class="user-email">{{ user.email }}</p>
          </div>
        </div> -->


       
          <div v-if="isLoggedIn" :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'" class="user_info">
            <router-link to="/user/myPage" >
              <img 
                src="../assets/images/navbar-rich.png" 
                alt="user"
                style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #CCCCD6;" />
                <span v-if="isSideBarActive"class="text sideToggle" style="margin-left: 8px; font-weight: 550;">rla</span>
            </router-link>
            </div>

        
        <div v-if="isLoggedIn" @click="logout">
          <div :class="isSideBarActive ? 'expanded-button login-button' : 'collapsed-button login-button'">
            <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" class="icon" />
            <span v-if="isSideBarActive" class="text" style="margin-left: 8px; font-weight: 550;">로그아웃</span>
          </div>
        </div>

    </div>
    
  </aside>
</template>

<script>
// import fullLogo from 'src/assets/images/navbar-full-rich.png'; // 전체 로고
// import collapsedLogo from 'src/assets/images/navbar-rich.png'; // 축소 로고

export default {
  data() {
    return {
      fullLogoUrl : new URL('@/assets/images/navbar-full-rich.png', import.meta.url).href,
      logoUrl : new URL('@/assets/images/navbar-rich.png', import.meta.url).href,
      isAssetMenuOpen: false,
      isIncomeMenuOpen: false,
      isInvestMenuOpen: false,
      isGoalMenuOpen: false,
      isCommunityMenuOpen: false,
      isSideBarActive: false // 초기값: 사이드바 축소 상태
    }
  },
  methods: {
    toggleAssetMenu() {
      this.isAssetMenuOpen = !this.isAssetMenuOpen
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleIncomeMenu() {
      this.isIncomeMenuOpen = !this.isIncomeMenuOpen
      this.isAssetMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleInvestMenu() {
      this.isInvestMenuOpen = !this.isInvestMenuOpen
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleGoalMenu() {
      this.isGoalMenuOpen = !this.isGoalMenuOpen
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleCommunityMenu() {
      this.isCommunityMenuOpen = !this.isCommunityMenuOpen
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
    },
    expandSidebar() {
      this.isSideBarActive = true // 사이드바 확장
    },
    collapseSidebar() {
      this.isSideBarActive = false // 사이드바 축소
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    checkLoginStatus() {
      // localStorage에 토큰이 있는지 확인하여 로그인 상태 설정
      const token = localStorage.getItem('authToken');
      this.isLoggedIn = !!token;
    },
    logout() {
      // 로그아웃 시 localStorage 및 sessionStorage에서 모든 세션 정보 삭제
      localStorage.removeItem('authToken');  // localStorage에서 authToken 삭제
      sessionStorage.clear();  // sessionStorage 전체 삭제
      
      // 상태 초기화 및 리디렉션
      this.isLoggedIn = false;
      this.$router.push('/user/signin');
      
      alert('로그아웃 되었습니다.');
    }
  },
  mounted(){
    this.checkLoginStatus();
  },
  watch: {
    // 페이지가 바뀔 때마다 로그인 상태 확인
    $route() {
      this.checkLoginStatus();
    }
  }
}
</script>

<style scoped>
.body{
  font-family: pretendard;
  color: #19181d;
}
aside {
  position: fixed; /* 페이지 위로 열리도록 설정 */
  top: 0;
  left: 0;
  z-index: 1000; /* 다른 요소 위로 나오도록 설정 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 56px; /* 축소된 상태의 너비 */
  transition: width 0.2s ease; /* 너비 변경 시 애니메이션 */
  border-radius: 0% 16px 16px 0%;
  /* border: 1px solid gray; 기존 border 제거 */
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  background-color: white;
}

/* 사이드바 활성 상태일 때 확장 */
aside.active {
  transform: translateX(0); /* 페이지 위로 열리도록 */
  width: 320px; /* 확장된 상태의 너비 */
  box-shadow: 4px 0px 15px rgba(0, 0, 0, 0.2); /* 확장된 상태에서 더 진한 그림자 */
}

.expanded-logo {
  margin: 25px 0px 25px 24px;
  width: 220px;
  height: 58px;
}

.collapsed-logo {
  margin: 25px auto;
  width: 50px;
  height: 56px;
}

.expanded-logo img {
  height: 100%;
  width: 100%;
}
 
.collapsed-logo img {
  height: 100%;
  width: 100%;
}

.menu {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  height: 100%;
  padding: 20px 8px;
}

a {
  text-decoration: none;
  color: #19181d;
}
.menu .wrapButton {
    display: flex;
    flex-direction: column;
}

.menu .expanded-button {
  margin: 10px 0;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu .expanded-button:hover,
.menu .collapsed-button:hover {
  background-color: #f0f0f5; /* 호버 시 배경색 변경 */
}


.menu .expanded-button .icon {
  margin-right: 8px;
  height: 24px;
  width: 24px;
}

.menu .collapsed-button {
    margin: 20px 0;
    cursor: pointer;
    display: flex;
    padding: 0 5px;
}

.menu .collapsed-button .icon {
  height: 24px;
  width: 24px;
  align-items: center;
}

.subButton {
  display: flex;
  flex-direction: column;
  margin-left: 38px;  
  background-color: #f9f9f9; /* 서브메뉴 배경색 */
  border-radius: 8px; /* 서브메뉴 항목의 둥근 모서리 */
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 그림자 추가 */
  padding: 10px 0; /* 서브메뉴의 상하 여백 */
  overflow: hidden;
}

.subButton .button {
    margin: 20px 0;
    padding: 0 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.menu-bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 20%;
  padding: 8px;
}

.menu-bottom .expanded-button {
  margin: 20px 0;
  padding: 0 20px;
}

.menu-bottom .collapsed-button {
  margin: 20px 0;
  padding: 0 5px;
}

.menu-bottom .icon {
  margin-right: 8px;
  height: 24px;
  width: 24px;
}

.subButton{
  margin-left: 38px;  
}

.text{
  color : #1D1616;
  height: 20px;
}

/* 애니메이션 정의 (슬라이드 + 페이드 효과)
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
} */
</style>
 
