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
      <h1>이용약관</h1>
      <p class="policy-en">Terms of Service</p>
      <p class="updated">최종 수정일: 2025년 6월 1일</p>

      <section>
        <h2>1. 서비스 개요</h2>
        <p>
          toolzydev(이하 "서비스")는 개발자를 위한 무료 온라인 도구 모음입니다.
          JSON Formatter, Base64 Encoder, Regex Tester, Cron Tester, 3D Viewer, nginx Viewer 등
          다양한 개발 도구를 브라우저에서 무료로 제공합니다.
        </p>
      </section>

      <section>
        <h2>2. 이용 조건</h2>
        <ul>
          <li>서비스는 <strong>무료</strong>로 제공되며, 별도의 회원가입이나 로그인 없이 이용할 수 있습니다.</li>
          <li>서비스는 개인적, 교육적, 상업적 목적으로 자유롭게 사용할 수 있습니다.</li>
          <li>서비스를 이용한 불법적인 활동은 금지됩니다.</li>
          <li>서비스의 정상적인 운영을 방해하는 행위(과도한 자동화 요청, 보안 취약점 악용 등)는 금지됩니다.</li>
        </ul>
      </section>

      <section>
        <h2>3. 데이터 처리</h2>
        <p>
          서비스의 모든 도구는 사용자의 브라우저에서 실행됩니다.
          사용자가 입력하거나 업로드한 데이터(JSON, 텍스트, 3D 모델 파일 등)는 서버로 전송되지 않으며,
          브라우저를 닫으면 완전히 삭제됩니다.
        </p>
        <p>
          자세한 내용은 <a href="/privacy/">개인정보처리방침</a>을 참고하세요.
        </p>
      </section>

      <section>
        <h2>4. 지적재산권</h2>
        <p>
          서비스의 디자인, 코드, 로고, 콘텐츠에 대한 지적재산권은 toolzydev에 있습니다.
          사용자가 서비스를 통해 처리한 데이터(입력 데이터, 변환 결과 등)에 대한 권리는 사용자에게 있습니다.
        </p>
      </section>

      <section>
        <h2>5. 면책 조항</h2>
        <ul>
          <li>서비스는 <strong>"있는 그대로(AS IS)"</strong> 제공되며, 정확성, 완전성 또는 특정 목적에의 적합성에 대해 보증하지 않습니다.</li>
          <li>서비스 이용으로 인해 발생하는 직접적, 간접적, 부수적 손해에 대해 책임지지 않습니다.</li>
          <li>서비스의 변환/검증 결과는 참고용이며, 프로덕션 환경에 적용하기 전 반드시 별도로 검증하시기 바랍니다.</li>
          <li>서비스의 가용성은 보장되지 않으며, 사전 통지 없이 중단될 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2>6. 서비스 변경</h2>
        <p>
          toolzydev는 서비스의 기능, 디자인, 요금 정책을 사전 통지 없이 변경할 수 있습니다.
          중대한 변경이 있을 경우 서비스 내에 공지합니다.
        </p>
      </section>

      <section>
        <h2>7. 약관 변경</h2>
        <p>
          이 이용약관은 필요에 따라 변경될 수 있습니다.
          변경 시 이 페이지에 업데이트하며, 최종 수정일을 통해 최신 버전을 확인할 수 있습니다.
          변경 후 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 간주합니다.
        </p>
      </section>

      <section>
        <h2>8. 문의</h2>
        <p>
          이용약관에 대한 문의 사항이 있으시면
          <a href="mailto:toolzy.eden@gmail.com">toolzy.eden@gmail.com</a>으로 이메일을 보내주세요.
        </p>
      </section>
    </main>

    <footer class="policy-footer">
      <a href="/">toolzydev</a>
      <span class="sep">·</span>
      <a href="/privacy/">개인정보처리방침</a>
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
