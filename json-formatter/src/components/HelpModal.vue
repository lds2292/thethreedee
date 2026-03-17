<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              도움말
            </div>
            <button class="btn-close" @click="$emit('update:modelValue', false)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">

            <!-- 기본 사용법 -->
            <section>
              <h3 class="section-title">기본 사용법</h3>
              <ol class="guide-list">
                <li>왼쪽 <strong>Input</strong> 영역에 JSON을 붙여넣거나 파일을 업로드합니다.</li>
                <li>유효한 JSON이면 하단에 <span class="badge valid">✓ Valid JSON</span> 이 표시됩니다.</li>
                <li>가운데 버튼으로 원하는 변환을 실행하면 오른쪽 <strong>Output</strong> 에 결과가 나타납니다.</li>
              </ol>
            </section>

            <!-- 기능 설명 -->
            <section>
              <h3 class="section-title">기능 설명</h3>
              <div class="feature-grid">
                <div class="feature-item">
                  <span class="feature-name">Format</span>
                  <span class="feature-desc">JSON을 들여쓰기가 있는 읽기 쉬운 형태로 변환합니다. Indent 옵션으로 2칸 · 4칸 · Tab을 선택할 수 있습니다.</span>
                </div>
                <div class="feature-item">
                  <span class="feature-name">Minify</span>
                  <span class="feature-desc">불필요한 공백과 줄바꿈을 제거해 최소 크기로 압축합니다. API 요청 바디 등에 사용합니다.</span>
                </div>
                <div class="feature-item">
                  <span class="feature-name">Sort Keys</span>
                  <span class="feature-desc">모든 객체의 키를 알파벳순으로 정렬합니다. 중첩된 객체에도 재귀 적용됩니다.</span>
                </div>
                <div class="feature-item">
                  <span class="feature-name">Unescape</span>
                  <span class="feature-desc">이스케이프된 JSON 문자열을 파싱합니다.<br>예: <code>"{\"key\":\"value\"}"</code> → 실제 JSON 객체</span>
                </div>
                <div class="feature-item">
                  <span class="feature-name">Escape</span>
                  <span class="feature-desc">JSON을 이스케이프된 문자열로 변환합니다. 다른 JSON의 값으로 삽입할 때 유용합니다.</span>
                </div>
                <div class="feature-item">
                  <span class="feature-name">JSON → CSV</span>
                  <span class="feature-desc">배열(array of objects) JSON을 CSV로 변환합니다. 중첩 객체는 <code>role.admin</code> 형식의 dot-notation으로 flatten 처리됩니다. 배열 값은 <code>;</code>로 구분됩니다.</span>
                </div>
                <div class="feature-item">
                  <span class="feature-name">Tree View</span>
                  <span class="feature-desc">Output의 <strong>[Tree]</strong> 탭에서 접기/펼치기 가능한 트리 구조로 JSON을 시각화합니다. 값을 클릭하면 클립보드에 복사됩니다.</span>
                </div>
              </div>
            </section>

            <!-- 키보드 단축키 -->
            <section>
              <h3 class="section-title">키보드 단축키</h3>
              <table class="shortcut-table">
                <tbody>
                  <tr>
                    <td><kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd></td>
                    <td>Format</td>
                  </tr>
                  <tr>
                    <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd></td>
                    <td>Minify</td>
                  </tr>
                  <tr>
                    <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></td>
                    <td>Output 다운로드 (.json)</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <!-- 팁 -->
            <section>
              <h3 class="section-title">팁</h3>
              <ul class="tip-list">
                <li>Tree View에서 <strong>Expand All / Collapse All</strong> 버튼으로 전체 노드를 한 번에 펼치거나 접을 수 있습니다.</li>
                <li>Tree View에서 단말 값(문자열, 숫자 등)을 클릭하면 해당 값만 클립보드에 복사됩니다.</li>
                <li>Input이 비어있지 않고 유효하면 <strong>Copy</strong> 버튼으로 Output을 복사하거나 <strong>Download</strong> 로 파일로 저장할 수 있습니다.</li>
                <li>지원 파일 형식: <code>.json</code></li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 14px;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #e0e0e0;
}

.btn-close {
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
.btn-close:hover { color: #e0e0e0; border-color: #4b5563; }

.modal-body {
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

section { display: flex; flex-direction: column; gap: 12px; }

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding-bottom: 8px;
  border-bottom: 1px solid #2a2a3a;
}

/* 기본 사용법 */
.guide-list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.7;
}
.guide-list strong { color: #d1d5db; }

.badge.valid {
  display: inline;
  font-size: 12px;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 4px;
  padding: 1px 6px;
}

/* 기능 설명 */
.feature-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  align-items: start;
  font-size: 13px;
  line-height: 1.6;
}

.feature-name {
  font-weight: 600;
  color: #a78bfa;
  padding-top: 1px;
}

.feature-desc {
  color: #9ca3af;
}
.feature-desc strong { color: #d1d5db; }
.feature-desc code {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #86efac;
  background: rgba(134, 239, 172, 0.08);
  padding: 1px 5px;
  border-radius: 3px;
}

/* 단축키 */
.shortcut-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.shortcut-table tr { border-bottom: 1px solid #1e1e2a; }
.shortcut-table tr:last-child { border-bottom: none; }
.shortcut-table td {
  padding: 8px 4px;
  color: #9ca3af;
  vertical-align: middle;
}
.shortcut-table td:first-child { width: 55%; }
.shortcut-table td:last-child { color: #d1d5db; }

kbd {
  display: inline-block;
  padding: 2px 7px;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  background: #1e1e2a;
  border: 1px solid #3a3a4f;
  border-radius: 5px;
  color: #c4b5fd;
}

/* 팁 */
.tip-list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.7;
}
.tip-list strong { color: #d1d5db; }
.tip-list code {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #93c5fd;
  background: rgba(147, 197, 253, 0.08);
  padding: 1px 5px;
  border-radius: 3px;
}

/* 트랜지션 */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.97); }
</style>
