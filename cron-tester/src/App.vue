<template>
  <MobileBlock v-if="isMobile" />
  <div v-else class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="logo-text">Cron Tester</span>
        </div>
        <button class="help-btn" @click="showHelp = true" title="Help">?</button>
      </div>
    </header>

    <div class="main">
      <!-- Format Toggle -->
      <div class="format-section">
        <div class="format-toggle">
          <button
            class="format-btn"
            :class="{ active: format === 'standard' }"
            @click="setFormat('standard')"
          >Standard (5-field)</button>
          <button
            class="format-btn"
            :class="{ active: format === 'seconds' }"
            @click="setFormat('seconds')"
          >With Seconds (6-field)</button>
        </div>
        <p class="format-desc">{{ currentFormatInfo.desc }}</p>
      </div>

      <!-- Input Section -->
      <div class="input-section">
        <!-- Field boxes -->
        <div class="fields-row">
          <div
            v-for="(info, i) in currentFormatInfo.fields"
            :key="info.label"
            class="field-box"
            :class="{ focused: focusedField === i, 'dd-open': openDropdown === i }"
          >
            <input
              class="field-input"
              v-model="fieldValues[i]"
              :placeholder="info.placeholder"
              spellcheck="false"
              autocomplete="off"
              @focus="focusedField = i"
              @blur="focusedField = -1"
              @keydown.tab.prevent="focusNextField(i, $event)"
            />
            <span class="field-name">{{ info.label }}</span>
            <span class="field-range">{{ info.range }}</span>
            <button
              class="field-dd-btn"
              tabindex="-1"
              @click.stop="toggleDropdown(i)"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <!-- Field preset dropdown -->
            <div
              v-if="openDropdown === i"
              class="field-dropdown"
              :class="dropdownAlign(i)"
              @click.stop
            >
              <button
                v-for="opt in fieldPresetsData[info.key]"
                :key="opt.value"
                class="field-dd-item"
                :class="{ active: fieldValues[i] === opt.value }"
                @mousedown.prevent="selectFieldPreset(i, opt.value)"
              >
                <code class="fd-value">{{ opt.value }}</code>
                <span class="fd-label">{{ opt.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Combined expression display -->
        <div class="expr-display" :class="{ error: result && !result.valid, success: result && result.valid }">
          <input
            class="expr-input"
            :value="expression"
            @input="onExpressionInput($event.target.value)"
            spellcheck="false"
            autocomplete="off"
            placeholder="표현식을 입력하세요"
          />
          <button class="copy-btn" @click="copyExpression" :title="copyTooltip">
            <svg v-if="!copied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
          <button class="clear-btn" @click="resetFields">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            초기화
          </button>
        </div>

        <!-- Validation Result -->
        <div v-if="expression && result" class="validation-result">
          <div v-if="result.valid" class="valid-msg">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ result.description }}
          </div>
          <div v-else class="error-msg">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            {{ result.error }}
          </div>
        </div>
      </div>

      <!-- Bottom Panels -->
      <div class="panels">
        <!-- Next Run Times -->
        <div class="panel">
          <div class="panel-header">다음 실행 시간 (10개)</div>
          <div class="panel-body">
            <div v-if="result && result.valid && result.nextTimes.length" class="times-list">
              <div
                v-for="(time, i) in result.nextTimes"
                :key="i"
                class="time-item"
              >
                <span class="time-index">{{ i + 1 }}</span>
                <span class="time-str">{{ formatDate(time) }}</span>
                <span class="time-dow">{{ getDayOfWeek(time) }}</span>
              </div>
            </div>
            <div v-else class="panel-empty">
              <span v-if="!expression">표현식을 입력하세요</span>
              <span v-else-if="result && !result.valid">유효하지 않은 표현식</span>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div class="panel">
          <div class="panel-header">프리셋</div>
          <div class="panel-body">
            <div class="presets-grid">
              <button
                v-for="preset in currentPresets"
                :key="preset.expr"
                class="preset-btn"
                :class="{ active: expression === preset.expr }"
                @click="applyPreset(preset)"
              >
                <span class="preset-label">{{ preset.label }}</span>
                <code class="preset-expr">{{ preset.expr }}</code>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Help modal -->
    <Teleport to="body">
      <div v-if="showHelp" class="modal-backdrop" @click.self="showHelp = false">
        <div class="modal">
          <div class="modal-header">
            <h2>Cron Tester — Help</h2>
            <button class="modal-close" @click="showHelp = false">✕</button>
          </div>
          <div class="modal-body">
            <section>
              <h3>필드 구성</h3>
              <table class="help-table">
                <thead>
                  <tr><th>필드</th><th>범위</th><th>특수문자</th></tr>
                </thead>
                <tbody>
                  <tr><td>분</td><td>0–59</td><td>* , - /</td></tr>
                  <tr><td>시</td><td>0–23</td><td>* , - /</td></tr>
                  <tr><td>일(월)</td><td>1–31</td><td>* , - / ? L W</td></tr>
                  <tr><td>월</td><td>1–12 / JAN–DEC</td><td>* , - /</td></tr>
                  <tr><td>요일</td><td>0–7 / SUN–SAT (0·7=일)</td><td>* , - / ? L #</td></tr>
                </tbody>
              </table>
              <p class="help-note">6-field 포맷에서는 맨 앞에 <code>초 (0–59)</code> 필드가 추가됩니다.</p>
            </section>
            <section>
              <h3>특수문자</h3>
              <ul>
                <li><code>*</code> — 모든 값</li>
                <li><code>*/n</code> — n 간격마다 (예: <code>*/5</code> → 5분마다)</li>
                <li><code>a-b</code> — 범위 (예: <code>1-5</code> → 월~금)</li>
                <li><code>a,b</code> — 목록 (예: <code>1,15</code> → 1일과 15일)</li>
                <li><code>L</code> — 마지막 (일: 말일, 요일: 마지막 해당 요일)</li>
                <li><code>#n</code> — n번째 요일 (예: <code>1#2</code> → 두 번째 월요일)</li>
              </ul>
            </section>
            <section>
              <h3>포맷 전환</h3>
              <p><strong>Standard (5-field)</strong> — Unix/Linux 표준 cron</p>
              <p><strong>With Seconds (6-field)</strong> — AWS EventBridge, Spring, Quartz 등에서 사용</p>
            </section>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import cronstrue from 'cronstrue/i18n'
import { parseExpression } from 'cron-parser'
import MobileBlock from './components/MobileBlock.vue'

const isMobile = ref(false)
const showHelp = ref(false)
const format = ref('standard')
const focusedField = ref(-1)
const openDropdown = ref(-1)
const copied = ref(false)
const copyTooltip = ref('복사')

const fieldPresetsData = {
  second: [
    { value: '0',    label: '0초 (정각)' },
    { value: '*',    label: '매초' },
    { value: '*/5',  label: '5초마다' },
    { value: '*/10', label: '10초마다' },
    { value: '*/15', label: '15초마다' },
    { value: '*/30', label: '30초마다' },
  ],
  minute: [
    { value: '*',    label: '매분' },
    { value: '0',    label: '0분 (정각)' },
    { value: '*/5',  label: '5분마다' },
    { value: '*/10', label: '10분마다' },
    { value: '*/15', label: '15분마다' },
    { value: '*/30', label: '30분마다' },
    { value: '0,30', label: '0분·30분' },
  ],
  hour: [
    { value: '*',    label: '매시' },
    { value: '0',    label: '0시 (자정)' },
    { value: '6',    label: '6시 (오전)' },
    { value: '9',    label: '9시 (오전)' },
    { value: '12',   label: '12시 (정오)' },
    { value: '18',   label: '18시 (오후)' },
    { value: '*/2',  label: '2시간마다' },
    { value: '*/6',  label: '6시간마다' },
    { value: '8-17', label: '업무시간 (8~17시)' },
  ],
  dayOfMonth: [
    { value: '*',    label: '매일' },
    { value: '1',    label: '1일' },
    { value: '15',   label: '15일' },
    { value: '1,15', label: '1일·15일' },
    { value: 'L',    label: '말일 (L)' },
    { value: '*/7',  label: '7일마다' },
  ],
  month: [
    { value: '*',         label: '매월' },
    { value: '1',         label: '1월' },
    { value: '6',         label: '6월' },
    { value: '12',        label: '12월' },
    { value: '*/3',       label: '3개월마다' },
    { value: '1,4,7,10',  label: '분기 첫달' },
    { value: '1-6',       label: '상반기 (1~6월)' },
    { value: '7-12',      label: '하반기 (7~12월)' },
  ],
  dayOfWeek: [
    { value: '*',   label: '매일' },
    { value: '1',   label: '월요일' },
    { value: '2',   label: '화요일' },
    { value: '3',   label: '수요일' },
    { value: '4',   label: '목요일' },
    { value: '5',   label: '금요일' },
    { value: '6',   label: '토요일' },
    { value: '0',   label: '일요일' },
    { value: '1-5', label: '평일 (월~금)' },
    { value: '6,0', label: '주말 (토·일)' },
  ],
}

const formatInfoMap = {
  standard: {
    label: 'Standard (5-field)',
    desc: '분 시 일 월 요일 — Unix/Linux 표준 cron',
    fields: [
      { label: '분',    range: '0–59',           placeholder: '0', key: 'minute' },
      { label: '시',    range: '0–23',           placeholder: '9', key: 'hour' },
      { label: '일(월)', range: '1–31',          placeholder: '*', key: 'dayOfMonth' },
      { label: '월',    range: '1–12',           placeholder: '*', key: 'month' },
      { label: '요일',  range: '0–7 (0·7=일)',   placeholder: '1', key: 'dayOfWeek' },
    ],
    defaultFields: ['0', '9', '*', '*', '1'],
  },
  seconds: {
    label: 'With Seconds (6-field)',
    desc: '초 분 시 일 월 요일 — AWS EventBridge, Spring, Quartz 등',
    fields: [
      { label: '초',    range: '0–59',           placeholder: '0', key: 'second' },
      { label: '분',    range: '0–59',           placeholder: '0', key: 'minute' },
      { label: '시',    range: '0–23',           placeholder: '9', key: 'hour' },
      { label: '일(월)', range: '1–31',          placeholder: '*', key: 'dayOfMonth' },
      { label: '월',    range: '1–12',           placeholder: '*', key: 'month' },
      { label: '요일',  range: '0–7 (0·7=일)',   placeholder: '1', key: 'dayOfWeek' },
    ],
    defaultFields: ['0', '0', '9', '*', '*', '1'],
  },
}

const presetsMap = {
  standard: [
    { label: '매일 자정',     expr: '0 0 * * *' },
    { label: '매시 정각',     expr: '0 * * * *' },
    { label: '매주 월요일',   expr: '0 9 * * 1' },
    { label: '매월 1일',      expr: '0 0 1 * *' },
    { label: '5분마다',       expr: '*/5 * * * *' },
    { label: '평일 오전 9시', expr: '0 9 * * 1-5' },
  ],
  seconds: [
    { label: '매일 자정',     expr: '0 0 0 * * *' },
    { label: '매시 정각',     expr: '0 0 * * * *' },
    { label: '매주 월요일',   expr: '0 0 9 * * 1' },
    { label: '매월 1일',      expr: '0 0 0 1 * *' },
    { label: '5분마다',       expr: '0 */5 * * * *' },
    { label: '평일 오전 9시', expr: '0 0 9 * * 1-5' },
  ],
}

const fieldValues = ref([...formatInfoMap.standard.defaultFields])

const currentFormatInfo = computed(() => formatInfoMap[format.value])
const currentPresets = computed(() => presetsMap[format.value])

const expression = computed(() => fieldValues.value.join(' '))

const result = computed(() => {
  const expr = expression.value.trim()
  if (!expr || fieldValues.value.some(v => !v.trim())) return null
  try {
    const description = cronstrue.toString(expr, {
      locale: 'ko',
      use24HourTimeFormat: true,
      throwExceptionOnParseError: true,
    })
    const iter = parseExpression(expr, {
      currentDate: new Date(),
      iterator: true,
    })
    const nextTimes = []
    for (let i = 0; i < 10; i++) {
      nextTimes.push(iter.next().value.toDate())
    }
    return { valid: true, description, nextTimes }
  } catch (e) {
    return { valid: false, error: e.message, description: '', nextTimes: [] }
  }
})

function setFormat(f) {
  format.value = f
  fieldValues.value = [...formatInfoMap[f].defaultFields]
}

function resetFields() {
  fieldValues.value = [...formatInfoMap[format.value].defaultFields]
}

function applyPreset(preset) {
  fieldValues.value = preset.expr.split(' ')
}

function onExpressionInput(value) {
  const parts = value.trim().split(/\s+/)
  const expectedLen = currentFormatInfo.value.fields.length
  // 필드 수가 맞으면 포맷 자동 전환, 아니면 현재 포맷 유지
  if (parts.length === 6 && format.value === 'standard') {
    format.value = 'seconds'
  } else if (parts.length === 5 && format.value === 'seconds') {
    format.value = 'standard'
  }
  const len = currentFormatInfo.value.fields.length
  const newFields = Array(len).fill('')
  for (let i = 0; i < len; i++) {
    newFields[i] = parts[i] || ''
  }
  fieldValues.value = newFields
}

function copyExpression() {
  navigator.clipboard.writeText(expression.value).then(() => {
    copied.value = true
    copyTooltip.value = '복사됨!'
    setTimeout(() => {
      copied.value = false
      copyTooltip.value = '복사'
    }, 1500)
  })
}

function focusNextField(i, e) {
  const total = currentFormatInfo.value.fields.length
  const next = e.shiftKey ? i - 1 : i + 1
  if (next >= 0 && next < total) {
    const inputs = document.querySelectorAll('.field-input')
    inputs[next]?.focus()
    inputs[next]?.select()
  }
}

function toggleDropdown(i) {
  openDropdown.value = openDropdown.value === i ? -1 : i
}

function selectFieldPreset(i, value) {
  fieldValues.value[i] = value
  openDropdown.value = -1
}

function dropdownAlign(i) {
  const total = currentFormatInfo.value.fields.length
  if (i >= total - 2) return 'dd-right'
  if (i <= 0) return 'dd-left'
  return 'dd-center'
}

function onDocumentClick() {
  openDropdown.value = -1
}

const dtf = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

const dowNames = ['일', '월', '화', '수', '목', '금', '토']

function formatDate(date) {
  return dtf.format(date).replace(/\./g, '-').replace(/ /g, '').replace(/-$/, '')
}

function getDayOfWeek(date) {
  return `(${dowNames[date.getDay()]})`
}

onMounted(() => {
  const isBot = /bot|crawl|spider|google|bing|yandex|baidu|slurp|duckduck/i.test(navigator.userAgent)
  isMobile.value = !isBot && window.innerWidth < 768
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0f0f13;
}

/* Header */
.header {
  height: 52px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
}

.header-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #f0f0f5;
  letter-spacing: -0.02em;
}

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

/* Help Modal */
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
  gap: 20px;
}

.modal-body section {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 4px;
  list-style: none;
}

.modal-body li {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.6;
}

.modal-body code {
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  padding: 1px 5px;
  border-radius: 3px;
}

.help-table {
  border-collapse: collapse;
  font-size: 12px;
  width: 100%;
}

.help-table th {
  text-align: left;
  padding: 7px 12px;
  background: #1e1e2a;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 1px solid #2a2a3a;
}

.help-table td {
  padding: 6px 12px;
  color: #d1d5db;
  border-bottom: 1px solid #1e1e2a;
  font-size: 12px;
}

.help-note {
  font-size: 12px;
  color: #6b7280;
}

/* Main */
.main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  align-self: stretch;
}

/* Format Toggle */
.format-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.format-toggle {
  display: flex;
  gap: 0;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 3px;
  width: fit-content;
}

.format-btn {
  padding: 7px 18px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.format-btn.active {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
}

.format-btn:not(.active):hover {
  color: #d1d5db;
}

.format-desc {
  font-size: 12px;
  color: #6b7280;
  padding-left: 2px;
}

/* Input */
.input-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Field boxes */
.fields-row {
  display: flex;
  gap: 8px;
}

.field-box {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 10px 8px 6px;
  transition: border-color 0.15s;
}

.field-box.focused {
  border-color: rgba(167, 139, 250, 0.6);
  background: rgba(167, 139, 250, 0.04);
}

.field-box.dd-open {
  border-color: rgba(167, 139, 250, 0.5);
  z-index: 10;
}

.field-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 22px;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-weight: 600;
  color: #f0f0f5;
  text-align: center;
  letter-spacing: 0.04em;
  padding: 2px 0 6px;
  line-height: 1;
}

.field-input::placeholder {
  color: #3a3a4f;
}

.field-name {
  font-size: 12px;
  font-weight: 600;
  color: #a78bfa;
  margin-top: 2px;
}

.field-range {
  font-size: 10px;
  color: #4b5563;
  margin-top: 2px;
  white-space: nowrap;
}

/* Field preset dropdown trigger */
.field-dd-btn {
  margin-top: 6px;
  width: 100%;
  background: transparent;
  border: none;
  border-top: 1px solid #1e1e2a;
  color: #4b5563;
  padding: 4px 0 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}

.field-dd-btn:hover,
.dd-open .field-dd-btn {
  color: #a78bfa;
}

/* Dropdown panel */
.field-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  background: #1e1e2a;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.field-dropdown.dd-left  { left: 0; }
.field-dropdown.dd-right { right: 0; }
.field-dropdown.dd-center { left: 50%; transform: translateX(-50%); }

.field-dd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #2a2a3a;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.1s;
}

.field-dd-item:last-child {
  border-bottom: none;
}

.field-dd-item:hover {
  background: rgba(167, 139, 250, 0.08);
}

.field-dd-item.active {
  background: rgba(167, 139, 250, 0.12);
}

.field-dd-item.active .fd-value {
  color: #c4b5fd;
}

.fd-value {
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  padding: 1px 6px;
  border-radius: 3px;
  min-width: 48px;
  text-align: center;
  flex-shrink: 0;
}

.fd-label {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

/* Combined expression display */
.expr-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  padding: 8px 12px;
  transition: border-color 0.15s;
}

.expr-display.error {
  border-color: rgba(239, 68, 68, 0.4);
}

.expr-display.success {
  border-color: rgba(34, 197, 94, 0.25);
}

.expr-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  color: #d1d5db;
  letter-spacing: 0.06em;
  min-width: 0;
}

.expr-input::placeholder {
  color: #3a3a4f;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}

.copy-btn:hover {
  color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.4);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  color: #6b7280;
  font-size: 11px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}

.clear-btn:hover {
  color: #d1d5db;
  border-color: #3a3a4f;
}

/* Validation Result */
.validation-result {
  padding: 0 2px;
}

.valid-msg,
.error-msg {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 500;
}

.valid-msg {
  color: #22c55e;
}

.error-msg {
  color: #ef4444;
}

/* Panels */
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex: 1;
}

.panel {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #2a2a3a;
  background: #1a1a24;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.panel-empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: #4b5563;
}

/* Times List */
.times-list {
  display: flex;
  flex-direction: column;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  border-bottom: 1px solid #1e1e2a;
  font-size: 13px;
}

.time-item:last-child {
  border-bottom: none;
}

.time-index {
  width: 18px;
  text-align: right;
  color: #4b5563;
  font-size: 11px;
  flex-shrink: 0;
}

.time-str {
  flex: 1;
  color: #d1d5db;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
}

.time-dow {
  color: #a78bfa;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

/* Presets Grid */
.presets-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.preset-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #1e1e2a;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  gap: 12px;
}

.preset-btn:last-child {
  border-bottom: none;
}

.preset-btn:hover,
.preset-btn.active {
  background: rgba(167, 139, 250, 0.07);
}

.preset-btn.active .preset-label {
  color: #a78bfa;
}

.preset-label {
  font-size: 13px;
  color: #d1d5db;
  flex-shrink: 0;
}

.preset-expr {
  font-size: 11px;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  color: #6b7280;
  background: #1e1e2a;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
