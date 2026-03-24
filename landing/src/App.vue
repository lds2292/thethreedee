<template>
  <NotFound v-if="isNotFound" />
  <MobileBlock v-else-if="isMobile" />
  <div v-else class="page">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <span class="logo-text">toolzydev</span>
        </div>
        <span class="tagline">Developer Tools, Simplified</span>
      </div>
    </header>

    <!-- Category Nav -->
    <nav class="cat-nav">
      <div class="cat-nav-inner">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="cat-btn"
          :class="{ active: activeCategory === item.id }"
          @click="activeCategory = item.id"
        >{{ item.label }}</button>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <h1 class="hero-title">Developer Tools,<br><span class="accent">Simplified</span></h1>
      <p class="hero-sub">브라우저에서 바로 쓰는 무료 개발 툴 — 설치 없이, 로그인 없이.</p>
    </section>

    <!-- Tool Cards -->
    <section class="tools">
      <div v-for="cat in filteredCategories" :key="cat.id" class="category-section">
        <div class="category-header">
          <span class="category-label">{{ cat.label }}</span>
          <span class="category-label-en">{{ cat.en }}</span>
        </div>
        <div class="cards">
          <a v-for="tool in cat.tools" :key="tool.key" class="card" :href="tool.href">
            <div class="card-bg">
              <img v-if="screenshots[tool.key]" :src="screenshots[tool.key]" :alt="tool.title + ' preview'" loading="lazy" />
            </div>
            <div class="card-icon" v-html="tool.icon"></div>
            <div class="card-body">
              <h2 class="card-title">{{ tool.title }}</h2>
              <p class="card-desc">{{ tool.desc }}</p>
              <p class="card-detail">{{ tool.detail }}</p>
            </div>
            <div class="card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- AdSense -->
    <section class="adsense">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-1253318658034453"
           data-ad-slot="auto"
           data-ad-format="horizontal"
           data-full-width-responsive="true"></ins>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2025 toolzydev</span>
      <span class="sep">·</span>
      <a href="/json/">JSON Formatter</a>
      <span class="sep">·</span>
      <a href="/3d-viewer/">3D Viewer</a>
      <span class="sep">·</span>
      <a href="/encode/">Base64 Encoder</a>
      <span class="sep">·</span>
      <a href="/regex/">Regex Tester</a>
      <span class="sep">·</span>
      <a href="/cron/">Cron Tester</a>
      <span class="sep">·</span>
      <a href="/nginx/">nginx Viewer</a>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MobileBlock from './components/MobileBlock.vue'
import NotFound from './components/NotFound.vue'

const isMobile = ref(false)
const isNotFound = ref(false)
const activeCategory = ref('all')

const screenshots = {
  jsonFormatter: '/screenshots/json-formatter.jpg',
  viewer3d: '/screenshots/3d-viewer.jpg',
  base64Encoder: '/screenshots/base64-encoder.jpg',
  regexTester: '/screenshots/regex-tester.jpg',
  cronTester: '/screenshots/cron-tester.jpg',
  nginxViewer: '/screenshots/nginx-viewer.jpg',
}

const categories = [
  {
    id: 'dev-tools',
    label: '개발자 도구',
    en: 'Developer Tools',
    tools: [
      {
        key: 'jsonFormatter', href: '/json/',
        title: 'JSON Formatter', desc: 'Format · Validate · Minify · Convert',
        detail: 'JSON을 보기 좋게 포맷하고 문법 오류를 실시간으로 검증합니다. 트리 뷰, 키 정렬, CSV·TypeScript 변환까지 하나의 도구로.',
        icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      },
      {
        key: 'regexTester', href: '/regex/',
        title: 'Regex Tester', desc: 'Test · Match · Replace',
        detail: '정규식을 실시간으로 테스트하고 매칭을 하이라이트로 시각화합니다. 캡처 그룹, 플래그 토글, Replace All, 자주 쓰는 패턴 모음 제공.',
        icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="4" x2="10" y2="20"/></svg>',
      },
      {
        key: 'base64Encoder', href: '/encode/',
        title: 'Base64 Encoder', desc: 'Base64 · URL · Image → Base64',
        detail: '텍스트·URL·이미지를 Base64로 인코딩하거나 디코딩합니다. Standard, Base64url, MIME 등 다양한 Variant와 한글을 포함한 UTF-8 완전 지원.',
        icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      },
      {
        key: 'cronTester', href: '/cron/',
        title: 'Cron Tester', desc: 'Validate · Describe · Preview',
        detail: 'cron 표현식을 실시간으로 검증하고 한국어 설명을 제공합니다. 다음 실행 시간 10개 미리보기, 5-field/6-field 포맷 전환, 자주 쓰는 프리셋 제공.',
        icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      },
      {
        key: 'nginxViewer', href: '/nginx/',
        title: 'nginx Viewer', desc: 'Parse · Format · Tree · Summary',
        detail: 'nginx.conf를 붙여넣으면 자동 포매팅, 트리 탐색, 핵심 설정 요약을 제공합니다. Virtual host, upstream, location, SSL 인증서 정보를 한눈에 확인.',
        icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      },
    ],
  },
  {
    id: 'media',
    label: '3D / 미디어',
    en: '3D & Media',
    tools: [
      {
        key: 'viewer3d', href: '/3d-viewer/',
        title: '3D Viewer', desc: 'STL · OBJ · GLTF · GLB',
        detail: 'STL, OBJ, GLTF, GLB 파일을 브라우저에서 바로 렌더링합니다. 회전·확대·조명 조절과 와이어프레임 모드, 스크린샷 저장 지원.',
        icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
      },
    ],
  },
]

const navItems = [
  { id: 'all', label: 'All' },
  ...categories.map(cat => ({ id: cat.id, label: cat.label })),
]

const filteredCategories = computed(() =>
  activeCategory.value === 'all'
    ? categories
    : categories.filter(cat => cat.id === activeCategory.value)
)

onMounted(() => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  isNotFound.value = path !== '/'

  isMobile.value = window.innerWidth < 768

  // Load AdSense
  if (!isMobile.value) {
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1253318658034453'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
    script.onload = () => {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
    }
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f0f13;
}

/* Header */
.header {
  height: 56px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-inner {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #f0f0f5;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 13px;
  color: #6b7280;
  margin-left: 4px;
}

/* Category Nav */
.cat-nav {
  position: sticky;
  top: 56px;
  z-index: 9;
  background: #0f0f13;
  border-bottom: 1px solid #2a2a3a;
  padding: 0 32px;
}

.cat-nav-inner {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 4px;
  padding: 10px 0;
}

.cat-btn {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 20px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.cat-btn:hover {
  color: #f0f0f5;
  background: rgba(255, 255, 255, 0.06);
}

.cat-btn.active {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.12);
  border-color: rgba(167, 139, 250, 0.3);
}

/* Hero */
.hero {
  max-width: 960px;
  width: 100%;
  margin: 72px auto 0;
  padding: 0 32px;
  text-align: center;
}

.hero-title {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.15;
  color: #f0f0f5;
  letter-spacing: -0.03em;
}

.accent {
  color: #a78bfa;
}

.hero-sub {
  margin-top: 20px;
  font-size: 18px;
  color: #6b7280;
  line-height: 1.6;
}

/* Tool Cards */
.tools {
  max-width: 960px;
  width: 100%;
  margin: 56px auto 0;
  padding: 0 32px;
}

.category-section {
  margin-bottom: 48px;
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 3px solid #a78bfa;
}

.category-label {
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
}

.category-label-en {
  font-size: 12px;
  color: #6b7280;
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  padding: 28px 24px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: rgba(167, 139, 250, 0.5);
  transform: translateY(-2px);
}

/* 배경 스크린샷 레이어 */
.card-bg {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 55%;
  transform: translateX(100%);
  transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
}

.card:hover .card-bg {
  transform: translateX(0);
}

/* 왼쪽 그라데이션 블렌딩 */
.card-bg::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 60%;
  background: linear-gradient(to right, #16161d 10%, transparent 100%);
  z-index: 1;
}

.card-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  opacity: 0.5;
}

.card-icon,
.card-body,
.card-arrow {
  position: relative;
  z-index: 1;
}

.card-icon {
  color: #a78bfa;
  flex-shrink: 0;
  opacity: 0.9;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #f0f0f5;
  margin-bottom: 6px;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.card-detail {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.65;
  margin-bottom: 14px;
}

.card-arrow {
  color: #6b7280;
  flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}

.card:hover .card-arrow {
  color: #a78bfa;
  transform: translateX(2px);
}

/* AdSense */
.adsense {
  max-width: 960px;
  width: 100%;
  margin: 48px auto 0;
  padding: 0 32px;
  min-height: 90px;
}

/* Footer */
.footer {
  margin-top: auto;
  padding: 32px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  border-top: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer a {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;
}

.footer a:hover {
  color: #a78bfa;
}

.sep {
  color: #3a3a4f;
}
</style>
