# DEV_GUIDE.md — Toolzy 개발 가이드

> 디자인 토큰·CSS 패턴은 [`STYLE_GUIDE.md`](./STYLE_GUIDE.md) 참조.

---

## 목차

1. [모노레포 구조](#1-모노레포-구조)
2. [새 앱 추가하는 법](#2-새-앱-추가하는-법)
3. [App.vue 기본 구조](#3-appvue-기본-구조)
4. [MobileBlock 컴포넌트](#4-mobileblock-컴포넌트)
5. [Help 모달 패턴](#5-help-모달-패턴)
6. [필드 입력 + 프리셋 드롭다운 패턴](#6-필드-입력--프리셋-드롭다운-패턴)
7. [netlify.toml 규칙](#7-netlifytoml-규칙)
8. [landing 페이지 카드 추가](#8-landing-페이지-카드-추가)
9. [새 앱 출시 체크리스트](#9-새-앱-출시-체크리스트)

---

## 1. 모노레포 구조

```
toolzy/
├── CLAUDE.md               ← 빠른 참조
├── DEV_GUIDE.md            ← 이 문서
├── STYLE_GUIDE.md          ← 디자인 시스템
├── package.json            ← npm workspaces 루트
├── netlify.toml            ← 통합 배포 설정
├── scripts/
│   └── merge-dist.js       ← 빌드 결과물 병합
├── landing/                ← toolzy.site/
├── json-formatter/         ← toolzy.site/json/
├── 3d-viewer/              ← toolzy.site/3d-viewer/
├── base64-encoder/         ← toolzy.site/encode/
├── regex-tester/           ← toolzy.site/regex/
└── cron-tester/            ← toolzy.site/cron/
```

**npm workspaces** — `package.json` 루트의 `workspaces` 배열에 앱 폴더명 등록. vue, vite, @vitejs/plugin-vue는 루트에서 공유.

각 앱 `package.json`은 앱 고유 의존성만 선언한다.

```json
// 루트 package.json (공통 의존성)
{
  "workspaces": ["landing", "json-formatter", "base64-encoder", "regex-tester", "cron-tester", "3d-viewer"],
  "dependencies": { "vue": "^3.5.30" },
  "devDependencies": { "@vitejs/plugin-vue": "^6.0.5", "vite": "^8.0.0" }
}
```

---

## 2. 새 앱 추가하는 법

### Step 1 — 폴더 및 기본 파일 생성

```
my-tool/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js
    ├── style.css
    ├── App.vue
    └── components/
        └── MobileBlock.vue
```

**`package.json`**
```json
{
  "name": "my-tool",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": {}
}
```

**`vite.config.js`**
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/my-tool/',   // ← URL 경로와 일치시킬 것
  plugins: [vue()],
})
```

**`src/main.js`**
```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
createApp(App).mount('#app')
```

**`src/style.css`** — [`STYLE_GUIDE.md § 3`](./STYLE_GUIDE.md) 공통 리셋 복사.

### Step 2 — 루트 package.json 등록

```json
"workspaces": ["...", "my-tool"],
"scripts": {
  "build:all": "... && npm run build --workspace my-tool && node scripts/merge-dist.js"
}
```

### Step 3 — merge-dist.js 에 경로 추가

```js
copyDir(path.join(root, 'my-tool/dist'), path.join(root, 'dist/my-tool'))
```

### Step 4 — netlify.toml 에 리다이렉트 추가

[§ 7 netlify.toml 규칙](#7-netlifytoml-규칙) 참조. landing 캐치-올(`/*`) **앞에** 삽입.

### Step 5 — npm install

```bash
npm install   # 워크스페이스 전체 심링크 갱신
```

### Step 6 — landing 페이지에 카드 추가

[§ 8 landing 페이지 카드 추가](#8-landing-페이지-카드-추가) 참조.

---

## 3. App.vue 기본 구조

vue-router 없이 `window.location.pathname` 으로 수동 라우팅.

```vue
<template>
  <MobileBlock v-if="isMobile" />
  <div v-else class="app">
    <header class="header">...</header>
    <div class="main">
      <!-- 앱 본문 -->
    </div>

    <!-- Help 모달 (§ 5 참조) -->
    <Teleport to="body">
      <div v-if="showHelp" class="modal-backdrop" @click.self="showHelp = false">
        ...
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MobileBlock from './components/MobileBlock.vue'

const isMobile = ref(false)
const showHelp = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
})
</script>
```

> `isMobile`은 resize 이벤트를 감지하지 않는다. 로드 시 1회만 체크하여 3D Viewer 같은 앱에서 렌더러가 언마운트되는 것을 방지한다.

---

## 4. MobileBlock 컴포넌트

앱마다 `src/components/MobileBlock.vue`를 두고, **앱 이름 · 아이콘 SVG · URL**만 변경해 재사용한다.

```vue
<template>
  <div class="mobile-block">
    <div class="content">
      <div class="icon"><!-- 앱 고유 SVG 아이콘 --></div>
      <h1 class="title">앱 이름</h1>
      <p class="message">이 서비스는 PC 환경에서<br>최적화되어 있습니다.</p>
      <p class="submessage">데스크탑 또는 노트북 브라우저에서<br>접속해 주세요.</p>
      <div class="url-badge">toolzy.site/경로/</div>
    </div>
  </div>
</template>
```

CSS 스타일은 어느 앱이든 동일하게 복사해 사용한다. (`regex-tester/src/components/MobileBlock.vue` 를 레퍼런스로 사용)

---

## 5. Help 모달 패턴

**반드시 `<Teleport to="body">` + `modal-backdrop` 방식을 사용한다.**
헤더 아래에 인라인 패널로 삽입하는 방식은 사용하지 않는다.

### 헤더 버튼

```html
<button class="help-btn" @click="showHelp = true" title="Help">?</button>
```

```css
.help-btn {
  background: transparent;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.help-btn:hover {
  border-color: rgba(167, 139, 250, 0.5);
  color: #a78bfa;
}
```

### 모달 구조

```vue
<Teleport to="body">
  <div v-if="showHelp" class="modal-backdrop" @click.self="showHelp = false">
    <div class="modal">
      <div class="modal-header">
        <h2>앱 이름 — Help</h2>
        <button class="modal-close" @click="showHelp = false">✕</button>
      </div>
      <div class="modal-body">
        <section>
          <h3>섹션 제목</h3>
          <p>설명</p>
          <ul>
            <li><code>값</code> — 설명</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</Teleport>
```

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.modal {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}
.modal-header h2 { font-size: 15px; font-weight: 700; color: #f0f0f5; }
.modal-close {
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.15s;
}
.modal-close:hover { color: #d1d5db; }
.modal-body {
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal-body h3 { font-size: 13px; font-weight: 700; color: #a78bfa; }
.modal-body p, .modal-body li { font-size: 13px; color: #9ca3af; line-height: 1.6; }
.modal-body code {
  font-family: monospace;
  font-size: 12px;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  padding: 1px 5px;
  border-radius: 3px;
}
```

---

## 6. 필드 입력 + 프리셋 드롭다운 패턴

cron-tester에서 확립된 패턴. 여러 개의 구조화된 필드를 입력받는 툴에 적용한다.

### 핵심 아이디어

- 단일 텍스트 입력 대신 **필드별 개별 입력 박스**를 사용한다.
- 각 박스 하단에 `▾` 버튼 → 해당 필드 전용 프리셋 드롭다운.
- 입력 박스들을 조합한 **combined expression**은 하단에 read-only로 표시.

### 데이터 구조

```js
// 필드 메타 정보 (포맷별로 정의)
const formatInfoMap = {
  standard: {
    desc: '포맷 설명',
    fields: [
      { label: '필드명', range: '0–59', placeholder: '0', key: 'fieldKey' },
      // ...
    ],
    defaultFields: ['0', '9', '*', '*', '1'],
  },
}

// 필드별 프리셋 (key로 매핑)
const fieldPresetsData = {
  fieldKey: [
    { value: '*',   label: '설명' },
    { value: '*/5', label: '5마다' },
  ],
}

// 상태
const fieldValues = ref([...formatInfoMap.standard.defaultFields])
const expression = computed(() => fieldValues.value.join(' '))
const openDropdown = ref(-1)
```

### 드롭다운 위치 결정 (화면 밖 잘림 방지)

```js
function dropdownAlign(i) {
  const total = currentFormatInfo.value.fields.length
  if (i >= total - 2) return 'dd-right'
  if (i <= 0) return 'dd-left'
  return 'dd-center'
}
```

### 드롭다운 닫기 (click-outside)

```js
function onDocumentClick() { openDropdown.value = -1 }

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
```

드롭다운 내부 클릭은 `@click.stop`으로 전파를 막고,
항목 선택은 `@mousedown.prevent`를 사용해 input 포커스를 유지한다.

### 템플릿 핵심

```html
<div class="field-box" :class="{ 'dd-open': openDropdown === i }">
  <input v-model="fieldValues[i]" ... />
  <span class="field-name">{{ info.label }}</span>
  <span class="field-range">{{ info.range }}</span>

  <button class="field-dd-btn" @click.stop="toggleDropdown(i)" tabindex="-1">▾</button>

  <div v-if="openDropdown === i" class="field-dropdown" :class="dropdownAlign(i)" @click.stop>
    <button
      v-for="opt in fieldPresetsData[info.key]"
      class="field-dd-item"
      :class="{ active: fieldValues[i] === opt.value }"
      @mousedown.prevent="selectFieldPreset(i, opt.value)"
    >
      <code class="fd-value">{{ opt.value }}</code>
      <span class="fd-label">{{ opt.label }}</span>
    </button>
  </div>
</div>
```

> 레퍼런스 구현: `cron-tester/src/App.vue`

---

## 7. netlify.toml 규칙

모든 앱 설정은 루트 `netlify.toml` 한 곳에서 관리한다.

### 새 앱 추가 시 삽입할 블록

```toml
# landing 캐치-올(/*) 바로 앞에 위치시킬 것

[[redirects]]
  from = "/my-tool"
  to   = "/my-tool/"
  status = 301

[[redirects]]
  from = "/my-tool/*"
  to   = "/my-tool/index.html"
  status = 200
```

### 순서가 중요한 이유

Netlify는 redirects를 **위에서 아래로** 순서대로 평가한다.
landing의 캐치-올 `/* → /index.html` 이 앱별 규칙보다 먼저 있으면 모든 경로가 landing으로 잡힌다.
**앱별 규칙은 반드시 `/*` 캐치-올 앞에** 작성한다.

---

## 8. landing 페이지 카드 추가

**파일**: `landing/src/App.vue`

### 1) screenshots 객체에 키 추가

```js
const screenshots = {
  // ... 기존 항목들
  myTool: '/screenshots/my-tool.jpg',
}
```

스크린샷 파일은 `landing/public/screenshots/` 에 배치.

### 2) 카드 HTML 추가 (cards 섹션 마지막)

```html
<a class="card" href="/my-tool/">
  <div class="card-bg">
    <img v-if="screenshots.myTool" :src="screenshots.myTool" alt="My Tool preview" loading="lazy" />
  </div>
  <div class="card-icon">
    <!-- 앱 테마 SVG 아이콘 (36×36) -->
  </div>
  <div class="card-body">
    <h2 class="card-title">My Tool</h2>
    <p class="card-desc">기능1 · 기능2 · 기능3</p>
    <p class="card-detail">한 줄 설명.</p>
  </div>
  <div class="card-arrow">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  </div>
</a>
```

> 카드에 URL 표기(`toolzy.site/my-tool/`)는 넣지 않는다. (2025-03-18 제거됨)

### 3) 푸터 링크 추가

```html
<span class="sep">·</span>
<a href="/my-tool/">My Tool</a>
```

---

## 9. 새 앱 출시 체크리스트

### 앱 코드

- [ ] `index.html` — `lang="ko"`, title, description, canonical, og tags, JSON-LD (WebApplication)
- [ ] `index.html` — `google-adsense-account` 메타태그
- [ ] `vite.config.js` — `base` 경로가 URL과 일치하는지 확인
- [ ] `App.vue` — `isMobile` 768px 체크
- [ ] `App.vue` — Help 버튼 `?` + Teleport 모달 (§ 5 패턴)
- [ ] `MobileBlock.vue` — 앱 이름, 아이콘, URL 반영

### 모노레포 연결

- [ ] 루트 `package.json` — `workspaces` 배열에 폴더명 추가
- [ ] 루트 `package.json` — `build:all` 스크립트에 추가
- [ ] `scripts/merge-dist.js` — `dist/경로` 매핑 추가
- [ ] `netlify.toml` — 301 리다이렉트 + SPA 캐치-올 추가 (landing `/*` 앞)
- [ ] `npm install` — 워크스페이스 심링크 갱신

### landing 페이지

- [ ] `landing/src/App.vue` — 카드 추가 (§ 8)
- [ ] `landing/src/App.vue` — 푸터 링크 추가
- [ ] `landing/public/screenshots/` — 스크린샷 이미지 추가

### 루트 문서

- [ ] `CLAUDE.md` — 앱 목록 테이블 업데이트
