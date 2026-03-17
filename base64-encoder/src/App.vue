<template>
  <NotFoundPage v-if="isNotFound" />
  <div v-else class="app">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Base64 Encoder
      </div>
      <div class="header-right">
        <span class="header-desc">Base64 · URL · Image</span>
        <button class="btn-help" title="도움말" @click="showHelp = true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </button>
      </div>
    </header>

    <HelpModal v-model="showHelp" />

    <!-- Mode Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: mode === tab.id }"
        @click="switchMode(tab.id)"
      >{{ tab.label }}</button>
    </div>

    <!-- Variant Bar (Base64 모드 전용) -->
    <div v-if="mode === 'base64'" class="variant-bar">
      <span class="variant-label">Variant</span>
      <div class="variant-btns">
        <button
          v-for="v in variants"
          :key="v.id"
          class="variant-btn"
          :class="{ active: variant === v.id }"
          :title="v.desc"
          @click="switchVariant(v.id)"
        >{{ v.label }}</button>
      </div>
      <span class="variant-desc">{{ currentVariantDesc }}</span>
    </div>

    <!-- Main: workspace + ad sidebar -->
    <main class="main">
    <div class="workspace">
      <!-- Image Mode -->
      <template v-if="mode === 'image'">
        <div class="panel image-upload-panel" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
          <div class="panel-header">
            <span class="panel-title">Image Input</span>
            <div class="panel-actions">
              <label class="btn btn-ghost" title="이미지 파일 업로드">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload
                <input type="file" accept="image/*" style="display:none" @change="onFileInput" />
              </label>
              <button class="btn btn-ghost" title="초기화" @click="clearAll">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.8"/>
                </svg>
                Clear
              </button>
            </div>
          </div>
          <div class="drop-zone" :class="{ dragging: isDragging, 'has-image': imagePreview }">
            <div v-if="!imagePreview" class="drop-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>이미지를 드래그하거나 Upload 버튼을 클릭하세요</span>
              <span class="drop-hint">PNG · JPG · GIF · WebP · SVG</span>
            </div>
            <img v-else :src="imagePreview" alt="preview" class="image-preview" />
          </div>
          <div class="panel-status">
            <span v-if="imageFile">{{ imageFile.name }} · {{ formatBytes(imageFile.size) }}</span>
            <span v-else class="status-muted">파일 없음</span>
          </div>
        </div>

        <div class="action-col">
          <button class="btn-action" :disabled="!output" @click="copyOutput" title="Ctrl+Enter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </button>
          <button class="btn-action" :disabled="!output" @click="downloadOutput('image.txt')" title="다운로드">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
        </div>

        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Base64 Output</span>
            <div class="panel-actions">
              <button class="btn btn-ghost" :disabled="!output" @click="copyOutput" title="복사">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
          </div>
          <textarea
            class="editor"
            :value="output"
            readonly
            placeholder="Base64 문자열이 여기에 출력됩니다..."
          />
          <div class="panel-status">
            <span v-if="output">{{ formatBytes(output.length) }} · {{ output.length.toLocaleString() }} chars</span>
            <span v-else class="status-muted">출력 없음</span>
            <span v-if="copied" class="copied-badge">Copied!</span>
          </div>
        </div>
      </template>

      <!-- Base64 / URL Modes -->
      <template v-else>
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Input</span>
            <div class="panel-actions">
              <button class="btn btn-ghost" title="초기화" @click="clearAll">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.8"/>
                </svg>
                Clear
              </button>
            </div>
          </div>
          <textarea
            ref="inputRef"
            v-model="input"
            class="editor"
            :placeholder="inputPlaceholder"
            @keydown="onKeydown"
            spellcheck="false"
          />
          <div class="panel-status">
            <span v-if="input">{{ formatBytes(input.length) }} · {{ input.length.toLocaleString() }} chars</span>
            <span v-else class="status-muted">입력 없음</span>
          </div>
        </div>

        <div class="action-col">
          <button class="btn-action" @click="encode" title="Ctrl+Enter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Encode
          </button>
          <button class="btn-action" @click="decode" title="Ctrl+Shift+Enter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
            </svg>
            Decode
          </button>
          <button class="btn-action btn-swap" title="입출력 바꾸기" @click="swap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Swap
          </button>
        </div>

        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Output</span>
            <div class="panel-actions">
              <button class="btn btn-ghost" :disabled="!output" @click="downloadOutput('output.txt')" title="다운로드">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
              <button class="btn btn-ghost" :disabled="!output" @click="copyOutput" title="복사">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
          </div>
          <div v-if="error" class="output-error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p class="output-error-msg">{{ error }}</p>
            <p class="output-error-hint">{{ errorHint }}</p>
          </div>
          <textarea
            v-else
            class="editor"
            :value="output"
            readonly
            :placeholder="outputPlaceholder"
            spellcheck="false"
          />
          <div class="panel-status">
            <span v-if="output">{{ formatBytes(output.length) }} · {{ output.length.toLocaleString() }} chars</span>
            <span v-else class="status-muted">출력 없음</span>
            <span v-if="copied" class="copied-badge">Copied!</span>
          </div>
        </div>
      </template>
    </div>

    <aside class="ad-sidebar">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-1253318658034453"
           data-ad-slot="auto"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NotFoundPage from './pages/NotFoundPage.vue'
import HelpModal from './components/HelpModal.vue'

const isNotFound = ref(false)
const isMobile = ref(false)
const showHelp = ref(false)

const tabs = [
  { id: 'base64', label: 'Base64' },
  { id: 'url', label: 'URL' },
  { id: 'image', label: 'Image → Base64' },
]

const mode = ref('base64')
const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)
const inputRef = ref(null)

// Base64 variants
const variant = ref('standard')
const variants = [
  { id: 'standard',   label: 'Standard',   desc: 'RFC 4648 §4 — +, /, = padding' },
  { id: 'base64url',  label: 'Base64url',   desc: 'RFC 4648 §5 — -, _, no padding (JWT, OAuth)' },
  { id: 'no-padding', label: 'No Padding',  desc: 'Standard chars without = padding' },
  { id: 'mime',       label: 'MIME',        desc: 'RFC 2045 — line break every 76 chars (email)' },
]

const currentVariantDesc = computed(() =>
  variants.find(v => v.id === variant.value)?.desc ?? ''
)

function switchVariant(id) {
  variant.value = id
  output.value = ''
  error.value = ''
}

// Apply variant transform to a standard base64 string (encode path)
function applyVariant(b64) {
  switch (variant.value) {
    case 'base64url':
      return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    case 'no-padding':
      return b64.replace(/=/g, '')
    case 'mime':
      return b64.match(/.{1,76}/g).join('\r\n')
    default:
      return b64
  }
}

// Normalize variant input back to standard base64 (decode path)
function normalizeToStandard(s) {
  switch (variant.value) {
    case 'base64url':
      s = s.replace(/-/g, '+').replace(/_/g, '/')
      break
    case 'mime':
      s = s.replace(/\s/g, '')
      break
    case 'no-padding':
      s = s.replace(/\s/g, '')
      break
    default:
      s = s.trim()
      break
  }
  // Re-add padding if needed
  const rem = s.length % 4
  if (rem) s += '='.repeat(4 - rem)
  return s
}

// Image mode
const imageFile = ref(null)
const imagePreview = ref(null)
const isDragging = ref(false)

const errorHint = computed(() => {
  switch (error.value) {
    case '유효하지 않은 Base64':
      return 'Variant 설정이 입력값과 일치하는지 확인하세요. (예: Base64url 문자열은 Base64url 모드로 디코딩)'
    case '유효하지 않은 URL 인코딩':
      return '% 뒤에 유효한 16진수 두 자리가 오는지 확인하세요.'
    case '인코딩 실패':
      return '입력값에 인코딩할 수 없는 문자가 포함되어 있습니다.'
    default:
      return '입력값을 확인한 후 다시 시도해주세요.'
  }
})

const inputPlaceholder = computed(() => {
  if (mode.value === 'base64') return '텍스트를 입력하세요 (한글 지원)...'
  return 'URL을 입력하세요...'
})

const outputPlaceholder = computed(() => {
  if (mode.value === 'base64') return 'Base64 결과가 여기에 출력됩니다...'
  return 'URL 인코딩/디코딩 결과가 출력됩니다...'
})

function switchMode(newMode) {
  mode.value = newMode
  clearAll()
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
  imageFile.value = null
  imagePreview.value = null
  isDragging.value = false
}

// Base64
function encode() {
  error.value = ''
  if (!input.value) return
  try {
    if (mode.value === 'base64') {
      const standard = btoa(unescape(encodeURIComponent(input.value)))
      output.value = applyVariant(standard)
    } else {
      output.value = encodeURIComponent(input.value)
    }
  } catch (e) {
    error.value = '인코딩 실패'
  }
}

function decode() {
  error.value = ''
  if (!input.value) return
  try {
    if (mode.value === 'base64') {
      const standard = normalizeToStandard(input.value)
      output.value = decodeURIComponent(escape(atob(standard)))
    } else {
      output.value = decodeURIComponent(input.value)
    }
  } catch (e) {
    error.value = mode.value === 'base64' ? '유효하지 않은 Base64' : '유효하지 않은 URL 인코딩'
  }
}

function swap() {
  const tmp = input.value
  input.value = output.value
  output.value = tmp
  error.value = ''
}

// Image → Base64
function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

function onFileInput(e) {
  const file = e.target.files[0]
  if (file) processImage(file)
}

function processImage(file) {
  imageFile.value = file
  error.value = ''
  output.value = ''
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    output.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Utilities
function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function downloadOutput(filename) {
  if (!output.value) return
  const blob = new Blob([output.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function onKeydown(e) {
  if (e.key === 'Enter' && e.ctrlKey && e.shiftKey) {
    e.preventDefault()
    decode()
  } else if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault()
    encode()
  }
}

onMounted(() => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  isNotFound.value = path !== '/'

  isMobile.value = window.innerWidth < 768

  // AdSense (사이드바가 표시되는 데스크탑에서만 로드)
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
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  background: #0f0f13;
}

/* Header */
.header {
  height: 48px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
  letter-spacing: -0.01em;
}

.logo svg { color: #a78bfa; }

.header-right { display: flex; align-items: center; gap: 12px; }

.header-desc {
  font-size: 12px;
  color: #6b7280;
}

.btn-help {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.btn-help:hover {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.3);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 2px;
  padding: 8px 16px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.tab {
  padding: 6px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.tab:hover { color: #e0e0e0; background: #1e1e2a; }

.tab.active {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.3);
}

/* Variant Bar */
.variant-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  background: #0f0f13;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.variant-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}

.variant-btns {
  display: flex;
  gap: 4px;
}

.variant-btn {
  padding: 3px 12px;
  border-radius: 4px;
  border: 1px solid #2a2a3a;
  background: transparent;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.variant-btn:hover { color: #e0e0e0; background: #1e1e2a; }

.variant-btn.active {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.3);
}

.variant-desc {
  font-size: 11px;
  color: #3a3a4f;
  font-family: monospace;
  margin-left: 4px;
}

/* Main layout */
.main {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Workspace */
.workspace {
  display: flex;
  flex: 1;
  gap: 0;
  min-height: 0;
  overflow: hidden;
}

/* Output error */
.output-error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  background: #0f0f13;
  color: #f87171;
  text-align: center;
}

.output-error-msg {
  font-size: 14px;
  font-weight: 600;
  color: #f87171;
}

.output-error-hint {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
  max-width: 280px;
}

/* Ad sidebar */
.ad-sidebar {
  width: 300px;
  flex-shrink: 0;
  background: #16161d;
  border-left: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Panel */
.panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  border-right: 1px solid #2a2a3a;
}

.panel:last-child { border-right: none; }

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Editor */
.editor {
  flex: 1;
  width: 100%;
  background: #0f0f13;
  color: #e0e0e0;
  border: none;
  outline: none;
  resize: none;
  padding: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  min-height: 0;
}

.editor::placeholder { color: #3a3a4f; }
.editor[readonly] { color: #c4b5fd; }

/* Status bar */
.panel-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px;
  background: #16161d;
  border-top: 1px solid #2a2a3a;
  font-size: 11px;
  color: #6b7280;
  flex-shrink: 0;
  min-height: 28px;
}

.status-muted { color: #3a3a4f; }

.copied-badge {
  margin-left: auto;
  color: #4ade80;
  font-weight: 600;
}

/* Action column */
.action-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 10px;
  background: #13131a;
  border-right: 1px solid #2a2a3a;
  flex-shrink: 0;
  width: 90px;
}

.btn-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 8px;
  width: 72px;
  background: #1e1e2a;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  color: #a78bfa;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
}

.btn-action:hover {
  background: rgba(167, 139, 250, 0.12);
  border-color: rgba(167, 139, 250, 0.4);
  transform: translateY(-1px);
}

.btn-action:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

.btn-swap {
  color: #6b7280;
  margin-top: 4px;
}

.btn-swap:hover { color: #a78bfa; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 5px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
  border-color: transparent;
}

.btn-ghost:hover {
  background: #1e1e2a;
  color: #e0e0e0;
  border-color: #2a2a3a;
}

.btn-ghost:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Image upload panel */
.image-upload-panel {
  max-width: 380px;
  flex: none;
  width: 380px;
}

.drop-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f0f13;
  border: 2px dashed #2a2a3a;
  margin: 10px;
  border-radius: 8px;
  transition: border-color 0.15s;
  overflow: hidden;
  min-height: 200px;
}

.drop-zone.dragging {
  border-color: #a78bfa;
  background: rgba(167, 139, 250, 0.04);
}

.drop-zone.has-image {
  border-style: solid;
  border-color: #2a2a3a;
  margin: 0;
  border-radius: 0;
}

.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  padding: 24px;
}

.drop-hint {
  font-size: 11px;
  color: #3a3a4f;
  font-family: monospace;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .ad-sidebar { display: none; }

  .workspace {
    flex-direction: column;
    overflow: auto;
    min-height: 0;
  }

  .panel {
    border-right: none;
    border-bottom: 1px solid #2a2a3a;
    min-height: 240px;
    flex: none;
  }

  .panel:last-child { border-bottom: none; }

  .action-col {
    flex-direction: row;
    width: 100%;
    border-right: none;
    border-top: 1px solid #2a2a3a;
    border-bottom: 1px solid #2a2a3a;
    padding: 8px 12px;
    justify-content: center;
  }

  .btn-action {
    flex-direction: row;
    width: auto;
    padding: 8px 14px;
  }

  .image-upload-panel {
    max-width: 100%;
    width: 100%;
  }

  .editor { min-height: 180px; }

  .header-desc { display: none; }

  .variant-desc { display: none; }
}
</style>
