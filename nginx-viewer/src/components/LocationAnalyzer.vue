<template>
  <div class="loc-view">
    <div v-if="servers.length === 0" class="empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3a3a4f" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <p>서버 블록 또는 location이 없습니다.</p>
    </div>

    <div v-for="(srv, si) in servers" :key="si" class="server-block">
      <!-- Server header -->
      <div class="server-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="server-name">{{ srv.serverNames.join(', ') || '(unnamed)' }}</span>
        <span v-if="srv.listens.length" class="server-listen">{{ srv.listens.join(', ') }}</span>
      </div>

      <!-- URL Match Tester -->
      <div class="match-tester">
        <div class="match-input-row">
          <span class="match-prefix">URL</span>
          <input
            v-model="testUrls[si]"
            class="match-input"
            placeholder="/api/users"
            spellcheck="false"
            @input="clearMatch(si)"
          />
          <button class="btn-test" @click="doMatch(si, srv.locations)">테스트</button>
          <button v-if="matchResults[si]" class="btn-clear" @click="clearMatch(si)">✕</button>
        </div>
        <div v-if="matchResults[si]" class="match-result" :class="matchResults[si].found ? 'match-hit' : 'match-miss'">
          <template v-if="matchResults[si].found">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{{ matchResults[si].reason }}</span>
          </template>
          <template v-else>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            매칭되는 location이 없습니다.
          </template>
        </div>
      </div>

      <!-- Location list -->
      <div v-if="srv.locations.length === 0" class="no-locations">location 블록이 없습니다.</div>
      <div v-else class="location-list">
        <div
          v-for="(loc, li) in annotated[si]"
          :key="li"
          class="location-row"
          :class="{
            'loc-matched': matchResults[si] && matchResults[si].index === li,
            'loc-duplicate': loc.duplicate,
          }"
        >
          <div class="loc-main">
            <!-- Modifier badge -->
            <span
              class="modifier-badge"
              :style="{ color: modInfo(loc.modifier).color, borderColor: modInfo(loc.modifier).color + '55' }"
            >{{ modInfo(loc.modifier).symbol || '∅' }}</span>

            <!-- Path -->
            <span class="loc-path">{{ loc.path }}</span>

            <!-- Match indicator -->
            <span v-if="matchResults[si] && matchResults[si].index === li" class="matched-tag">매칭됨</span>
            <span v-if="loc.duplicate" class="dup-tag">중복 패턴</span>
          </div>
          <div class="loc-meta">
            <span class="eval-note">{{ loc.evalNote }}</span>
            <span class="modifier-label" :style="{ color: modInfo(loc.modifier).color }">{{ modInfo(loc.modifier).label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <span class="legend-title">우선순위:</span>
      <span v-for="(info, mod) in MODIFIER_LABELS" :key="mod" class="legend-item" :style="{ color: info.color }">
        <code>{{ info.symbol || '∅' }}</code> {{ info.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { analyzeLocations, matchLocation, annotateEvaluationOrder, MODIFIER_LABELS } from '../utils/locationAnalyzer.js'

const props = defineProps({
  ast: { type: Array, required: true },
})

const servers    = computed(() => analyzeLocations(props.ast))
const annotated  = computed(() => servers.value.map(srv => annotateEvaluationOrder(srv.locations)))
const testUrls   = ref([])
const matchResults = ref([])

function modInfo(modifier) {
  return MODIFIER_LABELS[modifier] || { symbol: '?', label: '', color: '#6b7280' }
}

function doMatch(si, locations) {
  const uri = testUrls.value[si] || ''
  const result = matchLocation(locations, uri)
  matchResults.value = [...matchResults.value]
  matchResults.value[si] = result
    ? { found: true, index: result.index, reason: result.reason }
    : { found: false }
}

function clearMatch(si) {
  matchResults.value = [...matchResults.value]
  matchResults.value[si] = null
}
</script>

<style scoped>
.loc-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: #4b5563;
  font-size: 14px;
  text-align: center;
}

/* Server block */
.server-block {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  overflow: hidden;
}

.server-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: #1c1c26;
  border-bottom: 1px solid #2a2a3a;
  font-size: 12px;
  color: #9ca3af;
}

.server-name {
  font-family: monospace;
  font-weight: 700;
  color: #a78bfa;
}

.server-listen {
  color: #6b7280;
  font-family: monospace;
  font-size: 11px;
}

/* Match tester */
.match-tester {
  padding: 10px 14px;
  border-bottom: 1px solid #2a2a3a;
  background: #0f0f13;
}

.match-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.match-prefix {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.match-input {
  flex: 1;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #d1d5db;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  padding: 5px 10px;
  outline: none;
  transition: border-color 0.15s;
}

.match-input:focus { border-color: #a78bfa; }

.btn-test {
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.btn-test:hover { background: #6d28d9; }

.btn-clear {
  background: none;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #6b7280;
  font-size: 13px;
  padding: 4px 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.match-result {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 5px;
}

.match-hit  { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
.match-miss { background: rgba(239,68,68,0.08); color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); }

/* Location list */
.no-locations {
  padding: 12px 14px;
  font-size: 13px;
  color: #4b5563;
}

.location-list {
  display: flex;
  flex-direction: column;
}

.location-row {
  padding: 8px 14px;
  border-bottom: 1px solid #1e1e28;
  transition: background 0.1s;
}
.location-row:last-child { border-bottom: none; }
.location-row:hover { background: rgba(255,255,255,0.025); }

.location-row.loc-matched {
  background: rgba(74,222,128,0.07);
  border-left: 3px solid #4ade80;
  padding-left: 11px;
}

.location-row.loc-duplicate {
  background: rgba(251,146,60,0.05);
}

.loc-main {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
}

.modifier-badge {
  display: inline-block;
  min-width: 22px;
  text-align: center;
  padding: 1px 5px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.loc-path { color: #e5e7eb; word-break: break-all; }

.matched-tag {
  background: rgba(74,222,128,0.15);
  color: #4ade80;
  border-radius: 4px;
  padding: 1px 7px;
  font-size: 11px;
  font-family: sans-serif;
  font-weight: 600;
  margin-left: auto;
  flex-shrink: 0;
}

.dup-tag {
  background: rgba(251,146,60,0.15);
  color: #fb923c;
  border-radius: 4px;
  padding: 1px 7px;
  font-size: 11px;
  font-family: sans-serif;
  font-weight: 600;
  flex-shrink: 0;
}

.loc-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 3px;
  font-size: 11px;
  font-family: sans-serif;
}

.eval-note { color: #6b7280; }
.modifier-label { font-weight: 500; }

/* Legend */
.legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 10px 14px;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  font-size: 12px;
}

.legend-title {
  color: #6b7280;
  font-weight: 600;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.legend-item code {
  font-family: monospace;
  font-size: 12px;
  font-weight: 700;
}
</style>
