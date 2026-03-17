<template>
  <div class="page">
    <header class="header">
      <div class="header-inner">
        <a class="logo" href="/">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <span class="logo-text">Toolzy</span>
        </a>
      </div>
    </header>

    <section class="body">
      <div class="code">404</div>
      <h1 class="title">Page Not Found</h1>
      <p class="desc">요청하신 페이지를 찾을 수 없습니다.</p>
      <a class="btn" href="/">홈으로 돌아가기</a>
    </section>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f0f13;
}

.header {
  height: 56px;
  background: #16161d;
  border-bottom: 1px solid #2a2a3a;
  display: flex;
  align-items: center;
  padding: 0 32px;
}

.header-inner {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #f0f0f5;
  letter-spacing: -0.02em;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
  text-align: center;
}

.code {
  font-size: 96px;
  font-weight: 800;
  color: #a78bfa;
  letter-spacing: -0.04em;
  line-height: 1;
  opacity: 0.8;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #f0f0f5;
}

.desc {
  font-size: 15px;
  color: #6b7280;
}

.btn {
  margin-top: 8px;
  display: inline-block;
  padding: 10px 24px;
  background: rgba(167, 139, 250, 0.12);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 8px;
  color: #a78bfa;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}

.btn:hover {
  background: rgba(167, 139, 250, 0.2);
  border-color: rgba(167, 139, 250, 0.5);
}
</style>
