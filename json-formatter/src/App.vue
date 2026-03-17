<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        JSON Formatter
      </div>
      <span class="header-desc">Format · Validate · Minify</span>
    </header>

    <!-- Workspace -->
    <div class="workspace">
      <!-- Input Panel -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Input</span>
          <div class="panel-actions">
            <label class="btn btn-ghost" title="JSON 파일 업로드">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
              <input type="file" accept=".json,application/json" class="hidden-input" @change="onUpload" />
            </label>
            <button class="btn btn-ghost" title="예제 JSON 불러오기" @click="loadSample">Sample</button>
            <button class="btn btn-ghost" title="입력 지우기" @click="clearInput">Clear</button>
          </div>
        </div>

        <div class="editor-wrap">
          <div class="line-numbers" ref="lineNumRef">
            <span v-for="n in inputLineCount" :key="n">{{ n }}</span>
          </div>
          <textarea
            ref="textareaRef"
            class="editor-textarea"
            v-model="input"
            placeholder='{"key": "value"} 를 붙여넣거나 위의 Upload를 클릭하세요'
            spellcheck="false"
            autocomplete="off"
            @scroll="syncScroll"
          />
        </div>

        <div class="status-bar">
          <span class="stat">{{ inputStats }}</span>
          <span v-if="error" class="error-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
            {{ error }}
          </span>
          <span v-else-if="input" class="valid-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Valid JSON
          </span>
        </div>
      </div>

      <!-- Center controls -->
      <div class="center-controls">
        <div class="indent-group">
          <span class="indent-label">Indent</span>
          <div class="indent-btns">
            <button
              v-for="opt in indentOptions" :key="opt.value"
              class="btn-indent"
              :class="{ active: indent === opt.value }"
              @click="indent = opt.value"
            >{{ opt.label }}</button>
          </div>
        </div>

        <div class="action-group">
          <button class="btn btn-primary" :disabled="!!error || !input" @click="format">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>
            </svg>
            Format
          </button>
          <button class="btn btn-ghost" :disabled="!!error || !input" @click="minify">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="7 8 3 12 7 16"/><polyline points="17 8 21 12 17 16"/><line x1="14" y1="4" x2="10" y2="20"/>
            </svg>
            Minify
          </button>
          <button class="btn btn-ghost" :disabled="!!error || !input" @click="sortKeys">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Sort Keys
          </button>
        </div>
      </div>

      <!-- Output Panel -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Output</span>
          <div class="panel-actions">
            <button class="btn btn-ghost" :disabled="!output" @click="copyOutput">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <div class="output-wrap">
          <pre class="output-pre" v-if="output"><code v-html="highlightedOutput" /></pre>
          <div v-else class="output-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <span>Format 또는 Minify를 클릭하면<br>결과가 여기 표시됩니다</span>
          </div>
        </div>

        <div class="status-bar">
          <span class="stat">{{ outputStats }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')
const indent = ref(2)
const copied = ref(false)
const textareaRef = ref(null)
const lineNumRef = ref(null)

const indentOptions = [
  { label: '2', value: 2 },
  { label: '4', value: 4 },
  { label: 'Tab', value: '\t' },
]

// ── 실시간 유효성 검사 ────────────────────────────────────────────
watch(input, (val) => {
  if (!val.trim()) { error.value = ''; return }
  try {
    JSON.parse(val)
    error.value = ''
  } catch (e) {
    // "JSON.parse: ..." 또는 "Unexpected token..." 형태에서 간결하게 추출
    const msg = e.message.replace(/^JSON\.parse:\s*/i, '').replace(/\s+at\s+.+$/, '')
    error.value = msg.length > 60 ? msg.slice(0, 60) + '…' : msg
  }
})

// ── 줄 번호 ──────────────────────────────────────────────────────
const inputLineCount = computed(() => {
  if (!input.value) return 1
  return input.value.split('\n').length
})

function syncScroll() {
  if (lineNumRef.value && textareaRef.value) {
    lineNumRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

// ── 입력 stats ───────────────────────────────────────────────────
const inputStats = computed(() => {
  if (!input.value) return '0 B'
  const lines = input.value.split('\n').length
  const bytes = new Blob([input.value]).size
  return `${lines} lines · ${formatBytes(bytes)}`
})

// ── 출력 stats ───────────────────────────────────────────────────
const outputStats = computed(() => {
  if (!output.value) return ''
  const lines = output.value.split('\n').length
  const bytes = new Blob([output.value]).size
  return `${lines} lines · ${formatBytes(bytes)}`
})

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── 신택스 하이라이팅 ─────────────────────────────────────────────
const highlightedOutput = computed(() => {
  if (!output.value) return ''
  return highlightJson(output.value)
})

function highlightJson(json) {
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        return /:$/.test(match)
          ? `<span class="hl-key">${match}</span>`
          : `<span class="hl-str">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="hl-bool">${match}</span>`
      if (/null/.test(match))        return `<span class="hl-null">${match}</span>`
      return `<span class="hl-num">${match}</span>`
    }
  )
}

// ── 액션 ─────────────────────────────────────────────────────────
function format() {
  if (error.value || !input.value) return
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, indent.value)
  } catch {}
}

function minify() {
  if (error.value || !input.value) return
  try {
    output.value = JSON.stringify(JSON.parse(input.value))
  } catch {}
}

function sortKeys() {
  if (error.value || !input.value) return
  try {
    output.value = JSON.stringify(sortDeep(JSON.parse(input.value)), null, indent.value)
  } catch {}
}

function sortDeep(val) {
  if (Array.isArray(val)) return val.map(sortDeep)
  if (val !== null && typeof val === 'object') {
    return Object.keys(val).sort().reduce((acc, k) => {
      acc[k] = sortDeep(val[k])
      return acc
    }, {})
  }
  return val
}

function clearInput() {
  input.value = ''
  output.value = ''
  error.value = ''
}

async function copyOutput() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1800)
}

function onUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target.result }
  reader.readAsText(file)
  e.target.value = ''
}

function loadSample() {
  input.value = JSON.stringify({
    name: "3D Viewer",
    version: "1.0.0",
    features: ["STL", "OBJ", "GLTF", "GLB"],
    settings: {
      maxFileSize: "500MB",
      darkMode: true,
      autoRotate: false
    },
    stats: {
      users: 1024,
      rating: 4.9
    }
  }, null, 2)
  output.value = ''
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ── Header ──────────────────────────────────────────────────── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #a78bfa;
}

.header-desc {
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.05em;
}

/* ── Workspace ───────────────────────────────────────────────── */
.workspace {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
  gap: 0;
  overflow: hidden;
}

/* ── Panel ───────────────────────────────────────────────────── */
.panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 40px;
  background: #13131a;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── Editor ──────────────────────────────────────────────────── */
.editor-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
  background: #0f0f13;
}

.line-numbers {
  width: 44px;
  flex-shrink: 0;
  padding: 14px 0;
  overflow: hidden;
  background: #13131a;
  border-right: 1px solid #2a2a3a;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.line-numbers span {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 22px;
  padding-right: 10px;
  color: #5c5c80;
  user-select: none;
  display: block;
}

.editor-textarea {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 22px;
  color: #d1d5db;
  caret-color: #a78bfa;
  tab-size: 2;
  overflow-y: auto;
}

.editor-textarea::placeholder {
  color: #555570;
}

/* ── Output ──────────────────────────────────────────────────── */
.output-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #0f0f13;
}

.output-pre {
  margin: 0;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 22px;
  white-space: pre;
  counter-reset: line;
}

.output-pre code {
  display: block;
}

.output-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #5c5c80;
  font-size: 13px;
  line-height: 1.8;
  text-align: center;
}

/* ── Syntax highlight ────────────────────────────────────────── */
:deep(.hl-key)  { color: #93c5fd; }
:deep(.hl-str)  { color: #86efac; }
:deep(.hl-num)  { color: #fbbf24; }
:deep(.hl-bool) { color: #f472b6; }
:deep(.hl-null) { color: #a1a1b5; }

/* ── Status bar ──────────────────────────────────────────────── */
.status-bar {
  height: 28px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #13131a;
  border-top: 1px solid #2a2a3a;
  flex-shrink: 0;
  overflow: hidden;
}

.stat {
  font-size: 11px;
  color: #6b7280;
  font-family: ui-monospace, monospace;
}

.error-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #f87171;
  font-family: ui-monospace, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.valid-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #4ade80;
}

/* ── Center controls ─────────────────────────────────────────── */
.center-controls {
  width: 132px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 8px;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
  background: #13131a;
}

.indent-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.indent-label {
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.indent-btns {
  display: flex;
  width: 100%;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  overflow: hidden;
}

.btn-indent {
  flex: 1;
  padding: 6px 0;
  background: transparent;
  border: none;
  border-right: 1px solid #2a2a3a;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-indent:last-child { border-right: none; }
.btn-indent:hover { background: rgba(167, 139, 250, 0.08); color: #c4b5fd; }
.btn-indent.active { background: rgba(167, 139, 250, 0.15); color: #a78bfa; }

.action-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* ── Buttons ─────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-primary {
  background: #a78bfa;
  color: #0f0f13;
  border-color: #a78bfa;
  width: 100%;
}
.btn-primary:not(:disabled):hover {
  background: #c4b5fd;
  border-color: #c4b5fd;
}

.btn-ghost {
  background: transparent;
  color: #9ca3af;
  border-color: #2a2a3a;
}
.btn-ghost:not(:disabled):hover {
  color: #c4b5fd;
  border-color: rgba(167, 139, 250, 0.4);
  background: rgba(167, 139, 250, 0.06);
}

.btn-ghost.action-group .btn {
  width: 100%;
}

.action-group .btn {
  width: 100%;
}

.hidden-input {
  display: none;
}
</style>
