<template>
  <PrivacyPolicy v-if="currentPage === 'privacy'" />
  <TermsOfService v-else-if="currentPage === 'terms'" />
  <NotFound v-else-if="isNotFound" />
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

    <!-- About -->
    <section class="about">
      <h2 class="section-title">About <span class="accent">toolzydev</span></h2>
      <p class="about-text">
        toolzydev는 개발자를 위한 무료 온라인 도구 모음입니다.
        JSON 포맷팅, 정규식 테스트, Base64 인코딩, Cron 표현식 검증, 3D 모델 뷰어, nginx 설정 분석까지 —
        자주 쓰는 개발 도구를 브라우저에서 바로 사용할 수 있습니다.
      </p>
      <p class="about-text">
        모든 도구는 설치 없이, 로그인 없이, 완전히 무료로 사용할 수 있습니다.
        소프트웨어 개발자, DevOps 엔지니어, 백엔드/프론트엔드 개발자, 학생 등
        코드를 다루는 모든 분들을 위해 만들었습니다.
      </p>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <h2 class="section-title">How It Works</h2>
      <div class="how-grid">
        <div class="how-item">
          <div class="how-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
            </svg>
          </div>
          <h3>브라우저에서 바로 실행</h3>
          <p>별도의 프로그램 설치가 필요 없습니다. 웹 브라우저만 있으면 모든 도구를 즉시 사용할 수 있습니다.</p>
        </div>
        <div class="how-item">
          <div class="how-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>데이터는 내 브라우저 안에서만</h3>
          <p>입력한 데이터는 서버로 전송되지 않습니다. 모든 처리가 클라이언트 사이드에서 이루어지므로 민감한 데이터도 안심하고 사용하세요.</p>
        </div>
        <div class="how-item">
          <div class="how-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h3>로그인 없이 무료</h3>
          <p>계정 생성, 이메일 인증, 구독 없이 모든 기능을 제한 없이 사용할 수 있습니다.</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <h2 class="section-title">자주 묻는 질문</h2>
      <div class="faq-list">
        <details class="faq-item">
          <summary>toolzydev는 무료인가요?</summary>
          <p>네, toolzydev의 모든 도구는 완전히 무료입니다. 숨겨진 요금이나 프리미엄 플랜이 없으며, 모든 기능을 제한 없이 사용할 수 있습니다.</p>
        </details>
        <details class="faq-item">
          <summary>계정을 만들어야 하나요?</summary>
          <p>아니요, 회원가입이나 로그인 없이 바로 사용할 수 있습니다. 이메일 주소나 개인정보를 입력할 필요가 없습니다.</p>
        </details>
        <details class="faq-item">
          <summary>내 데이터가 안전한가요?</summary>
          <p>toolzydev의 모든 도구는 브라우저에서 직접 실행되며, 입력한 데이터는 서버로 전송되지 않습니다. JSON, 정규식, 3D 파일 등 어떤 데이터도 외부로 유출되지 않으므로 민감한 데이터도 안심하고 사용할 수 있습니다.</p>
        </details>
        <details class="faq-item">
          <summary>어떤 도구를 제공하나요?</summary>
          <p>현재 JSON Formatter(포맷/검증/변환), Base64 Encoder(인코딩/디코딩), Regex Tester(정규식 테스트), Cron Tester(Cron 표현식 검증), 3D Viewer(STL/OBJ/GLTF/GLB 뷰어), nginx Viewer(설정 파싱/분석)를 제공하며, 새로운 도구를 지속적으로 추가하고 있습니다.</p>
        </details>
        <details class="faq-item">
          <summary>오프라인에서 사용할 수 있나요?</summary>
          <p>현재 오프라인 모드는 지원하지 않습니다. 인터넷 연결이 필요하지만, 도구 실행 자체는 브라우저에서 로컬로 처리되므로 빠른 속도로 동작합니다.</p>
        </details>
        <details class="faq-item">
          <summary>버그는 어떻게 신고하나요?</summary>
          <p><a href="mailto:toolzy.eden@gmail.com">toolzy.eden@gmail.com</a>으로 이메일을 보내주세요. 버그 신고, 기능 제안, 피드백을 환영합니다.</p>
        </details>
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
      <div class="footer-tools">
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
      </div>
      <div class="footer-legal">
        <span>© 2025 toolzydev</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MobileBlock from './components/MobileBlock.vue'
import NotFound from './components/NotFound.vue'
import PrivacyPolicy from './components/PrivacyPolicy.vue'
import TermsOfService from './components/TermsOfService.vue'

const isMobile = ref(false)
const isNotFound = ref(false)
const currentPage = ref('home')
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
  if (path === '/privacy') {
    currentPage.value = 'privacy'
  } else if (path === '/terms') {
    currentPage.value = 'terms'
  } else if (path !== '/') {
    isNotFound.value = true
  }

  const isBot = /bot|crawl|spider|google|bing|yandex|baidu|slurp|duckduck/i.test(navigator.userAgent)
  isMobile.value = !isBot && window.innerWidth < 768

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

/* About */
.about {
  max-width: 960px;
  width: 100%;
  margin: 64px auto 0;
  padding: 0 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #f0f0f5;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.about-text {
  font-size: 15px;
  line-height: 1.75;
  color: #9ca3af;
  margin-bottom: 12px;
}

/* How It Works */
.how-it-works {
  max-width: 960px;
  width: 100%;
  margin: 56px auto 0;
  padding: 0 32px;
}

.how-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 8px;
}

.how-item {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  padding: 24px 20px;
}

.how-icon {
  color: #a78bfa;
  margin-bottom: 14px;
}

.how-item h3 {
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
  margin-bottom: 8px;
}

.how-item p {
  font-size: 13px;
  line-height: 1.65;
  color: #9ca3af;
}

/* FAQ */
.faq {
  max-width: 960px;
  width: 100%;
  margin: 56px auto 0;
  padding: 0 32px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq-item {
  border-bottom: 1px solid #2a2a3a;
}

.faq-item:first-child {
  border-top: 1px solid #2a2a3a;
}

.faq-item summary {
  padding: 16px 4px;
  font-size: 15px;
  font-weight: 600;
  color: #f0f0f5;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: color 0.15s;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::before {
  content: '+';
  font-size: 18px;
  font-weight: 400;
  color: #a78bfa;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
  transition: transform 0.2s;
}

.faq-item[open] summary::before {
  content: '−';
}

.faq-item summary:hover {
  color: #a78bfa;
}

.faq-item p {
  padding: 0 4px 16px 36px;
  font-size: 14px;
  line-height: 1.7;
  color: #9ca3af;
}

.faq-item a {
  color: #a78bfa;
  text-decoration: none;
}

.faq-item a:hover {
  text-decoration: underline;
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
  padding: 24px 32px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  border-top: 1px solid #2a2a3a;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.footer-tools,
.footer-legal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
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
