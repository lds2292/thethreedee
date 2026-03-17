<template>
  <div class="tree-node">
    <!-- Node row -->
    <div
      class="node-row"
      :class="{ 'is-expandable': isExpandable, 'is-leaf': !isExpandable }"
      @click="isExpandable ? toggleExpand() : copyLeaf()"
    >
      <span class="node-indent" :style="{ width: depth * 18 + 'px' }" />

      <span class="node-toggle">
        <svg v-if="isExpandable" width="10" height="10" viewBox="0 0 10 10" class="arrow" :class="{ expanded }">
          <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>

      <!-- Key -->
      <span v-if="nodeKey !== null" class="node-key">
        {{ isArrayIndex ? `[${nodeKey}]` : `"${nodeKey}"` }}
      </span>
      <span v-if="nodeKey !== null" class="node-colon">:</span>

      <!-- 접혀있을 때: 요약 -->
      <span v-if="isExpandable && !expanded" class="node-summary">{{ summary }}</span>

      <!-- 펼쳐있을 때: 여는 괄호 -->
      <span v-else-if="isExpandable && expanded" class="node-bracket">{{ isArray ? '[' : '{' }}</span>

      <!-- 단말 노드: 값 -->
      <template v-else>
        <span class="node-value" :class="valueClass">{{ displayValue }}</span>
        <Transition name="copied">
          <span v-if="showCopied" class="copied-hint">Copied!</span>
        </Transition>
      </template>
    </div>

    <!-- 자식 노드 (재귀) -->
    <template v-if="isExpandable && expanded">
      <TreeNode
        v-for="(child, i) in children"
        :key="String(child.key)"
        :node-key="child.key"
        :value="child.value"
        :depth="depth + 1"
        :is-array-index="isArray"
        :is-last="i === children.length - 1"
        :initial-expanded="initialExpanded"
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
})

const isArray      = computed(() => Array.isArray(props.value))
const isExpandable = computed(() => props.value !== null && typeof props.value === 'object')

// initialExpanded가 지정되면 우선 적용, 없으면 depth 기준
const expanded = ref(
  props.initialExpanded !== null ? props.initialExpanded : props.depth < 2
)
function toggleExpand() { expanded.value = !expanded.value }

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
</style>
