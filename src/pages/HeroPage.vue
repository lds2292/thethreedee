<template>
  <div class="page">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        The 3D
      </div>
      <div class="nav-links">
        <RouterLink to="/gallery" class="nav-link">갤러리</RouterLink>
        <a href="#features" class="nav-link">기능</a>
        <a href="#formats" class="nav-link">지원 포맷</a>
      </div>
      <div class="nav-actions">
        <!-- <RouterLink to="/viewer" class="btn-nav-secondary">뷰어 열기</RouterLink> -->
        <button class="btn-nav-primary">시작하기</button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <!-- Background glow -->
      <div class="glow glow-1" />
      <div class="glow glow-2" />

      <div class="hero-content">
        <div class="badge">
          <span class="badge-dot" />
          3D 모델 공유 플랫폼
        </div>

        <h1 class="hero-title">
          당신의 3D 창작물을<br />
          <span class="gradient-text">세상과 공유하세요</span>
        </h1>

        <p class="hero-desc">
          STL, OBJ 파일을 업로드하고 인터랙티브 3D 뷰어로 공유하세요.<br />
          링크 하나로 누구나 브라우저에서 바로 감상할 수 있습니다.
        </p>

        <div class="hero-actions">
          <RouterLink to="/viewer" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            모델 업로드하기
          </RouterLink>
          <RouterLink to="/gallery" class="btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            갤러리 둘러보기
          </RouterLink>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">STL</span>
            <span class="stat-label">Binary / ASCII</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-number">OBJ</span>
            <span class="stat-label">Wavefront</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-number">실시간</span>
            <span class="stat-label">인터랙티브 뷰어</span>
          </div>
        </div>
      </div>

      <!-- 3D Preview Card -->
      <div class="hero-visual">
        <div class="viewer-card">
          <div class="viewer-card-header">
            <div class="traffic-lights">
              <span class="tl tl-red" />
              <span class="tl tl-yellow" />
              <span class="tl tl-green" />
            </div>
            <span class="viewer-card-title">model_preview.stl</span>
          </div>
          <div class="viewer-card-body">
            <div class="mock-canvas">
              <!-- Animated 3D wireframe SVG -->
              <svg class="wireframe" viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Grid floor -->
                <line x1="20" y1="180" x2="260" y2="180" stroke="#2a2a3a" stroke-width="1"/>
                <line x1="20" y1="160" x2="260" y2="160" stroke="#1e1e2a" stroke-width="1"/>
                <line x1="60" y1="145" x2="60" y2="185" stroke="#2a2a3a" stroke-width="1"/>
                <line x1="100" y1="145" x2="100" y2="185" stroke="#2a2a3a" stroke-width="1"/>
                <line x1="140" y1="145" x2="140" y2="185" stroke="#2a2a3a" stroke-width="1"/>
                <line x1="180" y1="145" x2="180" y2="185" stroke="#2a2a3a" stroke-width="1"/>
                <line x1="220" y1="145" x2="220" y2="185" stroke="#2a2a3a" stroke-width="1"/>
                <!-- 3D cube wireframe -->
                <g class="cube-group">
                  <!-- back face -->
                  <polygon points="100,50 180,50 180,130 100,130" stroke="#4b3f72" stroke-width="1.5" fill="rgba(167,139,250,0.03)"/>
                  <!-- top face -->
                  <polygon points="100,50 180,50 210,20 130,20" stroke="#6d5fa8" stroke-width="1.5" fill="rgba(167,139,250,0.06)"/>
                  <!-- right face -->
                  <polygon points="180,50 210,20 210,100 180,130" stroke="#6d5fa8" stroke-width="1.5" fill="rgba(167,139,250,0.08)"/>
                  <!-- front face -->
                  <polygon points="100,130 180,130 180,50 100,50" stroke="#a78bfa" stroke-width="2" fill="rgba(167,139,250,0.05)"/>
                  <!-- edges highlight -->
                  <line x1="100" y1="50" x2="130" y2="20" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.6"/>
                  <line x1="100" y1="130" x2="130" y2="100" stroke="#7c6bc2" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.4"/>
                  <line x1="130" y1="20" x2="130" y2="100" stroke="#8b78d4" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.4"/>
                </g>
                <!-- Orbit ring -->
                <ellipse cx="155" cy="155" rx="90" ry="20" stroke="#a78bfa" stroke-width="1" stroke-dasharray="6 4" opacity="0.25" class="orbit-ring"/>
                <!-- Vertex dots -->
                <circle cx="100" cy="50" r="3" fill="#a78bfa" opacity="0.9"/>
                <circle cx="180" cy="50" r="3" fill="#a78bfa" opacity="0.9"/>
                <circle cx="180" cy="130" r="3" fill="#a78bfa" opacity="0.7"/>
                <circle cx="100" cy="130" r="3" fill="#a78bfa" opacity="0.7"/>
                <circle cx="130" cy="20" r="3" fill="#c4b5fd" opacity="0.8"/>
                <circle cx="210" cy="20" r="3" fill="#c4b5fd" opacity="0.8"/>
                <circle cx="210" cy="100" r="3" fill="#c4b5fd" opacity="0.6"/>
              </svg>
            </div>
          </div>
          <div class="viewer-card-footer">
            <span class="footer-tag">● 실시간 렌더링</span>
            <span class="footer-tris">1.2K tris</span>
          </div>
        </div>

        <!-- Floating badges -->
        <div class="float-badge float-badge-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          드래그 앤 드롭
        </div>
        <div class="float-badge float-badge-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          링크로 공유
        </div>
        <div class="float-badge float-badge-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          iframe 임베드
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="section-label">주요 기능</div>
      <h2 class="section-title">모든 것이 브라우저 안에서</h2>
      <p class="section-desc">설치 없이, 계정 없이. 링크 하나로 3D 모델을 공유하세요.</p>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h3 class="feature-title">간편한 업로드</h3>
          <p class="feature-desc">드래그 앤 드롭으로 STL, OBJ 파일을 업로드하세요. Web Worker로 대용량 파일도 빠르게 처리합니다.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3 class="feature-title">인터랙티브 뷰어</h3>
          <p class="feature-desc">마우스로 회전, 확대, 이동. On-demand 렌더링으로 부드럽고 효율적인 3D 감상 경험을 제공합니다.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </div>
          <h3 class="feature-title">링크로 공유</h3>
          <p class="feature-desc">업로드한 모델의 고유 URL을 생성해 누구와도 공유하세요. SNS 미리보기 이미지도 자동 생성됩니다.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h3 class="feature-title">iframe 임베드</h3>
          <p class="feature-desc">블로그, 노션, 포트폴리오에 3D 뷰어를 직접 삽입하세요. 코드 한 줄로 인터랙티브 모델을 임베드할 수 있습니다.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 class="feature-title">커뮤니티 갤러리</h3>
          <p class="feature-desc">다른 크리에이터의 작품을 탐색하고 영감을 얻으세요. 좋아요, 댓글, 팔로우로 소통할 수 있습니다.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h3 class="feature-title">오픈 포맷 지원</h3>
          <p class="feature-desc">FDM 프린팅의 STL, 범용 3D의 OBJ를 지원합니다. 향후 GLTF, FBX, 3MF 포맷도 추가될 예정입니다.</p>
        </div>
      </div>
    </section>

    <!-- Formats Section -->
    <section id="formats" class="formats-section">
      <div class="formats-inner">
        <div class="formats-text">
          <div class="section-label">지원 포맷</div>
          <h2 class="section-title">주요 3D 포맷을 지원합니다</h2>
          <p class="section-desc">3D 프린팅부터 게임 에셋까지, 가장 널리 쓰이는 포맷으로 시작해 계속 확장해 나갑니다.</p>
          <div class="format-list">
            <div class="format-item">
              <span class="format-badge">.stl</span>
              <div>
                <div class="format-name">STL</div>
                <div class="format-desc-sm">Binary & ASCII — 3D 프린팅 표준 포맷</div>
              </div>
            </div>
            <div class="format-item">
              <span class="format-badge">.obj</span>
              <div>
                <div class="format-name">OBJ</div>
                <div class="format-desc-sm">Wavefront — 범용 3D 메시 포맷</div>
              </div>
            </div>
            <div class="format-item format-item-soon">
              <span class="format-badge format-badge-soon">.gltf</span>
              <div>
                <div class="format-name">GLTF / GLB <span class="soon-tag">곧 지원</span></div>
                <div class="format-desc-sm">Khronos — 웹 3D 표준 포맷</div>
              </div>
            </div>
          </div>
        </div>
        <div class="formats-visual">
          <div class="format-card-stack">
            <div class="fcard fcard-3">
              <div class="fcard-ext">.gltf</div>
              <div class="fcard-info">WebGL 최적화</div>
            </div>
            <div class="fcard fcard-2">
              <div class="fcard-ext">.obj</div>
              <div class="fcard-info">범용 메시</div>
            </div>
            <div class="fcard fcard-1">
              <div class="fcard-ext">.stl</div>
              <div class="fcard-info">3D 프린팅</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="glow glow-cta" />
      <h2 class="cta-title">지금 바로 시작해보세요</h2>
      <p class="cta-desc">설치 없이, 무료로. 3D 파일을 올리고 공유하는 데 30초면 충분합니다.</p>
      <RouterLink to="/viewer" class="btn-primary btn-large">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        파일 업로드하기
      </RouterLink>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        The 3D
      </div>
      <p class="footer-copy">© 2025 The 3D. 3D 모델 공유 플랫폼.</p>
    </footer>
  </div>
</template>

<script setup>
// Static landing page — no logic needed yet
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────────── */
.page {
  min-height: 100vh;
  background: #0f0f13;
  color: #e0e0e0;
  overflow-x: hidden;
}

/* ── Nav ──────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  background: rgba(15, 15, 19, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #1e1e2a;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 17px;
  font-weight: 700;
  color: #a78bfa;
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover { color: #e0e0e0; }

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-nav-secondary {
  padding: 7px 16px;
  font-size: 13px;
  color: #9ca3af;
  background: transparent;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.btn-nav-secondary:hover { color: #e0e0e0; border-color: #4b4b6a; }

.btn-nav-primary {
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #0f0f13;
  background: #a78bfa;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-nav-primary:hover { background: #c4b5fd; }

/* ── Hero ─────────────────────────────────────────────── */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  padding: 100px 80px 120px;
  min-height: calc(100vh - 60px);
  overflow: hidden;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.glow-1 {
  width: 500px;
  height: 500px;
  background: rgba(167, 139, 250, 0.12);
  top: -100px;
  left: -100px;
}

.glow-2 {
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.08);
  bottom: -50px;
  right: 200px;
}

.hero-content {
  flex: 1;
  max-width: 560px;
  position: relative;
  z-index: 1;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.25);
  border-radius: 20px;
  font-size: 12px;
  color: #c4b5fd;
  margin-bottom: 28px;
  letter-spacing: 0.02em;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #a78bfa;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.hero-title {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #f0f0f5;
  margin: 0 0 20px;
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c4b5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 17px;
  color: #9ca3af;
  line-height: 1.7;
  margin: 0 0 40px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  margin-bottom: 56px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: #0f0f13;
  background: #a78bfa;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.btn-primary:hover {
  background: #c4b5fd;
  transform: translateY(-2px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 500;
  color: #c4b5fd;
  background: rgba(167, 139, 250, 0.08);
  border: 1px solid rgba(167, 139, 250, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-secondary:hover {
  background: rgba(167, 139, 250, 0.15);
  border-color: rgba(167, 139, 250, 0.4);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: #f0f0f5;
  font-family: monospace;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  letter-spacing: 0.04em;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #2a2a3a;
}

/* ── Hero Visual ──────────────────────────────────────── */
.hero-visual {
  position: relative;
  flex-shrink: 0;
}

.viewer-card {
  width: 360px;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(167, 139, 250, 0.08);
}

.viewer-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #1a1a24;
  border-bottom: 1px solid #2a2a3a;
}

.traffic-lights {
  display: flex;
  gap: 6px;
}

.tl {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tl-red    { background: #ff5f57; }
.tl-yellow { background: #ffbd2e; }
.tl-green  { background: #28ca41; }

.viewer-card-title {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.viewer-card-body {
  padding: 16px;
}

.mock-canvas {
  width: 100%;
  background: #0f0f13;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wireframe {
  width: 100%;
  height: auto;
}

.cube-group {
  animation: rotate-hint 6s ease-in-out infinite;
  transform-origin: 155px 90px;
}

@keyframes rotate-hint {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg) translateX(4px); }
}

.orbit-ring {
  animation: orbit-spin 8s linear infinite;
  transform-origin: 155px 155px;
}

@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.viewer-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid #1e1e2a;
}

.footer-tag {
  font-size: 11px;
  color: #a78bfa;
}

.footer-tris {
  font-size: 11px;
  color: #6b7280;
  font-family: monospace;
}

/* Floating badges */
.float-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  background: rgba(22, 22, 29, 0.95);
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  font-size: 12px;
  color: #c4b5fd;
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: float 4s ease-in-out infinite;
}

.float-badge-1 {
  top: -16px;
  right: -20px;
  animation-delay: 0s;
}

.float-badge-2 {
  bottom: 60px;
  right: -40px;
  animation-delay: 1.3s;
}

.float-badge-3 {
  bottom: -16px;
  left: -20px;
  animation-delay: 2.6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ── Features ─────────────────────────────────────────── */
.features {
  padding: 100px 80px;
  text-align: center;
  border-top: 1px solid #1e1e2a;
}

.section-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #a78bfa;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f0f0f5;
  margin: 0 0 14px;
}

.section-desc {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 60px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
}

.feature-card {
  padding: 28px;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 16px;
  transition: border-color 0.2s, transform 0.2s;
}

.feature-card:hover {
  border-color: rgba(167, 139, 250, 0.3);
  transform: translateY(-3px);
}

.feature-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(167, 139, 250, 0.1);
  border-radius: 10px;
  color: #a78bfa;
  margin-bottom: 18px;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #f0f0f5;
  margin: 0 0 8px;
}

.feature-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* ── Formats ──────────────────────────────────────────── */
.formats-section {
  padding: 100px 80px;
  border-top: 1px solid #1e1e2a;
}

.formats-inner {
  display: flex;
  align-items: center;
  gap: 80px;
  max-width: 1000px;
  margin: 0 auto;
}

.formats-text {
  flex: 1;
}

.formats-text .section-title,
.formats-text .section-desc {
  text-align: left;
}

.format-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 36px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.format-item-soon { opacity: 0.5; }

.format-badge {
  padding: 6px 14px;
  background: rgba(167, 139, 250, 0.12);
  border: 1px solid rgba(167, 139, 250, 0.25);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #a78bfa;
  font-family: monospace;
  min-width: 60px;
  text-align: center;
}

.format-badge-soon {
  background: rgba(75, 75, 106, 0.2);
  border-color: #2a2a3a;
  color: #6b7280;
}

.format-name {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.format-desc-sm {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.soon-tag {
  font-size: 10px;
  padding: 2px 8px;
  background: rgba(75, 75, 106, 0.3);
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  color: #6b7280;
  font-weight: 500;
}

/* Format card stack visual */
.formats-visual {
  flex-shrink: 0;
  position: relative;
  width: 220px;
  height: 200px;
}

.format-card-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.fcard {
  position: absolute;
  width: 180px;
  padding: 20px 24px;
  border-radius: 14px;
  border: 1px solid #2a2a3a;
}

.fcard-1 {
  background: #1a1a26;
  bottom: 0;
  left: 0;
  z-index: 3;
  border-color: rgba(167, 139, 250, 0.3);
  box-shadow: 0 4px 24px rgba(167, 139, 250, 0.1);
}

.fcard-2 {
  background: #16161f;
  bottom: 30px;
  left: 18px;
  z-index: 2;
}

.fcard-3 {
  background: #131319;
  bottom: 60px;
  left: 36px;
  z-index: 1;
  opacity: 0.6;
}

.fcard-ext {
  font-size: 20px;
  font-weight: 700;
  color: #a78bfa;
  font-family: monospace;
  margin-bottom: 6px;
}

.fcard-info {
  font-size: 12px;
  color: #6b7280;
}

/* ── CTA ──────────────────────────────────────────────── */
.cta-section {
  position: relative;
  text-align: center;
  padding: 100px 40px;
  border-top: 1px solid #1e1e2a;
  overflow: hidden;
}

.glow-cta {
  width: 600px;
  height: 300px;
  background: rgba(167, 139, 250, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cta-title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f0f0f5;
  margin: 0 0 16px;
  position: relative;
  z-index: 1;
}

.cta-desc {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 40px;
  position: relative;
  z-index: 1;
}

.btn-large {
  padding: 16px 36px;
  font-size: 16px;
  border-radius: 14px;
  position: relative;
  z-index: 1;
}

/* ── Footer ───────────────────────────────────────────── */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 80px;
  border-top: 1px solid #1e1e2a;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #a78bfa;
}

.footer-copy {
  font-size: 13px;
  color: #4b5563;
  margin: 0;
}
</style>
