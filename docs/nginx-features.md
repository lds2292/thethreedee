# nginx Viewer — 기능 개선 아이디어

현재 구현 기준으로 사용 빈도가 높을 것들 위주로 정리.

---

## 임팩트 높은 기능

### 1. 에러/경고 하이라이팅 (가장 실용적)
파싱 성공해도 논리적 문제 감지:
- `listen 443` 인데 `ssl` 지시자 없음 → "SSL 포트인데 ssl 설정 없음" 경고
- `proxy_pass` URL이 `http://`로 끝나거나 슬래시 혼용 문제
- `worker_processes auto` 이외의 비권장 값

### 2. Diff 뷰 (실무에서 자주 쓸 것)
두 개의 nginx.conf를 나란히 붙여넣어 변경점 비교.
배포 전/후, 서버 간 설정 비교에 유용.

### 3. Formatted 탭에 syntax highlighting
현재는 plain text. directive key를 파랗게, 값을 회색, 블록명을 보라색으로 — Tree와 같은 색상 체계 적용.

### 4. 특정 노드 클릭 → 원본 위치 하이라이트
Tree에서 블록을 클릭하면 왼쪽 input textarea의 해당 줄로 스크롤 + 하이라이트.
대형 conf에서 위치 파악이 어려운 문제 해결.

---

## 중간 임팩트

### 5. 샘플 nginx.conf 제공
빈 화면에서 바로 시도해볼 수 있는 "예시 불러오기" 버튼 (기본 웹서버 / Reverse Proxy / SSL 3종).

### 6. Summary 탭 — location 클릭 시 Tree에서 해당 노드로 이동
Summary ↔ Tree 연동. 현재는 두 탭이 독립적.

### 7. `include` 파일 내용 직접 붙여넣기 지원
`include /etc/nginx/conf.d/*.conf;` 를 클릭하면 해당 파일 내용을 추가로 입력받는 모달 → 합쳐서 재파싱.

---

## 작은 polish

### 8. URL 공유 (`?config=base64encoded`)
설정을 URL에 인코딩해서 공유 링크 생성.

### 9. 라인 번호
현재 Formatted 탭에 라인 번호 없음. 에러 메시지에 줄 번호 표시하면 디버깅에 훨씬 편함.

---

## 우선순위 요약

| 순위 | 기능 | 이유 |
|---|---|---|
| 1 | syntax highlighting | 구현 쉽고 체감 품질 차이 큼 |
| 2 | 샘플 conf 제공 | 첫 방문자 이탈 방지 |
| 3 | 에러/경고 감지 | 차별화 포인트, 다른 도구에 없음 |
| 4 | 라인 번호 + 에러 줄 표시 | 파서 에러 UX 대폭 개선 |
