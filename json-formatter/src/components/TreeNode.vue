<template>
  <div class="tree-node">
    <!-- Node row -->
    <div
      class="node-row"
      :class="{ 'is-expandable': isExpandable, 'is-leaf': !isExpandable, 'is-match': hasDescendantMatch && searchTerm }"
      @click="isExpandable ? toggleExpand() : copyLeaf()"
    >
      <span class="node-indent" :style="{ width: depth * 18 + 'px' }" />

      <span class="node-toggle">
        <svg v-if="isExpandable" width="10" height="10" viewBox="0 0 10 10" class="arrow" :class="{ expanded: isExpanded }">
          <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>

      <!-- Key -->
      <span v-if="nodeKey !== null" class="node-key" :class="{ 'is-key-match': isKeyMatch }">
        {{ isArrayIndex ? `[${nodeKey}]` : `"${nodeKey}"` }}
      </span>
      <span v-if="nodeKey !== null" class="node-colon">:</span>

      <!-- 접혀있을 때: 요약 -->
      <span v-if="isExpandable && !isExpanded" class="node-summary">{{ summary }}</span>

      <!-- 펼쳐있을 때: 여는 괄호 -->
      <span v-else-if="isExpandable && isExpanded" class="node-bracket">{{ isArray ? '[' : '{' }}</span>

      <!-- 단말 노드: 값 -->
      <template v-else>
        <span class="node-value" :class="[valueClass, { 'is-value-match': isValueMatch }]">{{ displayValue }}</span>
        <Transition name="copied">
          <span v-if="showCopied" class="copied-hint">Copied!</span>
        </Transition>
      </template>

      <!-- Path 복사 버튼 (hover 시 오른쪽 끝에 표시) -->
      <button class="btn-copy-path" @click.stop="copyPath">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span class="path-text">{{ showPathCopied ? 'Copied!' : jsonPath }}</span>
      </button>

    </div>

    <!-- 자식 노드 (재귀) -->
    <template v-if="isExpandable && isExpanded">
      <TreeNode
        v-for="(child, i) in children"
        :key="String(child.key)"
        :node-key="child.key"
        :value="child.value"
        :depth="depth + 1"
        :is-array-index="isArray"
        :is-last="i === children.length - 1"
        :initial-expanded="initialExpanded"
        :json-path="childPath(child.key)"
        :search-term="searchTerm"
      />
      <!-- 닫는 괄호 -->
      <div class="node-row closing">
        <span class="node-indent" :style="{ width: depth * 18 + 'px' }" />
        <span class="node-toggle" />
        <span class="node-bracket">{{ isArray ? ']' : '}' }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  nodeKey:        { default: null },
  value:          { required: true },
  depth:          { type: Number, default: 0 },
  isArrayIndex:   { type: Boolean, default: false },
  isLast:         { type: Boolean, default: true },
  initialExpanded:{ default: null }, // null = depth 기준, true/false = 강제
  jsonPath:       { type: String, default: '$' },
  searchTerm:     { type: String, default: '' },
})

const isArray      = computed(() => Array.isArray(props.value))
const isExpandable = computed(() => props.value !== null && typeof props.value === 'object')

// initialExpanded가 지정되면 우선 적용, 없으면 depth 기준
const expanded = ref(
  props.initialExpanded !== null ? props.initialExpanded : props.depth < 2
)
function toggleExpand() { expanded.value = !expanded.value }

// ── 검색 ──────────────────────────────────────────────────────
function checkMatch(val, key) {
  const term = props.searchTerm.toLowerCase()
  if (key !== null && String(key).toLowerCase().includes(term)) return true
  if (val === null || typeof val !== 'object') return String(val).toLowerCase().includes(term)
  if (Array.isArray(val)) return val.some((v, i) => checkMatch(v, i))
  return Object.entries(val).some(([k, v]) => checkMatch(v, k))
}

const hasDescendantMatch = computed(() => {
  if (!props.searchTerm) return false
  return checkMatch(props.value, props.nodeKey)
})

const isKeyMatch = computed(() => {
  if (!props.searchTerm || props.nodeKey === null) return false
  return String(props.nodeKey).toLowerCase().includes(props.searchTerm.toLowerCase())
})

const isValueMatch = computed(() => {
  if (!props.searchTerm || props.isExpandable) return false
  return String(props.value ?? '').toLowerCase().includes(props.searchTerm.toLowerCase())
})

// 검색 중 매칭 자식이 있으면 강제 펼침
const isExpanded = computed(() => {
  if (props.searchTerm && hasDescendantMatch.value) return true
  return expanded.value
})

// 자식 노드 path 생성
function childPath(key) {
  if (typeof key === 'number') return `${props.jsonPath}[${key}]`
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
    ? `${props.jsonPath}.${key}`
    : `${props.jsonPath}["${key}"]`
}

// 자식 목록
const children = computed(() => {
  if (isArray.value)      return props.value.map((v, i) => ({ key: i, value: v }))
  if (isExpandable.value) return Object.entries(props.value).map(([k, v]) => ({ key: k, value: v }))
  return []
})

// 접혔을 때 요약 텍스트
const summary = computed(() => {
  if (isArray.value) {
    const n = props.value.length
    return `[ ${n} ${n === 1 ? 'item' : 'items'} ]`
  }
  const n = Object.keys(props.value).length
  return `{ ${n} ${n === 1 ? 'key' : 'keys'} }`
})

// 단말 노드 값 표시
const displayValue = computed(() => {
  if (props.value === null)           return 'null'
  if (typeof props.value === 'string') return `"${props.value}"`
  return String(props.value)
})

const valueClass = computed(() => {
  if (props.value === null)            return 'v-null'
  if (typeof props.value === 'string') return 'v-str'
  if (typeof props.value === 'number') return 'v-num'
  if (typeof props.value === 'boolean')return 'v-bool'
  return ''
})

// 단말 노드 클릭 → 값 복사
const showCopied = ref(false)
async function copyLeaf() {
  const text = typeof props.value === 'string' ? props.value : String(props.value)
  try {
    await navigator.clipboard.writeText(text)
    showCopied.value = true
    setTimeout(() => { showCopied.value = false }, 1200)
  } catch {}
}

// Path 복사
const showPathCopied = ref(false)
async function copyPath() {
  try {
    await navigator.clipboard.writeText(props.jsonPath)
    showPathCopied.value = true
    setTimeout(() => { showPathCopied.value = false }, 1500)
  } catch {}
}
</script>

<style scoped>
.tree-node {
  display: flex;
  flex-direction: column;
}

.node-row {
  display: flex;
  align-items: center;
  min-height: 24px;
  padding: 1px 12px 1px 0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 22px;
  white-space: nowrap;
  border-radius: 4px;
  transition: background 0.1s;
  user-select: none;
}

.node-row.is-expandable { cursor: pointer; }
.node-row.is-leaf       { cursor: pointer; }
.node-row:hover         { background: rgba(255, 255, 255, 0.04); }

.node-indent { display: inline-block; flex-shrink: 0; }

.node-toggle {
  width: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5c5c80;
}

.arrow {
  transition: transform 0.15s;
  transform: rotate(-90deg);
}
.arrow.expanded { transform: rotate(0deg); }

.node-key {
  color: #93c5fd;
  margin-right: 1px;
}

.node-colon {
  color: #6b7280;
  margin-right: 6px;
}

.node-summary {
  color: #6b7280;
  font-style: italic;
}

.node-bracket { color: #9ca3af; }

/* 단말 노드 값 색상 */
.v-str  { color: #86efac; }
.v-num  { color: #fbbf24; }
.v-bool { color: #f472b6; }
.v-null { color: #a1a1b5; }

.copied-hint {
  margin-left: 10px;
  font-size: 11px;
  color: #4ade80;
  font-family: sans-serif;
}

.copied-enter-active, .copied-leave-active { transition: opacity 0.2s; }
.copied-enter-from, .copied-leave-to       { opacity: 0; }

.is-key-match   { background: rgba(251, 191, 36, 0.2); border-radius: 3px; color: #fcd34d !important; }
.is-value-match { background: rgba(251, 191, 36, 0.2); border-radius: 3px; }

.btn-copy-path {
  display: none;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  padding: 2px 8px 2px 6px;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 4px;
  color: #c4b5fd;
  cursor: pointer;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  white-space: nowrap;
  max-width: 300px;
  overflow: hidden;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.btn-copy-path:hover {
  background: rgba(167, 139, 250, 0.2);
  border-color: rgba(167, 139, 250, 0.6);
  color: #fff;
}
.node-row:hover .btn-copy-path { display: flex; }

.path-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
