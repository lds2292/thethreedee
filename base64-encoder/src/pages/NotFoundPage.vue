<template>
  <div class="not-found">
    <div class="glow" />
    <div class="content">
      <div class="code">404</div>
      <h1 class="title">페이지를 찾을 수 없습니다</h1>
      <p class="desc">
        요청하신 페이지가 존재하지 않거나<br>
        이동되었을 수 있습니다.
      </p>
      <a href="/" class="btn-home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        Base64 Encoder로 돌아가기
      </a>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: #0f0f13;
  overflow: hidden;
}

.glow {
  position: absolute;
  width: 600px;
  height: 400px;
  background: rgba(167, 139, 250, 0.08);
  border-radius: 50%;
  filter: blur(120px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 40px 24px;
}

.code {
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c4b5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #f0f0f5;
  margin: 0;
}

.desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 28px;
  background: #a78bfa;
  color: #0f0f13;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}

.btn-home:hover {
  background: #c4b5fd;
  transform: translateY(-2px);
}
</style>
