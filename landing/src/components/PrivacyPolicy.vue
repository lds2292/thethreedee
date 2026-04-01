<template>
  <div class="policy-page">
    <header class="policy-header">
      <div class="policy-header-inner">
        <a href="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          toolzydev
        </a>
      </div>
    </header>

    <main class="policy-content">
      <h1>개인정보처리방침</h1>
      <p class="policy-en">Privacy Policy</p>
      <p class="updated">최종 수정일: 2025년 6월 1일</p>

      <section>
        <h2>1. 수집하는 개인정보</h2>
        <p>
          toolzydev는 <strong>사용자의 개인정보를 수집하지 않습니다.</strong>
          회원가입, 로그인, 이메일 입력 등 어떠한 형태의 개인정보 입력도 요구하지 않습니다.
        </p>
      </section>

      <section>
        <h2>2. 데이터 처리 방식</h2>
        <p>
          toolzydev의 모든 도구(JSON Formatter, Base64 Encoder, Regex Tester, Cron Tester, 3D Viewer, nginx Viewer)는
          <strong>100% 클라이언트 사이드(브라우저)에서 동작</strong>합니다.
        </p>
        <ul>
          <li>사용자가 입력하거나 업로드한 데이터는 서버로 전송되지 않습니다.</li>
          <li>모든 데이터 처리는 사용자의 브라우저 내에서만 이루어집니다.</li>
          <li>페이지를 닫으면 입력한 데이터는 완전히 삭제됩니다.</li>
          <li>3D 모델 파일, JSON 데이터, 정규식 등 어떤 입력 데이터도 외부로 전송되거나 저장되지 않습니다.</li>
        </ul>
      </section>

      <section>
        <h2>3. 쿠키 및 광고</h2>
        <p>
          toolzydev는 Google AdSense를 통해 광고를 게재합니다. Google AdSense는
          사용자의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용할 수 있습니다.
        </p>
        <ul>
          <li>Google의 쿠키 사용에 대한 자세한 내용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google 광고 정책</a>을 참고하세요.</li>
          <li>사용자는 브라우저 설정에서 쿠키를 관리하거나 비활성화할 수 있습니다.</li>
          <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google 광고 설정</a>에서 맞춤 광고를 해제할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2>4. 분석 도구</h2>
        <p>
          toolzydev는 서비스 개선을 위해 웹 분석 도구를 사용할 수 있습니다.
          수집되는 정보는 익명화된 트래픽 통계(페이지 조회수, 방문 시간, 브라우저 종류 등)에 한정되며,
          개인을 식별할 수 있는 정보는 수집하지 않습니다.
        </p>
      </section>

      <section>
        <h2>5. 제3자 제공</h2>
        <p>
          toolzydev는 사용자의 데이터를 제3자에게 판매, 대여 또는 제공하지 않습니다.
          광고 서비스(Google AdSense)를 제외하고 외부 서비스와 데이터를 공유하지 않습니다.
        </p>
      </section>

      <section>
        <h2>6. 아동 보호</h2>
        <p>
          toolzydev는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
          만 14세 미만 사용자의 개인정보가 수집된 것으로 확인될 경우 즉시 삭제합니다.
        </p>
      </section>

      <section>
        <h2>7. 변경 사항</h2>
        <p>
          이 개인정보처리방침은 필요에 따라 변경될 수 있습니다.
          변경 시 이 페이지에 업데이트하며, 최종 수정일을 통해 최신 버전을 확인할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>8. 문의</h2>
        <p>
          개인정보처리방침에 대한 문의 사항이 있으시면
          <a href="mailto:toolzy.eden@gmail.com">toolzy.eden@gmail.com</a>으로 이메일을 보내주세요.
        </p>
      </section>
    </main>

    <footer class="policy-footer">
      <a href="/">toolzydev</a>
      <span class="sep">·</span>
      <a href="/terms/">이용약관</a>
    </footer>
  </div>
</template>

<style scoped>
.policy-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f0f13;
  color: #d1d5db;
}

.policy-header {
  height: 56px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  padding: 0 32px;
}

.policy-header-inner {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a78bfa;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  transition: opacity 0.15s;
}

.back-link:hover {
  opacity: 0.8;
}

.policy-content {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 32px 64px;
  flex: 1;
}

.policy-content h1 {
  font-size: 32px;
  font-weight: 800;
  color: #f0f0f5;
  margin-bottom: 4px;
}

.policy-en {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.updated {
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 40px;
}

.policy-content section {
  margin-bottom: 32px;
}

.policy-content h2 {
  font-size: 18px;
  font-weight: 700;
  color: #f0f0f5;
  margin-bottom: 12px;
}

.policy-content p {
  font-size: 15px;
  line-height: 1.75;
  color: #9ca3af;
  margin-bottom: 12px;
}

.policy-content ul {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.policy-content li {
  font-size: 15px;
  line-height: 1.65;
  color: #9ca3af;
}

.policy-content a {
  color: #a78bfa;
  text-decoration: none;
  transition: opacity 0.15s;
}

.policy-content a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.policy-content strong {
  color: #d1d5db;
  font-weight: 600;
}

.policy-footer {
  padding: 32px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  border-top: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.policy-footer a {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;
}

.policy-footer a:hover {
  color: #a78bfa;
}

.sep {
  color: #3a3a4f;
}
</style>
