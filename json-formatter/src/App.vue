<template>
  <MobileBlock v-if="isMobile" />
  <div v-else class="app">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        JSON Formatter
      </div>
      <div class="header-right">
        <span class="header-desc">Format · Validate · Minify</span>
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
          <span v-if="sizeWarning && !error" class="size-warning-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            대용량 파일 — 처리 시 시간이 걸릴 수 있습니다
          </span>
          <span v-if="isOutputLarge" class="size-warning-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            200KB 초과 — 하이라이팅 비활성화됨
          </span>
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
          <button class="btn btn-primary" :disabled="!!error || !input" title="Shift+Alt+F" @click="format">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>
            </svg>
            Format
          </button>
          <button class="btn btn-ghost" :disabled="!!error || !input" title="Ctrl+Shift+M" @click="minify">
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

        <div class="action-divider" />

        <div class="action-group">
          <button class="btn btn-ghost" :class="{ 'btn-error': csvError }" :disabled="!!error || !input" @click="jsonToCsv" title="배열 JSON을 CSV로 변환 (중첩 객체는 dot-notation으로 flatten)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
            </svg>
            {{ csvError ? 'Not Array!' : 'JSON → CSV' }}
          </button>
        </div>

        <div class="action-divider" />

        <div class="action-group">
          <button class="btn btn-ghost" :disabled="!!error || !input" @click="jsonToTs" title="JSON에서 TypeScript interface 자동 생성">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            JSON → TS
          </button>
        </div>

        <div class="action-divider" />

        <div class="action-group">
          <button class="btn btn-ghost" :class="{ 'btn-error': unescapeError }" :disabled="!input" @click="unescapeJson" title="이스케이프된 JSON 문자열을 파싱해 Output에 표시">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="17 8 21 12 17 16"/><line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
            {{ unescapeError ? 'Error!' : 'Unescape' }}
          </button>
          <button class="btn btn-ghost" :disabled="!!error || !input" @click="escapeJson" title="JSON을 이스케이프된 문자열로 변환">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="17 8 21 12 17 16"/><line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
            Escape
          </button>
        </div>
      </div>

      <!-- Output Panel -->
      <div class="panel">
        <div class="panel-header">
          <div class="view-toggle">
            <button class="btn-view-tab" :class="{ active: outputView === 'formatted' }" @click="outputView = 'formatted'">Formatted</button>
            <button class="btn-view-tab" :class="{ active: outputView === 'tree' }" @click="outputView = 'tree'">Tree</button>
            <button v-if="outputFormat === 'csv'" class="btn-view-tab btn-view-csv" :class="{ active: outputView === 'csv' }" @click="outputView = 'csv'">CSV</button>
            <button v-if="outputFormat === 'ts'" class="btn-view-tab btn-view-ts" :class="{ active: outputView === 'ts' }" @click="outputView = 'ts'">TS</button>
          </div>
          <div class="panel-actions">
            <template v-if="outputView === 'tree'">
              <button class="btn btn-ghost" :disabled="!parsedJson" @click="expandAll">Expand All</button>
              <button class="btn btn-ghost" :disabled="!parsedJson" @click="collapseAll">Collapse All</button>
            </template>
            <template v-else-if="outputView === 'csv'">
              <button class="btn btn-ghost" :disabled="!output" title="Ctrl+Shift+S" @click="downloadOutput">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download .csv
              </button>
            </template>
            <template v-else-if="outputView === 'ts'">
              <button class="btn btn-ghost" :disabled="!output" @click="downloadOutput">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download .ts
              </button>
              <button class="btn btn-ghost" :disabled="!output" @click="copyOutput">{{ copied ? 'Copied!' : 'Copy' }}</button>
            </template>
            <template v-else>
              <button class="btn btn-ghost" :disabled="!output" title="Ctrl+Shift+S" @click="downloadOutput">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download
              </button>
              <button class="btn btn-ghost" :disabled="!output" @click="copyOutput">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </template>
          </div>
        </div>

        <!-- Search bar -->
        <div v-show="showSearch" class="search-bar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchTerm"
            class="search-input"
            placeholder="key 또는 value 검색..."
            @keydown.escape="closeSearch"
          />
          <span class="search-count" :class="{ 'no-match': searchTerm && searchResults.length === 0 }">
            {{ searchTerm ? (searchResults.length > 0 ? `${searchResults.length}개` : 'No matches') : '' }}
          </span>
          <button
            v-if="searchTerm && searchResults.length > 0"
            class="btn-show-results"
            :class="{ active: showResults }"
            @click="showResults = !showResults"
          >
            결과보기
            <svg width="10" height="10" viewBox="0 0 10 10" class="arrow-small" :class="{ expanded: showResults }">
              <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="search-close" @click="closeSearch">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Search results panel -->
        <Transition name="results-slide">
          <div v-if="showSearch && showResults && searchResults.length > 0" class="results-panel">
            <div class="results-header">
              <span class="results-title">검색 결과 <span class="results-count">{{ searchResults.length }}</span></span>
              <span class="results-hint">클릭 시 경로 복사</span>
            </div>
            <div class="results-list">
              <div
                v-for="(r, i) in searchResults"
                :key="i"
                class="result-item"
                @click="copyResultPath(r.path)"
              >
                <span class="result-path">{{ r.path }}</span>
                <span class="result-sep">→</span>
                <span class="result-key" :class="{ 'is-match': r.keyMatch }">{{ r.key }}</span>
                <span class="result-colon">:</span>
                <span class="result-value" :class="['rv-' + r.valueType, { 'is-match': r.valueMatch }]">{{ r.displayValue }}</span>
                <Transition name="copied">
                  <span v-if="copiedResultIndex === i" class="result-copied">Copied!</span>
                </Transition>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Formatted View -->
        <div v-if="outputView === 'formatted'" class="output-wrap">
          <template v-if="output">
            <div class="output-editor-wrap">
              <div class="line-numbers output-line-numbers" ref="outputLineNumRef">
                <span v-for="n in outputLineCount" :key="n">{{ n }}</span>
              </div>
              <pre class="output-pre" ref="outputPreRef" @scroll="syncOutputScroll"><code v-if="outputFormat === 'csv'">{{ output }}</code><code v-else v-html="highlightedOutput" /></pre>
            </div>
          </template>
          <div v-else class="output-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <span>Format 또는 Minify를 클릭하면<br>결과가 여기 표시됩니다</span>
          </div>
        </div>

        <!-- Tree View -->
        <div v-else-if="outputView === 'tree'" class="output-wrap tree-wrap">
          <div v-if="parsedJson !== null" class="tree-root">
            <TreeNode :key="treeKey" :value="parsedJson" :depth="0" :initial-expanded="treeInitialExpanded" :search-term="searchTerm" />
          </div>
          <div v-else class="output-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <span>유효한 JSON을 입력하면<br>트리 구조가 표시됩니다</span>
          </div>
        </div>

        <!-- CSV Table View -->
        <div v-if="outputView === 'csv'" class="output-wrap csv-wrap">
          <div v-if="csvData" class="csv-table-container">
            <table class="csv-table">
              <thead>
                <tr>
                  <th class="csv-th-index">#</th>
                  <th v-for="h in csvData.headers" :key="h" class="csv-th">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in csvData.rows" :key="i">
                  <td class="csv-td-index">{{ i + 1 }}</td>
                  <td
                    v-for="h in csvData.headers" :key="h"
                    class="csv-td"
                    :class="getCsvCellClass(row[h])"
                    @click="copyCsvCell(row[h])"
                    :title="String(row[h] ?? '')"
                  >{{ row[h] ?? '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="output-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>JSON → CSV 버튼을 클릭하면<br>테이블이 표시됩니다</span>
          </div>
        </div>

        <!-- TypeScript View -->
        <div v-if="outputView === 'ts'" class="output-wrap">
          <pre class="output-pre" v-if="output"><code class="ts-code">{{ output }}</code></pre>
        </div>

        <div class="status-bar">
          <span class="stat">{{ outputStats }}</span>
          <span v-if="outputView === 'csv' && csvData" class="stat">{{ csvData.rows.length }} rows · {{ csvData.headers.length }} columns</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import TreeNode from './components/TreeNode.vue'
import HelpModal from './components/HelpModal.vue'
import MobileBlock from './components/MobileBlock.vue'

const MOBILE_BREAKPOINT = 768
const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT)

const showHelp         = ref(false)
const showSearch       = ref(false)
const showResults      = ref(false)
const searchTerm       = ref('')
const searchInputRef   = ref(null)
const copiedResultIndex = ref(-1)

const LARGE_INPUT_THRESHOLD  = 500 * 1024  // 500KB — 경고
const HIGHLIGHT_MAX_BYTES    = 200 * 1024  // 200KB — 하이라이팅 비활성화

const input = ref('')
const output = ref('')
const error = ref('')
const indent = ref(2)
const copied = ref(false)
const sizeWarning = ref(false)
const unescapeError = ref(false)
const csvError = ref(false)
const outputFormat = ref('json') // 'json' | 'csv'
const csvData = ref(null) // { headers: [], rows: [] }

// ── Tree View ─────────────────────────────────────────────────────
const outputView        = ref('formatted') // 'formatted' | 'tree'
const treeKey           = ref(0)           // 변경 시 트리 전체 리마운트
const treeInitialExpanded = ref(null)      // null=depth기준, true/false=강제

function expandAll()   { treeInitialExpanded.value = true;  treeKey.value++ }
function collapseAll() { treeInitialExpanded.value = false; treeKey.value++ }

const parsedJson = computed(() => {
  const src = output.value || input.value
  if (!src?.trim()) return null
  try { return JSON.parse(src) } catch { return null }
})
const textareaRef = ref(null)
const lineNumRef = ref(null)
const outputPreRef = ref(null)
const outputLineNumRef = ref(null)

const indentOptions = [
  { label: '2', value: 2 },
  { label: '4', value: 4 },
  { label: 'Tab', value: '\t' },
]

// ── 실시간 유효성 검사 (debounce 300ms) ──────────────────────────
let validationTimer = null
watch(input, (val) => {
  sizeWarning.value = new Blob([val]).size >= LARGE_INPUT_THRESHOLD
  clearTimeout(validationTimer)
  if (!val.trim()) { error.value = ''; return }
  validationTimer = setTimeout(() => {
    try {
      JSON.parse(val)
      error.value = ''
    } catch (e) {
      const msg = e.message.replace(/^JSON\.parse:\s*/i, '').replace(/\s+at\s+.+$/, '')
      error.value = msg.length > 60 ? msg.slice(0, 60) + '…' : msg
    }
  }, 300)
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

// ── 출력 줄 번호 ──────────────────────────────────────────────
const outputLineCount = computed(() => {
  if (!output.value) return 1
  return output.value.split('\n').length
})

function syncOutputScroll() {
  if (outputLineNumRef.value && outputPreRef.value) {
    outputLineNumRef.value.scrollTop = outputPreRef.value.scrollTop
  }
}

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

// ── 검색 ──────────────────────────────────────────────────────
function traverseForResults(val, path, term, results) {
  if (val === null || typeof val !== 'object') return
  const entries = Array.isArray(val)
    ? val.map((v, i) => [i, v])
    : Object.entries(val)
  for (const [k, v] of entries) {
    const childPath = typeof k === 'number'
      ? `${path}[${k}]`
      : /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? `${path}.${k}` : `${path}["${k}"]`
    const t = term.toLowerCase()
    const keyMatch   = String(k).toLowerCase().includes(t)
    const isLeaf     = v === null || typeof v !== 'object'
    const valueMatch = isLeaf && String(v ?? '').toLowerCase().includes(t)
    if (keyMatch || valueMatch) {
      const valueType = v === null ? 'null' : typeof v === 'boolean' ? 'bool' : typeof v === 'number' ? 'num' : Array.isArray(v) ? 'arr' : typeof v === 'object' ? 'obj' : 'str'
      const displayValue = v === null ? 'null'
        : Array.isArray(v) ? `[ ${v.length} items ]`
        : typeof v === 'object' ? `{ ${Object.keys(v).length} keys }`
        : typeof v === 'string' ? `"${v}"` : String(v)
      results.push({ path: childPath, key: String(k), keyMatch, valueMatch, displayValue, valueType })
    }
    traverseForResults(v, childPath, term, results)
  }
}

const searchResults = computed(() => {
  if (!searchTerm.value || !parsedJson.value) return []
  const results = []
  traverseForResults(parsedJson.value, '$', searchTerm.value, results)
  return results
})

function openSearch() {
  showSearch.value = true
  nextTick(() => searchInputRef.value?.focus())
}

function closeSearch() {
  showSearch.value  = false
  showResults.value = false
  searchTerm.value  = ''
}

async function copyResultPath(path) {
  const idx = searchResults.value.findIndex(r => r.path === path)
  try {
    await navigator.clipboard.writeText(path)
    copiedResultIndex.value = idx
    setTimeout(() => { copiedResultIndex.value = -1 }, 1200)
  } catch {}
}

// ── 신택스 하이라이팅 (200KB 초과 시 plain text) ──────────────────
const isOutputLarge = computed(() => new Blob([output.value]).size > HIGHLIGHT_MAX_BYTES)

const highlightedOutput = computed(() => {
  if (!output.value) return ''
  if (isOutputLarge.value) {
    // 대용량: 하이라이팅 없이 HTML 이스케이프만
    const plain = output.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return searchTerm.value
      ? plain.replace(new RegExp(searchTerm.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
          m => `<mark class="search-mark">${m}</mark>`)
      : plain
  }
  let html = highlightJson(output.value)
  if (searchTerm.value) {
    const escaped = searchTerm.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    html = html.replace(
      new RegExp(`(?![^<]*>)(${escaped})`, 'gi'),
      '<mark class="search-mark">$1</mark>'
    )
  }
  return html
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
function resetToJson() {
  outputFormat.value = 'json'
  if (outputView.value === 'csv' || outputView.value === 'ts') outputView.value = 'formatted'
}

function format() {
  if (error.value || !input.value) return
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, indent.value)
    resetToJson()
  } catch {}
}

function minify() {
  if (error.value || !input.value) return
  try {
    output.value = JSON.stringify(JSON.parse(input.value))
    resetToJson()
  } catch {}
}

function sortKeys() {
  if (error.value || !input.value) return
  try {
    output.value = JSON.stringify(sortDeep(JSON.parse(input.value)), null, indent.value)
    resetToJson()
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


// ── 다운로드 ──────────────────────────────────────────────────────
function downloadOutput() {
  if (!output.value) return
  const fmt = outputFormat.value
  const mime = fmt === 'csv' ? 'text/csv' : fmt === 'ts' ? 'text/plain' : 'application/json'
  const ext  = fmt === 'csv' ? 'csv'      : fmt === 'ts' ? 'ts'         : 'json'
  const blob = new Blob([output.value], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `output.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Escape / Unescape ─────────────────────────────────────────────
function unescapeJson() {
  if (!input.value.trim()) return
  try {
    // 입력이 JSON string literal → 내부 값 추출 후 Output에 포맷
    const parsed = JSON.parse(input.value)
    if (typeof parsed === 'string') {
      // 추출된 문자열이 다시 유효한 JSON이면 포맷팅
      try {
        output.value = JSON.stringify(JSON.parse(parsed), null, indent.value)
      } catch {
        output.value = parsed
      }
    } else {
      // 이미 JSON 객체/배열이면 그냥 포맷
      output.value = JSON.stringify(parsed, null, indent.value)
    }
    resetToJson()
  } catch {
    unescapeError.value = true
    setTimeout(() => { unescapeError.value = false }, 1500)
  }
}

function escapeJson() {
  if (error.value || !input.value) return
  output.value = JSON.stringify(input.value)
  resetToJson()
}

// ── JSON → TypeScript ─────────────────────────────────────────
function jsonToTs() {
  if (error.value || !input.value) return
  try {
    const parsed = JSON.parse(input.value)
    const interfaces = []
    inferInterface(parsed, 'Root', interfaces)
    output.value = interfaces.join('\n\n')
    outputFormat.value = 'ts'
    outputView.value = 'ts'
  } catch {}
}

function inferType(val, key, interfaces) {
  if (val === null) return 'null'
  if (typeof val === 'string') return 'string'
  if (typeof val === 'number') return Number.isInteger(val) ? 'number' : 'number'
  if (typeof val === 'boolean') return 'boolean'
  if (Array.isArray(val)) {
    if (val.length === 0) return 'unknown[]'
    const elemType = inferType(val[0], key, interfaces)
    return `${elemType}[]`
  }
  if (typeof val === 'object') {
    const name = toInterfaceName(key)
    inferInterface(val, name, interfaces)
    return name
  }
  return 'unknown'
}

function inferInterface(obj, name, interfaces) {
  if (Array.isArray(obj)) {
    // 배열 최상위인 경우 첫 요소로 추론
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      inferInterface(obj[0], name, interfaces)
    }
    return
  }
  const lines = [`interface ${name} {`]
  for (const [k, v] of Object.entries(obj)) {
    const type = inferType(v, k, interfaces)
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`
    lines.push(`  ${safeKey}: ${type};`)
  }
  lines.push('}')
  // 중복 방지: 같은 이름 interface가 없을 때만 추가
  if (!interfaces.some(i => i.startsWith(`interface ${name} `))) {
    interfaces.push(lines.join('\n'))
  }
}

function toInterfaceName(key) {
  if (typeof key === 'number') return 'Item'
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/[^a-zA-Z0-9]/g, '')
}

// ── JSON → CSV ────────────────────────────────────────────────
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val, fullKey))
    } else if (Array.isArray(val)) {
      acc[fullKey] = val.map(v =>
        v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')
      ).join(';')
    } else {
      acc[fullKey] = val ?? ''
    }
    return acc
  }, {})
}

function csvEscape(val) {
  const str = String(val)
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function jsonToCsv() {
  if (error.value || !input.value) return
  try {
    const parsed = JSON.parse(input.value)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      csvError.value = true
      setTimeout(() => { csvError.value = false }, 1500)
      return
    }
    const rows = parsed.map(item =>
      item !== null && typeof item === 'object' ? flattenObject(item) : { value: item }
    )
    // 모든 row의 키 합집합 (순서 유지)
    const headers = [...new Set(rows.flatMap(r => Object.keys(r)))]
    const lines = [
      headers.map(csvEscape).join(','),
      ...rows.map(row => headers.map(h => csvEscape(row[h] ?? '')).join(','))
    ]
    output.value = lines.join('\n')
    outputFormat.value = 'csv'
    csvData.value = { headers, rows }
    outputView.value = 'csv'
  } catch {
    csvError.value = true
    setTimeout(() => { csvError.value = false }, 1500)
  }
}

function getCsvCellClass(val) {
  if (val === null || val === undefined || val === '') return 'v-empty'
  if (val === true || val === false) return 'v-bool'
  if (typeof val === 'number') return 'v-num'
  return ''
}

async function copyCsvCell(val) {
  try { await navigator.clipboard.writeText(String(val ?? '')) } catch {}
}

// ── 키보드 단축키 ─────────────────────────────────────────────────
function onKeydown(e) {
  const mod = e.ctrlKey || e.metaKey
  // Shift+Alt+F → Format
  if (e.shiftKey && e.altKey && e.key === 'F') { e.preventDefault(); format(); return }
  // Ctrl/Cmd+Shift+M → Minify
  if (mod && e.shiftKey && e.key === 'M') { e.preventDefault(); minify(); return }
  // Ctrl/Cmd+Shift+S → Download
  if (mod && e.shiftKey && e.key === 'S') { e.preventDefault(); downloadOutput(); return }
  // Ctrl/Cmd+F → Search
  if (mod && e.key === 'f') { e.preventDefault(); showSearch.value ? searchInputRef.value?.focus() : openSearch(); return }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

function loadSample() {
  input.value = JSON.stringify({
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "age": 28,
    "verified": true,
    "nickname": null,
    "address": {
      "street": "123 Lorem Street",
      "city": "Ipsum City",
      "country": "KR",
      "zipcode": "06234"
    },
    "tags": ["developer", "designer", "open-source"],
    "scores": [98, 87, 73, 100],
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "ko"
    },
    "createdAt": "2024-01-15T09:30:00Z"
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

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-desc {
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.btn-help {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid #2a2a3a;
  border-radius: 7px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.btn-help:hover { color: #a78bfa; border-color: rgba(167, 139, 250, 0.4); }

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

.view-toggle {
  display: flex;
  gap: 2px;
  background: #0f0f13;
  border: 1px solid #2a2a3a;
  border-radius: 7px;
  padding: 2px;
}

.btn-view-tab {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-view-tab:hover  { color: #c4b5fd; }
.btn-view-tab.active { background: #a78bfa; color: #0f0f13; }

.tree-wrap { padding: 8px 0; }
.output-wrap.tree-wrap { overflow: auto; }

.tree-root { padding: 6px 4px; }

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
  overflow: hidden;
  background: #0f0f13;
  display: flex;
  flex-direction: column;
}

.output-editor-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
  background: #0f0f13;
}

.output-line-numbers {
  border-right: 1px solid #2a2a3a;
}

.output-pre {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 22px;
  white-space: pre;
  overflow: auto;
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

.size-warning-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #f59e0b;
  font-family: ui-monospace, monospace;
  white-space: nowrap;
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

.action-divider {
  width: 100%;
  height: 1px;
  background: #2a2a3a;
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

.btn-error {
  color: #f87171 !important;
  border-color: rgba(248, 113, 113, 0.4) !important;
}

.hidden-input {
  display: none;
}

/* ── Search bar ──────────────────────────────────────────────── */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #13131a;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.search-icon { color: #6b7280; flex-shrink: 0; }

.search-input {
  flex: 1;
  background: #0f0f13;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: #d1d5db;
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus { border-color: rgba(167, 139, 250, 0.5); }
.search-input::placeholder { color: #4b4b6a; }

.search-count {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
  font-family: ui-monospace, monospace;
  min-width: 80px;
}
.search-count.no-match { color: #f87171; }

.search-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.15s;
  flex-shrink: 0;
}
.search-close:hover { color: #e0e0e0; }

:deep(.search-mark) {
  background: rgba(251, 191, 36, 0.3);
  color: #fcd34d;
  border-radius: 2px;
  padding: 0 1px;
}

.btn-show-results {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 5px;
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
}
.btn-show-results:hover,
.btn-show-results.active { background: rgba(167, 139, 250, 0.2); border-color: rgba(167, 139, 250, 0.6); }

.arrow-small { transition: transform 0.15s; transform: rotate(-90deg); }
.arrow-small.expanded { transform: rotate(0deg); }

/* ── Results panel ───────────────────────────────────────────── */
.results-panel {
  flex-shrink: 0;
  height: 220px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #2a2a3a;
  background: #0d0d11;
  overflow: hidden;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #13131a;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.results-title {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.results-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 5px;
  margin-left: 6px;
  background: rgba(167, 139, 250, 0.15);
  border-radius: 8px;
  font-size: 10px;
  color: #a78bfa;
}

.results-hint {
  font-size: 10px;
  color: #4b4b6a;
}

.results-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.result-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 5px 14px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.1s;
  white-space: nowrap;
  overflow: hidden;
}
.result-item:hover { background: rgba(255,255,255,0.04); }

.result-path {
  color: #4b5563;
  font-size: 11px;
  flex-shrink: 0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-sep { color: #3a3a52; font-size: 10px; flex-shrink: 0; }

.result-key  { color: #93c5fd; flex-shrink: 0; }
.result-key.is-match { color: #fcd34d; background: rgba(251,191,36,0.15); border-radius: 3px; padding: 0 3px; }

.result-colon { color: #4b5563; flex-shrink: 0; }

.result-value { color: #d1d5db; overflow: hidden; text-overflow: ellipsis; }
.result-value.is-match { color: #fcd34d; background: rgba(251,191,36,0.15); border-radius: 3px; padding: 0 3px; }
.rv-str  { color: #86efac; }
.rv-num  { color: #fbbf24; }
.rv-bool { color: #f472b6; }
.rv-null { color: #a1a1b5; }
.rv-arr, .rv-obj { color: #6b7280; font-style: italic; }

.result-copied {
  margin-left: 6px;
  font-size: 10px;
  color: #4ade80;
  font-family: sans-serif;
  flex-shrink: 0;
}

.results-slide-enter-active, .results-slide-leave-active { transition: height 0.2s ease, opacity 0.2s; overflow: hidden; }
.results-slide-enter-from, .results-slide-leave-to { height: 0 !important; opacity: 0; }

/* ── CSV Table ───────────────────────────────────────────────── */
.csv-wrap { padding: 0; }

.csv-table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.csv-table {
  border-collapse: collapse;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  white-space: nowrap;
  min-width: 100%;
}

.csv-th-index,
.csv-td-index {
  width: 40px;
  min-width: 40px;
  text-align: center;
  color: #5c5c80;
  background: #13131a;
  border-right: 1px solid #2a2a3a;
  user-select: none;
  position: sticky;
  left: 0;
  z-index: 1;
}

.csv-th {
  padding: 8px 14px;
  background: #16161d;
  color: #a78bfa;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.04em;
  border-bottom: 2px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
  position: sticky;
  top: 0;
  z-index: 2;
  white-space: nowrap;
}

.csv-th-index {
  top: 0;
  z-index: 3;
  border-bottom: 2px solid #2a2a3a;
  font-size: 11px;
  padding: 8px 4px;
}

.csv-td {
  padding: 6px 14px;
  color: #d1d5db;
  border-bottom: 1px solid #1e1e2a;
  border-right: 1px solid #1e1e2a;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: background 0.1s;
}

.csv-td-index {
  padding: 6px 4px;
  border-bottom: 1px solid #1e1e2a;
  font-size: 11px;
}

.csv-table tbody tr:hover .csv-td { background: rgba(255,255,255,0.03); }
.csv-table tbody tr:hover .csv-td-index { background: #16161d; }

.csv-td.v-bool  { color: #f472b6; }
.csv-td.v-num   { color: #fbbf24; }
.csv-td.v-empty { color: #3a3a52; }

.btn-view-csv { color: #4ade80 !important; }
.btn-view-csv.active { background: #4ade80 !important; color: #0f0f13 !important; }

.btn-view-ts { color: #60a5fa !important; }
.btn-view-ts.active { background: #60a5fa !important; color: #0f0f13 !important; }

.ts-code {
  display: block;
  color: #d1d5db;
  white-space: pre;
}
</style>
