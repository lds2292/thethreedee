<template>
  <div class="app">
    <NotFoundPage v-if="isNotFound" />

    <MobileBlock v-else-if="isMobile" />

    <template v-else>
      <header class="header">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          3D Viewer
        </div>
        <div class="header-right">
          <span class="supported-formats">STL · OBJ · GLTF · GLB 지원</span>
          <button class="btn-about" title="About" @click="showAbout = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="8.5"/>
              <line x1="12" y1="12" x2="12" y2="16"/>
            </svg>
          </button>
        </div>
      </header>

      <main class="main">
        <ModelViewer v-if="modelFile" :file="modelFile" @reset="resetFile" />
        <DropZone v-else @file-loaded="onFileLoaded" />
      </main>

      <footer class="ad-footer">
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-1253318658034453"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </footer>

      <AboutModal v-model="showAbout" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DropZone from './components/DropZone.vue'
import ModelViewer from './components/ModelViewer.vue'
import AboutModal from './components/AboutModal.vue'
import MobileBlock from './components/MobileBlock.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

const isNotFound = window.location.pathname !== '/'

const MOBILE_BREAKPOINT = 768

// 페이지 로드 시 한 번만 체크 — resize 이벤트로 업데이트하지 않음
// (PC에서 창 크기를 줄여도 뷰어가 유지되도록)
const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT)

const modelFile = ref(null)
const showAbout = ref(false)

onMounted(() => {
  if (isMobile.value) return
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {}
})

function onFileLoaded(file) {
  modelFile.value = file
}

function resetFile() {
  modelFile.value = null
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #a78bfa;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.supported-formats {
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.btn-about {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #6b7280;
  background: transparent;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  padding: 0;
}

.btn-about:hover {
  color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.4);
}

.main {
  flex: 1;
  min-height: 0; /* iOS Safari: flex 자식의 height:100% 해석 버그 방지 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 480px) {
  .supported-formats { display: none; }
}

.ad-footer {
  width: 100%;
  max-width: 728px;
  margin: 0 auto;
  padding: 4px 24px;
  flex-shrink: 0;
  height: 100px;  /* 광고 높이 고정: 레이아웃이 항상 이 공간을 미리 확보 */
  overflow: hidden;
  display: flex;
  align-items: center;
}

@media (max-width: 480px) {
  .ad-footer {
    height: 60px; /* 모바일 배너 (320×50) */
  }
}
</style>
