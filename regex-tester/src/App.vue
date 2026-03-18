<template>
  <MobileBlock v-if="isMobile" />

  <div v-else class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 3L8 21"/>
            <path d="M16 3l-2 18"/>
            <path d="M3 9h18"/>
            <path d="M3 15h18"/>
          </svg>
        </div>
        <span class="header-title">Regex Tester</span>
        <span class="header-desc">Test · Match · Replace</span>
      </div>
      <button class="help-btn" @click="showHelp = true" title="Help">?</button>
    </header>

    <!-- Main workspace -->
    <main class="workspace">
      <!-- Pattern bar -->
      <div class="pattern-bar" :class="{ 'has-error': regexError }">
        <div class="pattern-input-wrap" :class="{ 'error': regexError }">
          <span class="regex-slash">/</span>
          <input
            ref="patternInputRef"
            v-model="pattern"
            class="pattern-input"
            placeholder="pattern"
            spellcheck="false"
            autocomplete="off"
            @keydown.escape="pattern = ''"
          />
          <span class="regex-slash">/</span>
          <span class="flags-display">{{ activeFlags.join('') }}</span>
        </div>
        <div class="flag-toggles">
          <button
            v-for="flag in allFlags"
            :key="flag"
            class="flag-btn"
            :class="{ active: activeFlags.includes(flag) }"
            @click="toggleFlag(flag)"
            :title="flagDescriptions[flag]"
          >{{ flag }}</button>
        </div>
        <div class="pattern-bar-right">
          <div class="quick-patterns-wrap" ref="quickPatternsWrapRef">
            <button class="quick-btn" @click="quickOpen = !quickOpen">
              Quick Patterns
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <path d="M2 4l4 4 4-4"/>
              </svg>
            </button>
            <div v-if="quickOpen" class="quick-dropdown">
              <button
                v-for="qp in quickPatterns"
                :key="qp.label"
                class="quick-item"
                @click="applyQuickPattern(qp)"
              >
                <span class="quick-item-label">{{ qp.label }}</span>
                <span class="quick-item-pattern">{{ qp.pattern }}</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="regexError" class="error-msg">{{ regexError }}</div>
      </div>

      <!-- Middle area -->
      <div class="middle-area">
        <!-- Left: Test String -->
        <div class="panel test-panel">
          <div class="panel-header">
            <span class="panel-title">Test String</span>
            <div class="panel-header-right">
              <span v-if="matches.length > 0" class="match-badge">
                {{ matches.length }} {{ matches.length === 1 ? 'match' : 'matches' }}
              </span>
              <span v-else-if="pattern && !regexError && testString" class="match-badge no-match">
                0 matches
              </span>
              <button class="sample-btn" @click="loadSample">Sample</button>
            </div>
          </div>
          <div class="editor-wrap" ref="editorWrapRef">
            <!-- Highlight overlay -->
            <div
              class="highlight-overlay"
              ref="overlayRef"
              aria-hidden="true"
              v-html="highlightedHtml"
            ></div>
            <!-- Actual textarea -->
            <textarea
              ref="textareaRef"
              v-model="testString"
              class="test-textarea"
              placeholder="Enter test string here…"
              spellcheck="false"
              @scroll="syncScroll"
            ></textarea>
          </div>
        </div>

        <!-- Right: Results -->
        <div class="panel results-panel">
          <div class="panel-header">
            <span class="panel-title">Results</span>
            <span v-if="matches.length > 0" class="match-badge">{{ matches.length }}</span>
          </div>
          <div class="results-body">
            <!-- Empty state -->
            <div v-if="!pattern" class="empty-state">
              <div class="empty-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3a3a4f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <p>Enter a pattern to see matches</p>
            </div>
            <div v-else-if="regexError" class="empty-state error-state">
              <div class="empty-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <p>Invalid regular expression</p>
            </div>
            <div v-else-if="matches.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3a3a4f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <p>No matches found</p>
            </div>
            <!-- Match list -->
            <div v-else class="match-list">
              <div
                v-for="(m, i) in matches"
                :key="i"
                class="match-item"
                @click="copyToClipboard(m.value, 'match-' + i)"
                :title="'Click to copy'"
              >
                <div class="match-header">
                  <span class="match-index" :style="{ background: matchColors[i % matchColors.length].bg, color: matchColors[i % matchColors.length].text }">
                    #{{ i + 1 }}
                  </span>
                  <span class="match-value">{{ m.value || '(empty string)' }}</span>
                  <span class="match-pos">@ {{ m.index }}</span>
                  <span v-if="copiedKey === 'match-' + i" class="copied-tag">Copied!</span>
                </div>
                <div v-if="m.groups.length > 0" class="groups-list">
                  <div
                    v-for="(g, gi) in m.groups"
                    :key="gi"
                    class="group-item"
                  >
                    <span class="group-label">Group {{ gi + 1 }}</span>
                    <span class="group-value">{{ g !== undefined ? g : '(undefined)' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Replace bar -->
      <div class="replace-bar">
        <div class="replace-input-wrap">
          <span class="replace-label">Replace</span>
          <input
            v-model="replaceWith"
            class="replace-input"
            placeholder="Replace with… (use $1, $2 for capture groups)"
            spellcheck="false"
          />
        </div>
        <button
          class="replace-btn"
          :disabled="!pattern || !!regexError || !testString"
          @click="doReplace"
        >Replace All</button>
        <div v-if="replaceResult !== null" class="replace-result-wrap">
          <input
            class="replace-result-input"
            :value="replaceResult"
            readonly
            @click="$event.target.select()"
          />
          <button
            class="copy-result-btn"
            @click="copyToClipboard(replaceResult, 'replace-result')"
            title="Copy result"
          >
            <span v-if="copiedKey === 'replace-result'">Copied!</span>
            <template v-else>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Copy
            </template>
          </button>
        </div>
      </div>
    </main>

    <!-- Help modal -->
    <Teleport to="body">
      <div v-if="showHelp" class="modal-backdrop" @click.self="showHelp = false">
        <div class="modal">
          <div class="modal-header">
            <h2>Regex Tester — Help</h2>
            <button class="modal-close" @click="showHelp = false">✕</button>
          </div>
          <div class="modal-body">
            <section>
              <h3>Pattern Bar</h3>
              <p>Type your regular expression between the <code>/</code> slashes. The pattern is matched in real time.</p>
            </section>
            <section>
              <h3>Flags</h3>
              <ul>
                <li><code>g</code> — Global: find all matches (not just the first)</li>
                <li><code>i</code> — Case-insensitive matching</li>
                <li><code>m</code> — Multiline: <code>^</code> and <code>$</code> match start/end of each line</li>
                <li><code>s</code> — DotAll: <code>.</code> matches newline characters</li>
              </ul>
            </section>
            <section>
              <h3>Quick Patterns</h3>
              <p>Click the <strong>Quick Patterns</strong> button to insert a common pattern (Email, URL, IP, etc.).</p>
            </section>
            <section>
              <h3>Capture Groups</h3>
              <p>Wrap part of your pattern in <code>(…)</code> to create a capture group. Captured values are shown under each match in the Results panel.</p>
            </section>
            <section>
              <h3>Replace</h3>
              <p>Enter a replacement string and click <strong>Replace All</strong>. Use <code>$1</code>, <code>$2</code>, etc. to insert capture group values. Use <code>$&amp;</code> for the entire match.</p>
            </section>
            <section>
              <h3>Keyboard Shortcuts</h3>
              <ul>
                <li><code>Esc</code> in Pattern — clear pattern</li>
                <li>Click a match in Results — copies the matched value</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import MobileBlock from './components/MobileBlock.vue'

// ── Mobile detection ──────────────────────────────────────────────────────────
const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// ── State ─────────────────────────────────────────────────────────────────────
const pattern = ref('')
const testString = ref('')
const replaceWith = ref('')
const replaceResult = ref(null)
const activeFlags = ref(['g'])
const allFlags = ['g', 'i', 'm', 's']
const flagDescriptions = {
  g: 'Global — find all matches',
  i: 'Case insensitive',
  m: 'Multiline — ^ and $ match line boundaries',
  s: 'DotAll — . matches newlines',
}
const quickOpen = ref(false)
const showHelp = ref(false)
const copiedKey = ref(null)

// Refs
const textareaRef = ref(null)
const overlayRef = ref(null)
const editorWrapRef = ref(null)
const patternInputRef = ref(null)
const quickPatternsWrapRef = ref(null)

// Match highlight colors
const matchColors = [
  { bg: 'rgba(167,139,250,0.35)', text: '#c4b5fd', mark: 'rgba(167,139,250,0.30)' },
  { bg: 'rgba(52,211,153,0.30)', text: '#6ee7b7', mark: 'rgba(52,211,153,0.25)' },
  { bg: 'rgba(251,191,36,0.30)', text: '#fcd34d', mark: 'rgba(251,191,36,0.25)' },
  { bg: 'rgba(248,113,113,0.30)', text: '#fca5a5', mark: 'rgba(248,113,113,0.25)' },
]

// ── Quick patterns ─────────────────────────────────────────────────────────────
const quickPatterns = [
  { label: 'Email',               pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: ['g', 'i'] },
  { label: 'URL',                 pattern: 'https?:\\/\\/[^\\s/$.?#].[^\\s]*', flags: ['g', 'i'] },
  { label: 'IP Address',          pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b', flags: ['g'] },
  { label: 'Date (YYYY-MM-DD)',   pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b', flags: ['g'] },
  { label: 'Phone (010-XXXX-XXXX)', pattern: '010-\\d{4}-\\d{4}', flags: ['g'] },
  { label: 'HEX Color',           pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: ['g', 'i'] },
  { label: 'Number',              pattern: '-?\\d+(?:\\.\\d+)?', flags: ['g'] },
  { label: 'UUID',                pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', flags: ['g', 'i'] },
]

function applyQuickPattern(qp) {
  pattern.value = qp.pattern
  activeFlags.value = [...qp.flags]
  quickOpen.value = false
  nextTick(() => patternInputRef.value?.focus())
}

// ── Close quick dropdown on outside click ─────────────────────────────────────
function onDocClick(e) {
  if (quickPatternsWrapRef.value && !quickPatternsWrapRef.value.contains(e.target)) {
    quickOpen.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', onDocClick))
onUnmounted(() => document.removeEventListener('mousedown', onDocClick))

// ── Flag toggle ───────────────────────────────────────────────────────────────
function toggleFlag(flag) {
  const idx = activeFlags.value.indexOf(flag)
  if (idx === -1) {
    activeFlags.value = [...activeFlags.value, flag].sort((a, b) => allFlags.indexOf(a) - allFlags.indexOf(b))
  } else {
    activeFlags.value = activeFlags.value.filter(f => f !== flag)
  }
}

// ── Regex error ───────────────────────────────────────────────────────────────
const regexError = computed(() => {
  if (!pattern.value) return null
  try {
    new RegExp(pattern.value, activeFlags.value.join(''))
    return null
  } catch (e) {
    return e.message
  }
})

// ── Matches ───────────────────────────────────────────────────────────────────
const matches = computed(() => {
  if (!pattern.value || !testString.value || regexError.value) return []
  try {
    const flags = activeFlags.value.includes('g')
      ? activeFlags.value.join('')
      : activeFlags.value.join('') + 'g'
    const re = new RegExp(pattern.value, flags)
    const results = []
    let m
    re.lastIndex = 0
    while ((m = re.exec(testString.value)) !== null) {
      results.push({
        index: m.index,
        value: m[0],
        groups: Array.from(m).slice(1),
        end: m.index + m[0].length,
      })
      // Prevent infinite loops on zero-length matches
      if (m[0].length === 0) re.lastIndex++
      if (!activeFlags.value.includes('g')) break
    }
    return results
  } catch {
    return []
  }
})

// ── HTML-escape helper ────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Highlighted HTML for overlay ─────────────────────────────────────────────
const highlightedHtml = computed(() => {
  const text = testString.value
  if (!text) return ''
  if (matches.value.length === 0) return escapeHtml(text)

  let result = ''
  let cursor = 0
  for (let i = 0; i < matches.value.length; i++) {
    const m = matches.value[i]
    if (m.index > cursor) {
      result += escapeHtml(text.slice(cursor, m.index))
    }
    const color = matchColors[i % matchColors.length]
    result += `<mark style="background:${color.mark};border-radius:2px;color:inherit">${escapeHtml(m.value)}</mark>`
    cursor = m.end
  }
  if (cursor < text.length) {
    result += escapeHtml(text.slice(cursor))
  }
  // Preserve trailing newline so overlay height matches textarea
  if (text.endsWith('\n')) result += ' '
  return result
})

// ── Scroll sync ───────────────────────────────────────────────────────────────
function syncScroll() {
  if (overlayRef.value && textareaRef.value) {
    overlayRef.value.scrollTop = textareaRef.value.scrollTop
    overlayRef.value.scrollLeft = textareaRef.value.scrollLeft
  }
}

// ── Replace ───────────────────────────────────────────────────────────────────
function doReplace() {
  if (!pattern.value || regexError.value || !testString.value) return
  try {
    const flags = activeFlags.value.includes('g')
      ? activeFlags.value.join('')
      : activeFlags.value.join('') + 'g'
    const re = new RegExp(pattern.value, flags)
    replaceResult.value = testString.value.replace(re, replaceWith.value)
  } catch {
    replaceResult.value = null
  }
}

// Reset replace result when pattern or string changes
watch([pattern, testString, activeFlags], () => {
  replaceResult.value = null
})

// ── Copy to clipboard ─────────────────────────────────────────────────────────
function copyToClipboard(text, key) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = null }, 1500)
  })
}

// ── Sample text ───────────────────────────────────────────────────────────────
function loadSample() {
  testString.value = `Contact us at support@toolzy.site or hello@example.com.
Visit https://toolzy.site or http://example.org/path?q=1 for more info.
Phone: 010-1234-5678 or 010-9876-5432
IP: 192.168.0.1, 10.0.0.255, 255.255.255.0
Date: 2024-03-15, 2023-12-01
Color: #a78bfa, #fff, #123ABC
UUID: 550e8400-e29b-41d4-a716-446655440000
Numbers: 42, -3.14, 1000, 0.5`
}
</script>

<style scoped>
/* ── App shell ──────────────────────────────────────────────────────────────── */
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0f0f13;
  overflow: hidden;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.header {
  flex-shrink: 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #13131a;
  border-bottom: 1px solid #2a2a3a;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
  letter-spacing: -0.01em;
}

.header-desc {
  font-size: 12px;
  color: #6b7280;
  margin-left: 2px;
}

.help-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #2a2a3a;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, color 0.15s;
}
.help-btn:hover {
  border-color: #a78bfa;
  color: #a78bfa;
}

/* ── Workspace ──────────────────────────────────────────────────────────────── */
.workspace {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Pattern bar ────────────────────────────────────────────────────────────── */
.pattern-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 56px;
  background: #13131a;
  border-bottom: 1px solid #2a2a3a;
  position: relative;
}

.pattern-input-wrap {
  display: flex;
  align-items: center;
  background: #0f0f13;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  padding: 0 10px;
  height: 36px;
  min-width: 280px;
  flex: 1;
  transition: border-color 0.15s;
}
.pattern-input-wrap:focus-within {
  border-color: #a78bfa;
}
.pattern-input-wrap.error {
  border-color: #f87171 !important;
}

.regex-slash {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 16px;
  color: #6b7280;
  user-select: none;
  flex-shrink: 0;
}

.pattern-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #a78bfa;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 14px;
  caret-color: #a78bfa;
  padding: 0 4px;
  min-width: 0;
}
.pattern-input::placeholder {
  color: #3a3a4f;
}

.flags-display {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  color: #a78bfa;
  opacity: 0.7;
  flex-shrink: 0;
  min-width: 28px;
}

.flag-toggles {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.flag-btn {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  border: 1px solid #2a2a3a;
  background: transparent;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.flag-btn:hover {
  border-color: #a78bfa;
  color: #a78bfa;
}
.flag-btn.active {
  background: #a78bfa;
  border-color: #a78bfa;
  color: #fff;
}

.pattern-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Quick Patterns */
.quick-patterns-wrap {
  position: relative;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 12px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #2a2a3a;
  background: transparent;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.quick-btn:hover {
  border-color: #a78bfa;
  color: #a78bfa;
}

.quick-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 260px;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 4px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.quick-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}
.quick-item:hover {
  background: rgba(167, 139, 250, 0.1);
}

.quick-item-label {
  font-size: 13px;
  color: #d1d5db;
  white-space: nowrap;
}
.quick-item-pattern {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 10px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.error-msg {
  position: absolute;
  bottom: -22px;
  left: 12px;
  font-size: 11px;
  color: #f87171;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 24px);
  z-index: 10;
}

/* ── Middle area ────────────────────────────────────────────────────────────── */
.middle-area {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 0;
}

/* ── Panel ──────────────────────────────────────────────────────────────────── */
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid #2a2a3a;
}

.test-panel {
  flex: 1;
  min-width: 0;
}

.results-panel {
  width: 320px;
  flex-shrink: 0;
  border-right: none;
  border-left: 1px solid #2a2a3a;
}

.panel-header {
  flex-shrink: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: #13131a;
  border-bottom: 1px solid #2a2a3a;
}

.panel-title {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.panel-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.match-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  font-weight: 600;
}
.match-badge.no-match {
  background: rgba(107, 114, 128, 0.15);
  color: #6b7280;
}

.sample-btn {
  padding: 2px 10px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid #2a2a3a;
  background: transparent;
  color: #6b7280;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}
.sample-btn:hover {
  border-color: #a78bfa;
  color: #a78bfa;
}

/* ── Editor wrap (textarea + overlay) ───────────────────────────────────────── */
.editor-wrap {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.test-textarea,
.highlight-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.65;
  tab-size: 2;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
  box-sizing: border-box;
}

.highlight-overlay {
  pointer-events: none;
  color: transparent;
  background: #0f0f13;
  border: none;
  z-index: 1;
  overflow: hidden;
}

.highlight-overlay :deep(mark) {
  border-radius: 2px;
  color: transparent;
}

.test-textarea {
  background: transparent;
  color: #d1d5db;
  border: none;
  outline: none;
  resize: none;
  caret-color: #a78bfa;
  z-index: 2;
  position: absolute;
}
.test-textarea::placeholder {
  color: #3a3a4f;
}

/* ── Results panel body ─────────────────────────────────────────────────────── */
.results-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  padding: 24px;
  color: #4b5563;
  font-size: 13px;
  text-align: center;
}
.empty-state.error-state {
  color: #f87171;
}
.empty-icon {
  opacity: 0.6;
}

.match-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.match-item {
  background: #13131a;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.match-item:hover {
  border-color: #a78bfa;
}

.match-header {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.match-index {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.match-value {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  color: #e2e8f0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.match-pos {
  font-size: 10px;
  color: #4b5563;
  flex-shrink: 0;
}

.copied-tag {
  font-size: 10px;
  color: #34d399;
  flex-shrink: 0;
}

.groups-list {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-left: 4px;
  border-left: 2px solid #2a2a3a;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.group-label {
  font-size: 10px;
  color: #6b7280;
  flex-shrink: 0;
  min-width: 48px;
}

.group-value {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 11px;
  color: #a78bfa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Replace bar ────────────────────────────────────────────────────────────── */
.replace-bar {
  flex-shrink: 0;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: #13131a;
  border-top: 1px solid #2a2a3a;
}

.replace-input-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  background: #0f0f13;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  padding: 0 10px;
  height: 34px;
  transition: border-color 0.15s;
}
.replace-input-wrap:focus-within {
  border-color: #a78bfa;
}

.replace-label {
  font-size: 11px;
  color: #4b5563;
  margin-right: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.replace-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #d1d5db;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  min-width: 0;
}
.replace-input::placeholder {
  color: #3a3a4f;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 12px;
}

.replace-btn {
  flex-shrink: 0;
  padding: 0 16px;
  height: 34px;
  border-radius: 6px;
  border: none;
  background: #a78bfa;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, background 0.15s;
  white-space: nowrap;
}
.replace-btn:hover:not(:disabled) {
  background: #9775e8;
}
.replace-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.replace-result-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0f0f13;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  padding: 0 8px 0 10px;
  height: 34px;
}

.replace-result-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #34d399;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  min-width: 0;
  cursor: text;
}

.copy-result-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #2a2a3a;
  background: transparent;
  color: #6b7280;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.copy-result-btn:hover {
  border-color: #a78bfa;
  color: #a78bfa;
}

/* ── Help modal ─────────────────────────────────────────────────────────────── */
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

.modal-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
}

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
.modal-close:hover {
  color: #d1d5db;
}

.modal-body {
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-body section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-body h3 {
  font-size: 13px;
  font-weight: 700;
  color: #a78bfa;
}

.modal-body p {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.6;
}

.modal-body ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.modal-body li {
  font-size: 13px;
  color: #9ca3af;
  padding-left: 4px;
  line-height: 1.5;
}

.modal-body code {
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 12px;
  background: rgba(167, 139, 250, 0.12);
  color: #a78bfa;
  padding: 1px 5px;
  border-radius: 3px;
}
</style>
