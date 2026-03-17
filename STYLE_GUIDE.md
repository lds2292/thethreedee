# Toolzy Style Guide

Toolzy 앱 전체에 적용되는 디자인 시스템 및 공통 패턴 가이드.
새 앱을 만들 때 이 문서를 기준으로 삼는다.

---

## 1. 색상 시스템

```css
/* Background */
--bg-base:    #0f0f13;   /* 페이지 전체 배경 */
--bg-surface: #16161d;   /* 카드, 헤더, 패널 */
--bg-raised:  #1e1e28;   /* 호버 상태, 인풋 배경 */

/* Border */
--border:     #2a2a3a;   /* 기본 구분선 */
--border-dim: #3a3a4f;   /* 스크롤바 호버 등 조금 밝은 선 */

/* Accent (Purple) */
--accent:          #a78bfa;              /* 주요 강조색 */
--accent-bg:       rgba(167,139,250,.12);/* 뱃지 배경 */
--accent-border:   rgba(167,139,250,.3); /* 뱃지 테두리 */
--accent-border-hi:rgba(167,139,250,.5); /* 호버 시 테두리 */

/* Text */
--text-primary:   #f0f0f5;  /* 제목, 강조 텍스트 */
--text-body:      #e0e0e0;  /* 본문 */
--text-secondary: #6b7280;  /* 설명, 서브텍스트 */
```

### 사용 예시

| 요소 | 색상 |
|---|---|
| 페이지 배경 | `#0f0f13` |
| 헤더 / 카드 배경 | `#16161d` |
| 구분선 / 테두리 | `#2a2a3a` |
| 아이콘 / 링크 액센트 | `#a78bfa` |
| 제목 | `#f0f0f5` |
| 본문 | `#e0e0e0` |
| 보조 설명 | `#6b7280` |

---

## 2. 타이포그래피

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* 코드/모노 */
font-family: 'Fira Code', 'Cascadia Code', monospace;

/* 크기 스케일 */
--text-xs:  12px;
--text-sm:  13px;
--text-md:  14px;
--text-base:15px;
--text-lg:  17px;
--text-xl:  18px;
--text-2xl: 20px;
--text-3xl: 24px;
--text-4xl: 28px;
--text-hero:52px;  /* 랜딩 히어로 */

/* 줄간격 */
line-height: 1.6;  /* 본문 */
line-height: 1.15; /* 제목 */
line-height: 1.7;  /* 안내 메시지 */
```

---

## 3. 공통 CSS 리셋 (style.css)

모든 앱의 `src/style.css`에 아래를 공통으로 사용한다.

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #app {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #0f0f13;
  color: #e0e0e0;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #3a3a4f; }
```

---

## 4. 레이아웃 패턴

### 4-1. 헤더 (56px 고정)

```css
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

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #f0f0f5;
  letter-spacing: -0.02em;
}
```

### 4-2. 전체 페이지 래퍼

```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f0f13;
}
```

### 4-3. 푸터 (항상 하단 고정)

```css
/* .page에 min-height: 100vh + flex-direction: column 이 있어야 동작 */
.footer {
  margin-top: auto;   /* ← 핵심: 위 공간을 모두 차지해 푸터를 밀어냄 */
  padding: 32px;
  border-top: 1px solid #2a2a3a;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
```

> **주의**: `.footer`에 `margin-top`을 중복 선언하면 `auto`가 덮어쓰여 고정이 풀린다.

---

## 5. 컴포넌트 패턴

### 5-1. 뱃지 (URL, 태그 등)

```css
.badge {
  padding: 2px 8px;
  background: rgba(167, 139, 250, 0.12);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 4px;   /* 작은 태그 */
  color: #a78bfa;
  font-size: 12px;
  font-family: monospace;
}

/* 둥근 뱃지 (URL, 도메인 표시용) */
.badge-pill {
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.03em;
}
```

### 5-2. 버튼

```css
/* Ghost 버튼 (기본) */
.btn {
  padding: 5px 10px;
  background: rgba(255,255,255,.06);
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  color: #e0e0e0;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn:hover {
  background: rgba(255,255,255,.1);
  border-color: #3a3a4f;
}

/* Accent 버튼 */
.btn-accent {
  background: rgba(167, 139, 250, 0.12);
  border-color: rgba(167, 139, 250, 0.3);
  color: #a78bfa;
}
.btn-accent:hover {
  background: rgba(167, 139, 250, 0.2);
  border-color: rgba(167, 139, 250, 0.5);
}
```

### 5-3. 카드

```css
.card {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.15s, transform 0.15s;
}
.card:hover {
  border-color: rgba(167, 139, 250, 0.5);
  transform: translateY(-2px);
}
```

---

## 6. 공통 컴포넌트 구현

### 6-1. MobileBlock.vue

모바일(< 768px) 접속 시 표시. 앱 이름과 URL만 변경해 재사용한다.

```vue
<template>
  <div class="mobile-block">
    <div class="content">
      <div class="icon"><!-- 앱 아이콘 SVG --></div>
      <h1 class="title">{{ appName }}</h1>
      <p class="message">이 서비스는 PC 환경에서<br>최적화되어 있습니다.</p>
      <p class="submessage">데스크탑 또는 노트북 브라우저에서<br>접속해 주세요.</p>
      <div class="url-badge">{{ appUrl }}</div>
    </div>
  </div>
</template>
```

### 6-2. NotFoundPage.vue

잘못된 경로 접근 시 표시. 앱 이름만 변경해 재사용한다.

```vue
<template>
  <div class="page">
    <header><!-- 헤더 --></header>
    <main>
      <div class="code">404</div>
      <h1>Page Not Found</h1>
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <a href="/">홈으로 돌아가기</a>
    </main>
  </div>
</template>
```

---

## 7. App.vue 라우팅 패턴

vue-router 없이 `window.location.pathname`으로 수동 라우팅.

```vue
<template>
  <NotFoundPage v-if="isNotFound" />
  <MobileBlock v-else-if="isMobile" />
  <div v-else class="page">
    <!-- 앱 본문 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MobileBlock from './components/MobileBlock.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

const isMobile = ref(false)
const isNotFound = ref(false)

onMounted(() => {
  // 경로 체크: 후행 슬래시 제거 후 '/'만 허용
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  isNotFound.value = path !== '/'

  // 모바일 체크: 로드 시 1회만 (resize 감지 없음 — 뷰어 언마운트 방지)
  isMobile.value = window.innerWidth < 768
})
</script>
```

> **주의**: `isMobile`은 resize 이벤트를 듣지 않는다. PC에서 창 크기를 줄여도 MobileBlock으로 전환되지 않는다. 이는 의도된 동작으로, 3D Viewer 같은 앱에서 렌더러가 언마운트되는 것을 방지한다.

---

## 8. 파일 구조 (새 앱 템플릿)

```
my-tool/
├── index.html              ← SEO 메타태그 (아래 9번 참고)
├── package.json
├── vite.config.js
├── netlify.toml            ← 아래 10번 참고
├── public/
│   ├── _redirects          ← /* /index.html 200
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── main.js
    ├── style.css           ← 3번 공통 리셋 사용
    ├── App.vue             ← 7번 라우팅 패턴 사용
    ├── components/
    │   └── MobileBlock.vue ← 6-1 참고
    └── pages/
        └── NotFoundPage.vue ← 6-2 참고
```

---

## 9. index.html SEO 템플릿

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>{{ 툴 이름 }} — Free Online {{ 카테고리 }} Tool</title>

  <!-- Primary Meta -->
  <meta name="description" content="{{ 설명 160자 이내 }}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="toolzy">
  <meta name="google-adsense-account" content="ca-pub-1253318658034453">

  <!-- Canonical -->
  <link rel="canonical" href="https://{{ 도메인 }}/">
  <link rel="alternate" hreflang="ko" href="https://{{ 도메인 }}/">
  <link rel="alternate" hreflang="en" href="https://{{ 도메인 }}/">
  <link rel="alternate" hreflang="x-default" href="https://{{ 도메인 }}/">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://{{ 도메인 }}/">
  <meta property="og:title" content="{{ 제목 }}">
  <meta property="og:description" content="{{ 설명 }}">
  <meta property="og:site_name" content="Toolzy">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{{ 제목 }}">
  <meta name="twitter:description" content="{{ 설명 }}">

  <!-- JSON-LD: WebApplication -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "{{ 툴 이름 }}",
    "url": "https://{{ 도메인 }}",
    "description": "{{ 설명 }}",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  }
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

---

## 10. AdSense 통합 패턴

```vue
<script setup>
import { onMounted } from 'vue'

const PUBLISHER_ID = 'ca-pub-1253318658034453'

onMounted(() => {
  if (isMobile.value) return  // 모바일 제외

  const script = document.createElement('script')
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
  script.onload = () => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }
})
</script>
```

| 배치 유형 | 권장 위치 | `data-ad-format` |
|---|---|---|
| 가로 배너 | 콘텐츠 하단 | `horizontal` |
| 우측 사이드바 | 메인 오른쪽 (300px) | `auto` |
| 반응형 | 섹션 사이 | `auto` + `data-full-width-responsive="true"` |

---

## 11. public/_redirects

모든 앱에 동일하게 적용. Netlify SPA 라우팅 필수.

```
/* /index.html 200
```

---

## 12. robots.txt 템플릿

```
User-agent: *
Allow: /

Sitemap: https://{{ 도메인 }}/sitemap.xml
```

---

## 13. package.json 템플릿

```json
{
  "name": "{{ 폴더명 }}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.30"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.5",
    "vite": "^8.0.0"
  }
}
```

---

## 14. 트랜지션 규칙

```css
/* 빠른 인터랙션 (버튼, 링크 hover) */
transition: 0.15s;

/* 일반 UI 상태 변화 */
transition: 0.2s ease;

/* 슬라이드 / 패널 등장 */
transition: 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* 페이드 인 */
transition: opacity 0.3s ease;
```

---

## 15. 체크리스트 (새 앱 출시 전)

- [ ] `index.html` — title, description, canonical, og tags, JSON-LD
- [ ] `index.html` — `google-adsense-account` 메타태그
- [ ] `public/_redirects` — `/* /index.html 200`
- [ ] `public/robots.txt` — Sitemap URL
- [ ] `App.vue` — `isNotFound` 경로 체크
- [ ] `App.vue` — `isMobile` 768px 체크
- [ ] `MobileBlock.vue` — 앱 이름, URL 반영
- [ ] `NotFoundPage.vue` — 앱 이름, 홈 링크 반영
- [ ] `netlify.toml` — base, publish, ignore 설정
- [ ] `CLAUDE.md` (루트) — 앱 목록 추가
- [ ] landing 페이지 — 카드 추가, 스크린샷 추가
