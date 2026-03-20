<template>
  <MobileBlock v-if="isMobile" />
  <div v-else class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <a href="/" class="logo-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <span class="logo-text">Toolzy</span>
        </a>
        <span class="header-sep">/</span>
        <span class="header-title">nginx Configuration Viewer</span>
      </div>
      <button class="help-btn" @click="showHelp = true" title="Help">?</button>
    </header>

    <!-- Help Modal -->
    <Teleport to="body">
      <div v-if="showHelp" class="modal-backdrop" @click.self="showHelp = false">
        <div class="modal">
          <div class="modal-header">
            <h2>nginx Configuration Viewer — Help</h2>
            <button class="modal-close" @click="showHelp = false">✕</button>
          </div>
          <div class="modal-body">
            <section>
              <h3>사용법</h3>
              <p>nginx.conf를 붙여넣고 Parse &amp; Format을 누르세요.</p>
            </section>
            <section>
              <h3>탭 설명</h3>
              <ul>
                <li><code>Formatted</code> — 들여쓰기/하이라이팅 + 라인 번호</li>
                <li><code>Tree</code> — 블록 구조 탐색 (클릭 시 원본 줄로 이동)</li>
                <li><code>Summary</code> — 핵심 설정 요약</li>
                <li><code>Lint</code> — 오류·경고 목록</li>
                <li><code>Locations</code> — location 우선순위 + URL 매칭 테스트</li>
              </ul>
            </section>
            <section>
              <h3>Locations 탭</h3>
              <ul>
                <li>전역 테스트: <code>https://host/path</code> 입력 → server_name·포트·location 통합 매칭</li>
                <li>서버별 테스트: 각 서버 블록 내 URL 필드에 경로 입력</li>
                <li>location 행 클릭 → 원본 위치로 이동</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Main -->
    <div class="main">
      <!-- Left: Input -->
      <div class="pane pane-left">
        <div class="pane-header">
          <span class="pane-label">nginx.conf</span>
          <div class="sample-dropdown-wrap" ref="sampleWrapRef">
            <button class="btn-ghost sample-btn" @click="toggleSampleMenu">예시 불러오기 ▾</button>
            <div v-if="sampleMenuOpen" class="sample-menu">
              <button
                v-for="s in SAMPLES"
                :key="s.key"
                class="sample-item"
                @click="loadSample(s)"
              >{{ s.label }}</button>
            </div>
          </div>
          <button class="btn-ghost" @click="clearInput" title="지우기">지우기</button>
        </div>
        <textarea
          ref="inputRef"
          v-model="input"
          class="input-area"
          placeholder="여기에 nginx.conf 내용을 붙여넣으세요..."
          spellcheck="false"
        ></textarea>
        <div class="input-footer">
          <button class="btn-primary" @click="run">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Parse &amp; Format
          </button>
          <span v-if="parsed && !error" class="stat-text">{{ nodeCount }} 노드</span>
        </div>
      </div>

      <!-- Right: Output -->
      <div class="pane pane-right">
        <!-- Error -->
        <div v-if="error" class="error-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Tabs -->
        <div v-if="parsed && !error" class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span v-if="tab.badge" class="tab-badge" :class="`tab-badge-${tab.badgeColor}`">{{ tab.badge }}</span>
          </button>
          <div class="tabs-spacer"></div>
          <template v-if="activeTab === 'formatted'">
            <div class="indent-selector">
              <button
                v-for="opt in indentOptions"
                :key="opt.value"
                class="indent-btn"
                :class="{ active: indentStr === opt.value }"
                @click="indentStr = opt.value"
              >{{ opt.label }}</button>
            </div>
            <button class="btn-ghost copy-btn" @click="copyFormatted">
              {{ copied ? '✓ 복사됨' : '복사' }}
            </button>
          </template>
        </div>

        <!-- Placeholder -->
        <div v-if="!parsed && !error" class="placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3a3a4f" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <p>nginx.conf를 붙여넣고<br>Parse &amp; Format을 누르세요</p>
        </div>

        <!-- Formatted Tab -->
        <div v-if="parsed && !error && activeTab === 'formatted'" class="output-area formatted-area">
          <div class="code-with-lines">
            <div v-for="(line, i) in highlightedLines" :key="i" class="code-line">
              <span class="line-num">{{ i + 1 }}</span>
              <span class="line-content" v-html="line"></span>
            </div>
          </div>
        </div>

        <!-- Tree Tab -->
        <div v-if="parsed && !error && activeTab === 'tree'" class="output-area tree-area">
          <TreeNode v-for="(node, i) in ast" :key="i" :node="node" :depth="0" />
        </div>

        <!-- Summary Tab -->
        <div v-if="parsed && !error && activeTab === 'summary'" class="output-area summary-area">
          <SummaryView :summary="summaryData" />
        </div>

        <!-- Lint Tab -->
        <div v-if="parsed && !error && activeTab === 'lint'" class="output-area summary-area">
          <LintView :issues="lintIssues" />
        </div>

        <!-- Locations Tab -->
        <div v-if="parsed && !error && activeTab === 'locations'" class="output-area summary-area">
          <LocationAnalyzer :ast="ast" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import MobileBlock from './components/MobileBlock.vue'
import { parse, format, highlight, summarize } from './utils/nginxParser.js'
import { lint } from './utils/nginxLint.js'
import { SAMPLES } from './utils/nginxSamples.js'
import TreeNode from './components/TreeNode.vue'
import SummaryView from './components/SummaryView.vue'
import LintView from './components/LintView.vue'
import LocationAnalyzer from './components/LocationAnalyzer.vue'

const isMobile = ref(false)
const showHelp = ref(false)
const sampleMenuOpen = ref(false)
const sampleWrapRef = ref(null)
const inputRef = ref(null)
const input = ref('')
const parsed = ref(false)
const error = ref(null)
const ast = ref([])
const summaryData = ref(null)
const lintIssues = ref([])
const activeTab = ref('formatted')
const copied = ref(false)

const indentOptions = [
  { label: '2 spaces', value: '  ' },
  { label: '4 spaces', value: '    ' },
  { label: 'Tab',      value: '\t' },
]
const indentStr = ref('  ')

const formattedCode   = computed(() => ast.value.length ? format(ast.value, indentStr.value) : '')
const highlightedCode = computed(() => ast.value.length ? highlight(ast.value, indentStr.value) : '')
const highlightedLines = computed(() => highlightedCode.value ? highlightedCode.value.split('\n') : [])

function jumpToLine(line) {
  if (!line || !inputRef.value) return
  const textarea = inputRef.value
  const lines = input.value.split('\n')
  let offset = 0
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    offset += lines[i].length + 1
  }
  const endOffset = offset + (lines[line - 1]?.length || 0)
  textarea.focus()
  textarea.setSelectionRange(offset, endOffset)
  const lineHeight = 22
  textarea.scrollTop = Math.max(0, (line - 1) * lineHeight - textarea.clientHeight / 3)
}

provide('jumpToLine', jumpToLine)

const lintErrorCount = computed(() => lintIssues.value.filter(i => i.severity === 'error').length)
const lintWarnCount  = computed(() => lintIssues.value.filter(i => i.severity === 'warning').length)

const tabs = computed(() => [
  { key: 'formatted',  label: 'Formatted' },
  { key: 'tree',       label: 'Tree' },
  { key: 'summary',    label: 'Summary' },
  { key: 'lint',       label: 'Lint', badge: lintErrorCount.value || lintWarnCount.value || null, badgeColor: lintErrorCount.value ? 'error' : 'warning' },
  { key: 'locations',  label: 'Locations' },
])

const nodeCount = computed(() => {
  let n = 0
  const count = (nodes) => {
    for (const node of nodes) {
      n++
      if (node.children) count(node.children)
    }
  }
  count(ast.value)
  return n
})

function run() {
  error.value = null
  parsed.value = false

  const result = parse(input.value)
  if (!result.ok) {
    error.value = result.error
    return
  }

  ast.value = result.ast
  summaryData.value = summarize(result.ast)
  lintIssues.value = lint(result.ast)
  parsed.value = true
}

function clearInput() {
  input.value = ''
  parsed.value = false
  error.value = null
  ast.value = []
  lintIssues.value = []
}

async function copyFormatted() {
  try {
    await navigator.clipboard.writeText(formattedCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

function toggleSampleMenu() {
  sampleMenuOpen.value = !sampleMenuOpen.value
}

function loadSample(s) {
  input.value = s.conf
  sampleMenuOpen.value = false
  run()
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  document.addEventListener('click', (e) => {
    if (sampleWrapRef.value && !sampleWrapRef.value.contains(e.target)) {
      sampleMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f0f13;
  overflow: hidden;
}

/* Header */
.header {
  height: 52px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
  letter-spacing: -0.02em;
}

.header-sep {
  color: #3a3a4f;
  font-size: 16px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #a78bfa;
}

.help-btn {
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-btn:hover { color: #d1d5db; border-color: #3a3a4f; }

/* Main split */
.main {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
}

.pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pane-left {
  width: 40%;
  min-width: 280px;
  border-right: 1px solid #2a2a3a;
}

.pane-right {
  flex: 1;
}

/* Pane header */
.pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.pane-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Input */
.input-area {
  flex: 1;
  resize: none;
  background: #0f0f13;
  color: #d1d5db;
  border: none;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.7;
  padding: 14px;
  overflow: auto;
}

.input-area::placeholder { color: #3a3a4f; }

.input-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #16161d;
  border-top: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.stat-text {
  font-size: 12px;
  color: #6b7280;
}

/* Buttons */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover { background: #6d28d9; }

.btn-ghost {
  background: none;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  color: #6b7280;
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.btn-ghost:hover { color: #d1d5db; border-color: #3a3a4f; }

/* Error */
.error-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 16px;
  padding: 12px 14px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 13px;
  line-height: 1.6;
}

.error-box svg { flex-shrink: 0; margin-top: 1px; color: #ef4444; }

/* Tabs */
.tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 14px 0;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}

.tab:hover { color: #d1d5db; }
.tab.active { color: #a78bfa; border-bottom-color: #a78bfa; }

.tabs-spacer { flex: 1; }

.copy-btn { margin-bottom: 8px; }

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  margin-left: 5px;
}

.tab-badge-error   { background: rgba(239,68,68,0.2);  color: #fca5a5; }
.tab-badge-warning { background: rgba(234,179,8,0.2);  color: #fde68a; }

/* Placeholder */
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #3a3a4f;
  font-size: 14px;
  text-align: center;
  line-height: 1.7;
}

/* Output areas */
.output-area {
  flex: 1;
  overflow: auto;
  padding: 14px;
}

.formatted-area {
  padding: 0;
}

.code-with-lines {
  padding: 14px 0;
  min-height: 100%;
}

.code-line {
  display: flex;
  align-items: baseline;
  line-height: 1.7;
  padding: 0 14px 0 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
}

.code-line:hover { background: rgba(255,255,255,0.025); }

.line-num {
  min-width: 42px;
  padding: 0 12px 0 14px;
  text-align: right;
  color: #3a3a4f;
  font-size: 12px;
  user-select: none;
  flex-shrink: 0;
}

.line-content { flex: 1; white-space: pre; }

.tree-area {
  padding: 10px 14px;
}

.summary-area {
  padding: 14px;
}

/* Indent selector */
.indent-selector {
  display: flex;
  align-items: center;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.indent-btn {
  background: none;
  border: none;
  border-right: 1px solid #2a2a3a;
  color: #6b7280;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 9px;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  white-space: nowrap;
}

.indent-btn:last-child { border-right: none; }
.indent-btn:hover { color: #d1d5db; background: #1c1c26; }
.indent-btn.active { background: #2a2a3a; color: #a78bfa; font-weight: 600; }

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1c1c26;
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  width: 520px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s;
}

.modal-close:hover { color: #d1d5db; }

.modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.7;
}

.modal-body section h3 {
  font-size: 12px;
  font-weight: 700;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 8px;
}

.modal-body p { margin: 0; }

.modal-body ul {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-body code {
  background: #2a2a3a;
  border-radius: 3px;
  padding: 1px 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #c4b5fd;
}

/* Sample dropdown */
.sample-dropdown-wrap {
  position: relative;
}

.sample-btn {
  white-space: nowrap;
}

.sample-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #1c1c26;
  border: 1px solid #2a2a3a;
  border-radius: 7px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 100;
  min-width: 160px;
  overflow: hidden;
}

.sample-item {
  display: block;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #2a2a3a;
  color: #d1d5db;
  font-size: 13px;
  padding: 9px 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
}

.sample-item:last-child { border-bottom: none; }
.sample-item:hover { background: #2a2a3a; color: #a78bfa; }
</style>

<style>
/* Syntax highlight classes — unscoped because injected via v-html */
.code-with-lines .hl-block       { color: #a78bfa; font-weight: 700; }
.code-with-lines .hl-key         { color: #60a5fa; }
.code-with-lines .hl-value       { color: #d1d5db; }
.code-with-lines .hl-param       { color: #c4b5fd; }
.code-with-lines .hl-punct       { color: #4b5563; }
.code-with-lines .hl-comment     { color: #6b7280; font-style: italic; }
.code-with-lines .hl-include-kw  { color: #f59e0b; font-weight: 700; }
.code-with-lines .hl-include-path{ color: #fcd34d; }
.code-with-lines .hl-warn        { color: #f59e0b; font-size: 11px; }
</style>
