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
        <span class="header-title">nginx Viewer</span>
      </div>
      <button class="help-btn" @click="showHelp = !showHelp" title="도움말">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        도움말
      </button>
    </header>

    <!-- Help Banner -->
    <div v-if="showHelp" class="help-banner">
      <strong>사용법:</strong> 왼쪽 텍스트 영역에 nginx.conf 내용을 붙여넣고 <kbd>Parse & Format</kbd> 버튼을 누르세요.
      Formatted(정렬된 코드), Tree(트리 탐색기), Summary(핵심 설정 요약) 탭으로 결과를 확인합니다.
      <button class="help-close" @click="showHelp = false">✕</button>
    </div>

    <!-- Main -->
    <div class="main">
      <!-- Left: Input -->
      <div class="pane pane-left">
        <div class="pane-header">
          <span class="pane-label">nginx.conf</span>
          <button class="btn-ghost" @click="clearInput" title="지우기">지우기</button>
        </div>
        <textarea
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
          <pre class="formatted-code" v-html="highlightedCode"></pre>
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
import { ref, computed, onMounted } from 'vue'
import MobileBlock from './components/MobileBlock.vue'
import { parse, format, highlight, summarize } from './utils/nginxParser.js'
import { lint } from './utils/nginxLint.js'
import TreeNode from './components/TreeNode.vue'
import SummaryView from './components/SummaryView.vue'
import LintView from './components/LintView.vue'
import LocationAnalyzer from './components/LocationAnalyzer.vue'

const isMobile = ref(false)
const showHelp = ref(false)
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

onMounted(() => {
  isMobile.value = window.innerWidth < 768
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
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  color: #6b7280;
  font-size: 13px;
  padding: 5px 10px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.help-btn:hover { color: #d1d5db; border-color: #3a3a4f; }

/* Help Banner */
.help-banner {
  background: rgba(167, 139, 250, 0.08);
  border-bottom: 1px solid rgba(167, 139, 250, 0.2);
  padding: 10px 20px;
  font-size: 13px;
  color: #c4b5fd;
  line-height: 1.6;
  position: relative;
  flex-shrink: 0;
}

.help-banner kbd {
  background: #2a2a3a;
  border: 1px solid #3a3a4f;
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 12px;
  font-family: monospace;
}

.help-close {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}

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

.formatted-code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: #d1d5db;
  white-space: pre;
  padding: 14px;
  min-height: 100%;
}

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
</style>

<style>
/* Syntax highlight classes — unscoped because injected via v-html */
.formatted-code .hl-block       { color: #a78bfa; font-weight: 700; }
.formatted-code .hl-key         { color: #60a5fa; }
.formatted-code .hl-value       { color: #d1d5db; }
.formatted-code .hl-param       { color: #c4b5fd; }
.formatted-code .hl-punct       { color: #4b5563; }
.formatted-code .hl-comment     { color: #6b7280; font-style: italic; }
.formatted-code .hl-include-kw  { color: #f59e0b; font-weight: 700; }
.formatted-code .hl-include-path{ color: #fcd34d; }
.formatted-code .hl-warn        { color: #f59e0b; font-size: 11px; }
</style>
