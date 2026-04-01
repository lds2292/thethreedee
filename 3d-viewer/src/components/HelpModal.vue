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
                <li>3D 파일을 화면 중앙에 <strong>드래그 앤 드롭</strong>하거나, 클릭하여 파일을 선택합니다.</li>
                <li>파일이 로드되면 자동으로 3D 모델이 렌더링됩니다.</li>
                <li>마우스를 사용해 모델을 회전, 확대/축소, 이동할 수 있습니다.</li>
              </ol>
            </section>

            <!-- 지원 포맷 -->
            <section>
              <h3 class="section-title">지원 포맷</h3>
              <table class="format-table">
                <thead>
                  <tr><th>포맷</th><th>확장자</th><th>설명</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>STL</code></td>
                    <td>.stl</td>
                    <td>3D 프린팅에서 가장 널리 사용되는 포맷. Binary/ASCII 모두 지원.</td>
                  </tr>
                  <tr>
                    <td><code>OBJ</code></td>
                    <td>.obj</td>
                    <td>Wavefront OBJ 포맷. 텍스트 기반으로 다양한 3D 소프트웨어와 호환.</td>
                  </tr>
                  <tr>
                    <td><code>GLTF</code></td>
                    <td>.gltf</td>
                    <td>GL Transmission Format. JSON 기반으로 메시, 재질, 텍스처 정보를 포함.</td>
                  </tr>
                  <tr>
                    <td><code>GLB</code></td>
                    <td>.glb</td>
                    <td>GLTF의 바이너리 버전. 모든 데이터가 하나의 파일에 포함되어 빠른 로딩 가능.</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <!-- 마우스 조작 -->
            <section>
              <h3 class="section-title">마우스 조작</h3>
              <div class="controls-grid">
                <div class="control-item">
                  <span class="control-key">좌클릭 드래그</span>
                  <span class="control-desc">모델 회전</span>
                </div>
                <div class="control-item">
                  <span class="control-key">스크롤 (휠)</span>
                  <span class="control-desc">확대 / 축소</span>
                </div>
                <div class="control-item">
                  <span class="control-key">우클릭 드래그</span>
                  <span class="control-desc">모델 이동 (팬)</span>
                </div>
                <div class="control-item">
                  <span class="control-key">더블클릭</span>
                  <span class="control-desc">뷰 초기화</span>
                </div>
              </div>
            </section>

            <!-- 제한 사항 -->
            <section>
              <h3 class="section-title">제한 사항</h3>
              <ul class="limit-list">
                <li>최대 파일 크기: <strong>1GB</strong></li>
                <li>GLTF 파일 내부의 외부 HTTP/HTTPS 리소스 참조는 보안상 차단됩니다.</li>
                <li>텍스처가 포함된 OBJ 파일의 경우 MTL 파일은 별도로 지원하지 않습니다.</li>
              </ul>
            </section>

            <!-- 프라이버시 -->
            <section>
              <h3 class="section-title">프라이버시</h3>
              <p class="privacy-note">
                업로드한 3D 파일은 <strong>서버로 전송되지 않습니다.</strong>
                모든 파일 파싱과 렌더링은 브라우저에서 직접 처리되며,
                페이지를 닫으면 데이터가 완전히 삭제됩니다.
                민감한 설계 파일도 안심하고 확인할 수 있습니다.
              </p>
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
  max-width: 560px;
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

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
}

.modal-title svg {
  color: #a78bfa;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.btn-close:hover {
  color: #f0f0f5;
  background: rgba(255, 255, 255, 0.06);
}

.modal-body {
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #a78bfa;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Guide list */
.guide-list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-list li {
  font-size: 13px;
  line-height: 1.65;
  color: #9ca3af;
}

.guide-list strong {
  color: #d1d5db;
}

/* Format table */
.format-table {
  border-collapse: collapse;
  font-size: 13px;
  width: 100%;
}

.format-table th {
  text-align: left;
  padding: 8px 12px;
  background: #1e1e2a;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 1px solid #2a2a3a;
  font-size: 12px;
}

.format-table td {
  padding: 8px 12px;
  color: #d1d5db;
  border-bottom: 1px solid #1e1e2a;
  font-size: 13px;
  line-height: 1.5;
}

.format-table code {
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  padding: 1px 6px;
  border-radius: 3px;
}

/* Controls grid */
.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #1e1e2a;
  border-radius: 6px;
  padding: 10px 12px;
}

.control-key {
  font-size: 12px;
  font-weight: 600;
  color: #a78bfa;
}

.control-desc {
  font-size: 13px;
  color: #9ca3af;
}

/* Limit list */
.limit-list {
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.limit-list li {
  font-size: 13px;
  line-height: 1.6;
  color: #9ca3af;
}

.limit-list strong {
  color: #d1d5db;
}

/* Privacy */
.privacy-note {
  font-size: 13px;
  line-height: 1.7;
  color: #9ca3af;
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
}

.privacy-note strong {
  color: #22c55e;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal {
  transform: scale(0.95);
}

.modal-leave-to .modal {
  transform: scale(0.95);
}
</style>
