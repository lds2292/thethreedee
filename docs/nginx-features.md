# nginx Viewer — 기능 개선 아이디어

현재 구현(파서 + 포매터 + 트리 뷰 + 설정 요약) 기준으로 정리.
nginx 공식 문서(https://nginx.org/en/docs/)를 참고하여 정확도·품질 향상 관점에서 추가 작성.

---

## 우선순위 요약

| 순위 | 기능 | 이유 |
|---|---|---|
| 1 | Directive Context Validator | 가장 흔한 오류를 직접 잡아줌 |
| 2 | Location Priority Analyzer + Match Tester | 사용자가 가장 혼란스러워하는 부분 |
| 3 | SSL Security Scorer | 실무에서 즉각적인 가치 |
| 4 | Upstream Configuration Linter | 잡기 어려운 런타임 오류 예방 |
| 5 | Directive Inline Reference | 학습/참조 가치 |
| 6 | Block Inheritance Visualizer | 복잡한 설정 이해 지원 |
| 7 | Server Name Matcher | 고급 사용자 대상 |
| 8 | Known Pattern Library | UX 차별화 |
| 9 | Directive Completeness Checker | 체크리스트 형태 안내 |
| 10 | syntax highlighting (Formatted 탭) | 구현 쉽고 체감 품질 차이 큼 |
| 11 | 샘플 conf 제공 | 첫 방문자 이탈 방지 |
| 12 | 라인 번호 + 에러 줄 표시 | 파서 에러 UX 개선 |
| 13 | Diff 뷰 | 배포 전/후 설정 비교 |
| 14 | URL 공유 (`?config=base64`) | 설정 공유 편의 |

---

## 기능 상세

### 1. Directive Context Validator

각 지시자가 올바른 블록 안에 있는지 검증.

**nginx 블록 중첩 규칙:**
```
main
├── events      ← main에서만
├── http        ← main에서만
│   ├── upstream ← http 직계에서만
│   └── server   ← http에서만
│       └── location ← server 또는 location 안에서 (중첩 가능)
├── stream      ← main에서만
│   ├── upstream ← stream 직계에서만
│   └── server
└── mail
    └── server
```

**탐지 규칙 예시:**

| 지시자 | 허용 context | 위반 시 |
|---|---|---|
| `worker_processes` | main only | 오류 |
| `worker_connections` | events only | 오류 |
| `listen`, `server_name` | server only | 오류 |
| `proxy_pass` | location only | 오류 |
| `alias` | location only | 오류 |
| `upstream` 블록 | http / stream 직계 | 오류 |
| `ip_hash`, `least_conn` 등 | upstream only | 오류 |
| `error_log` | main, http, server, location 등 | 대부분 허용 |

---

### 2. Location Priority Analyzer + Match Tester

동일 server 블록 내 location들의 매칭 우선순위 시각화 + 특정 URL 입력 시 어떤 location이 매칭되는지 시뮬레이션.

**nginx location 매칭 우선순위:**

| 우선순위 | 문법 | 설명 |
|---|---|---|
| 1 | `= /exact` | 완전 일치. 매칭 즉시 종료 |
| 2 | `^~ /prefix` | 가장 긴 prefix 매칭 + 정규식 검사 건너뜀 |
| 3 | `~ regex` | 정규식, 대소문자 구분. 선언 순서대로 검사 |
| 4 | `~* regex` | 정규식, 대소문자 무시. 선언 순서대로 검사 |
| 5 | `/prefix` | 가장 긴 prefix 매칭 (정규식 없으면 사용) |
| 6 | `@name` | named location (내부 리다이렉트 전용) |

**탐지 항목:**
- 각 location에 실제 평가 순서 번호 표시
- 정규식 location 선언 순서가 의도와 다를 수 있음을 경고
- 동일 패턴 중복 선언 경고
- URL 입력 → 매칭되는 location 블록 하이라이트

---

### 3. SSL Security Scorer

SSL 관련 지시자를 분석해서 보안 등급(A+ / A / B / C)과 권고사항 출력.

**평가 항목:**

| 항목 | 기준 | 등급 영향 |
|---|---|---|
| `ssl_protocols`에 TLSv1.0 / TLSv1.1 포함 | 있으면 감점 | -2단계 |
| `ssl_ciphers`에 MD5, RC4, DES, aNULL, eNULL 포함 | 있으면 감점 | -2단계 |
| `ssl_session_cache none` 상태 | 성능 저하 | 경고 |
| `ssl_stapling on` + `resolver` 누락 | 오동작 가능 | 오류 |
| `ssl_session_tickets off` 미설정 | 권고 | -1단계 |
| `ssl_buffer_size 16k` | TTFB 저하 | 권고 |
| `ssl_prefer_server_ciphers` 미설정 | 권고 | -1단계 |

**권장 설정 (Mozilla Modern 기준):**
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 valid=300s;
ssl_buffer_size 4k;
```

---

### 4. Upstream Configuration Linter

upstream 블록의 설정 오류 및 비호환 조합 탐지.

**탐지 항목:**

| 상황 | 문제 | 메시지 |
|---|---|---|
| `keepalive` 있으나 `proxy_http_version 1.1` 누락 | keepalive 동작 안 함 | 오류 |
| `keepalive` 있으나 `proxy_set_header Connection ""` 누락 | keepalive 동작 안 함 | 오류 |
| `ip_hash` + `backup` 동시 사용 | 호환 불가 | 오류 |
| `ip_hash` + `hash` 또는 `random` 동시 사용 | 호환 불가 | 오류 |
| 서버 1개인 upstream에서 `max_fails`, `fail_timeout` 설정 | 무시됨 | 경고 |
| `least_time` 사용 | NGINX Plus 전용 | 경고 |
| `zone` 없이 `state` 파일 사용 | zone 필수 | 오류 |

---

### 5. Directive Inline Reference

트리 뷰에서 지시자 이름 hover / 클릭 시 공식 문서 요약 툴팁 표시.

**표시 정보:**
- 지시자 설명 (1~2줄)
- Valid context 목록
- 기본값(default)
- 소속 모듈 (core / http_core / ssl / upstream / proxy 등)
- nginx 공식 문서 링크

---

### 6. Block Inheritance Visualizer

http → server → location 계층에서 상속되는 지시자 값 시각화.

**동작 방식:**
- 트리에서 location 선택 시 상속된 값과 오버라이드된 값을 구분 표시
- 상속 대상 지시자: `root`, `index`, `keepalive_timeout`, `client_max_body_size`, `sendfile` 등
- `root`와 `alias` 공존 탐지 및 경고 (alias location에서 root는 무시됨)

---

### 7. Server Name Matcher

입력한 호스트명이 어떤 server 블록과 매칭되는지 시뮬레이션.

**nginx server_name 매칭 우선순위:**
1. 완전 일치: `example.com`
2. 앞 와일드카드 (가장 긴 것): `*.example.com`
3. 뒤 와일드카드 (가장 긴 것): `mail.*`
4. 정규식 (선언 순서): `~^www\d+\.example\.com$`
5. `default_server` 또는 첫 번째 server 블록

---

### 8. Known Pattern Library

설정에서 잘 알려진 패턴을 탐지해 이름 태깅.

| 탐지 패턴 | 태그 |
|---|---|
| `proxy_pass` + upstream 조합 | Reverse Proxy |
| `try_files $uri $uri/ /index.php` | PHP / SPA 라우팅 |
| `return 301 https://` | HTTP→HTTPS 리다이렉트 |
| `location ~* \.(jpg\|png\|css\|js)$` + `expires` | 정적 파일 캐싱 |
| `limit_req_zone` + `limit_req` | Rate Limiting |
| `ssl_stapling on` | OCSP Stapling |
| `auth_basic` | Basic Auth |
| `deny all` + `allow` | IP 접근 제어 |

---

### 9. Directive Completeness Checker

자주 빠뜨리는 필수/권장 지시자가 없으면 체크리스트 형태로 안내.

| 상황 | 누락 지시자 | 메시지 |
|---|---|---|
| SSL server | `ssl_session_cache` | 성능 경고 |
| SSL server | `ssl_stapling` | 권고 |
| upstream 사용 | `keepalive` | 성능 권고 |
| `proxy_pass` 있음 | `proxy_set_header Host` | 동작 오류 가능 |
| PHP location | `try_files` | 404 처리 미비 가능성 |
| 전체 | `error_page` | UX 권고 |

---

### 10. Formatted 탭 Syntax Highlighting

현재 plain text를 AST 기반으로 색상 적용 (Tree와 동일 팔레트).

| 요소 | 색상 |
|---|---|
| 블록명 (`http`, `server`, `location` 등) | #a78bfa (보라) |
| Directive key | #60a5fa (파랑) |
| 값 | #d1d5db (회색) |
| `include` | #f59e0b (노랑) |
| Comment | #6b7280 (어두운 회색, 이탤릭) |
| 중괄호 / 세미콜론 | #4b5563 |

---

### 11. 샘플 nginx.conf 제공

빈 화면에서 바로 시도해볼 수 있는 "예시 불러오기" 버튼.

| 샘플 | 포함 설정 |
|---|---|
| 기본 웹서버 | `http`, `server`, `location`, `root`, `index` |
| Reverse Proxy | `upstream`, `proxy_pass`, `proxy_set_header`, `keepalive` |
| SSL 서버 | `ssl_certificate`, `ssl_protocols`, `ssl_stapling`, HTTP→HTTPS 리다이렉트 |

---

### 12. 라인 번호 + 에러 줄 표시

- Formatted 탭에 라인 번호 추가
- 파서 에러 발생 시 해당 줄 번호를 에러 메시지에 표시
- input textarea에서 에러 줄 하이라이트

---

### 13. Diff 뷰

두 개의 nginx.conf를 나란히 붙여넣어 변경점 비교.
배포 전/후, 서버 간 설정 비교에 유용.

---

### 14. URL 공유

설정을 base64로 인코딩해 `?config=...` 파라미터로 URL 공유 링크 생성.
