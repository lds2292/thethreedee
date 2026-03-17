<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">도움말</h2>
          <button class="btn-close" @click="close">✕</button>
        </div>
        <div class="modal-body">

          <section class="section">
            <p class="overview">
              텍스트·URL·이미지를 <strong>Base64</strong>로 인코딩하거나 반대로 디코딩합니다.
              모든 처리는 브라우저에서 직접 이루어지며, 데이터가 서버로 전송되지 않습니다.
            </p>
          </section>

          <section class="section">
            <h3 class="section-title">모드 설명</h3>
            <div class="mode-list">
              <div class="mode-item">
                <span class="mode-name">Base64</span>
                <span class="mode-desc">텍스트를 Base64로 인코딩하거나 디코딩합니다. 한글·이모지 등 UTF-8 문자 완전 지원.</span>
              </div>
              <div class="mode-item">
                <span class="mode-name">URL</span>
                <span class="mode-desc">URL 특수문자를 퍼센트 인코딩합니다 (<code>encodeURIComponent</code> 기반).</span>
              </div>
              <div class="mode-item">
                <span class="mode-name">Image → Base64</span>
                <span class="mode-desc">이미지 파일을 <code>data:image/...;base64,...</code> 형식의 Data URI로 변환합니다. 드래그 앤 드롭 지원.</span>
              </div>
            </div>
          </section>

          <section class="section">
            <h3 class="section-title">Base64 Variant</h3>
            <p class="section-sub">Base64 탭에서 인코딩 방식을 선택할 수 있습니다.</p>
            <table class="table">
              <thead>
                <tr>
                  <th>Variant</th>
                  <th>특징</th>
                  <th>주요 사용처</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>Standard</code></td>
                  <td><code>+</code>, <code>/</code>, <code>=</code> 패딩</td>
                  <td>일반 인코딩 (RFC 4648 §4)</td>
                </tr>
                <tr>
                  <td><code>Base64url</code></td>
                  <td><code>-</code>, <code>_</code>, 패딩 없음</td>
                  <td>JWT, OAuth 2.0, URL/파일명 (RFC 4648 §5)</td>
                </tr>
                <tr>
                  <td><code>No Padding</code></td>
                  <td>Standard 문자, <code>=</code> 제거</td>
                  <td>Firebase, AWS Cognito</td>
                </tr>
                <tr>
                  <td><code>MIME</code></td>
                  <td>76자마다 줄바꿈 (<code>\r\n</code>)</td>
                  <td>이메일 첨부 (RFC 2045)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="section">
            <h3 class="section-title">사용 방법</h3>
            <ol class="steps">
              <li>상단 탭에서 모드를 선택합니다.</li>
              <li>왼쪽 패널에 텍스트를 입력하거나, 이미지 모드에서는 파일을 드래그합니다.</li>
              <li><strong>Encode</strong> 또는 <strong>Decode</strong> 버튼을 클릭합니다.</li>
              <li>오른쪽 패널의 결과를 <strong>Copy</strong>하거나 <strong>Download</strong>합니다.</li>
              <li><strong>Swap</strong> 버튼으로 입력과 출력을 바꿔 연속 변환이 가능합니다.</li>
            </ol>
          </section>

          <section class="section">
            <h3 class="section-title">키보드 단축키</h3>
            <table class="table">
              <thead>
                <tr><th>단축키</th><th>동작</th></tr>
              </thead>
              <tbody>
                <tr><td><kbd>Ctrl</kbd> + <kbd>Enter</kbd></td><td>Encode</td></tr>
                <tr><td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd></td><td>Decode</td></tr>
              </tbody>
            </table>
          </section>

          <section class="section">
            <h3 class="section-title">에러 안내</h3>
            <div class="error-list">
              <div class="error-item">
                <span class="error-msg">유효하지 않은 Base64</span>
                <span class="error-desc">입력값에 Base64에 허용되지 않는 문자가 포함되어 있습니다. Variant에 맞는 문자열인지 확인하세요.</span>
              </div>
              <div class="error-item">
                <span class="error-msg">유효하지 않은 URL 인코딩</span>
                <span class="error-desc">퍼센트 기호(%) 뒤에 유효한 16진수가 오지 않는 경우 발생합니다.</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
function close() { emit('update:modelValue', false) }
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  width: 100%;
  max-width: 580px;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #2a2a3a;
  flex-shrink: 0;
}

.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #f0f0f5;
}

.btn-close {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 15px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
}

.btn-close:hover { color: #f0f0f5; background: #2a2a3a; }

.modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Sections */
.section { display: flex; flex-direction: column; gap: 10px; }

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.section-sub { font-size: 12px; color: #6b7280; margin-top: -4px; }

.overview {
  font-size: 13px;
  color: #e0e0e0;
  line-height: 1.7;
}

.overview strong { color: #f0f0f5; }

/* Mode list */
.mode-list { display: flex; flex-direction: column; gap: 8px; }

.mode-item {
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.mode-name {
  font-size: 12px;
  font-weight: 600;
  color: #a78bfa;
  font-family: monospace;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.2);
  border-radius: 4px;
  padding: 1px 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.mode-desc {
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.6;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.table th {
  text-align: left;
  padding: 6px 10px;
  color: #6b7280;
  font-weight: 600;
  border-bottom: 1px solid #2a2a3a;
}

.table td {
  padding: 7px 10px;
  color: #e0e0e0;
  border-bottom: 1px solid #1e1e2a;
  vertical-align: top;
}

.table tr:last-child td { border-bottom: none; }

/* Steps */
.steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 20px;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.6;
}

.steps li strong { color: #e0e0e0; }

/* Keyboard */
kbd {
  display: inline-block;
  padding: 1px 6px;
  background: #1e1e2a;
  border: 1px solid #3a3a4f;
  border-radius: 4px;
  font-family: monospace;
  font-size: 11px;
  color: #c4b5fd;
}

/* Error list */
.error-list { display: flex; flex-direction: column; gap: 10px; }

.error-item { display: flex; flex-direction: column; gap: 3px; }

.error-msg {
  font-size: 12px;
  font-weight: 600;
  color: #f87171;
  font-family: monospace;
}

.error-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
}

code {
  font-family: monospace;
  font-size: 11px;
  color: #c4b5fd;
  background: rgba(167, 139, 250, 0.08);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
