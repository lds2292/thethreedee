/**
 * nginx directive 문서 — 공식 문서(nginx.org) 기반
 * 공식 문서에 없는 항목은 doc: null
 */
export const DIRECTIVE_DOCS = {
  // ── 요청/응답 제어 ──────────────────────────────────────────
  client_max_body_size: {
    desc: '클라이언트 요청 본문의 최대 허용 크기. 초과 시 413 반환.',
    default: '1m',
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size',
  },
  client_body_timeout: {
    desc: '클라이언트 요청 본문을 읽는 타임아웃. 연속된 두 읽기 사이의 대기 시간.',
    default: '60s',
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_timeout',
  },
  send_timeout: {
    desc: '클라이언트에 응답을 전송하는 타임아웃. 연속된 두 쓰기 사이의 대기 시간.',
    default: '60s',
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#send_timeout',
  },
  // ── Keep-alive ──────────────────────────────────────────────
  keepalive_timeout: {
    desc: '서버가 keep-alive 클라이언트 연결을 유지하는 타임아웃. 0이면 keep-alive 비활성화.',
    default: '75s',
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#keepalive_timeout',
  },
  keepalive_requests: {
    desc: '하나의 keep-alive 연결에서 처리할 수 있는 최대 요청 수.',
    default: '1000',
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#keepalive_requests',
  },
  // ── 로그 ────────────────────────────────────────────────────
  access_log: {
    desc: '접근 로그 파일 경로와 포맷을 설정합니다. off로 비활성화 가능.',
    default: 'logs/access.log combined',
    doc: 'https://nginx.org/en/docs/http/ngx_http_log_module.html#access_log',
  },
  error_log: {
    desc: '에러 로그 파일 경로와 심각도(debug/info/notice/warn/error/crit)를 설정합니다.',
    default: 'logs/error.log error',
    doc: 'https://nginx.org/en/docs/ngx_core_module.html#error_log',
  },
  // ── 파일 서빙 ───────────────────────────────────────────────
  root: {
    desc: '요청에 대한 루트 디렉토리. URI가 이 경로에 추가되어 파일을 찾습니다.',
    default: 'html',
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#root',
  },
  alias: {
    desc: 'location 경로를 다른 파일 시스템 경로로 대체합니다. root와 달리 URI 앞부분을 제거하고 alias 경로로 교체.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#alias',
  },
  index: {
    desc: '디렉토리 요청 시 사용할 인덱스 파일을 정의합니다.',
    default: 'index.html',
    doc: 'https://nginx.org/en/docs/http/ngx_http_index_module.html#index',
  },
  try_files: {
    desc: '지정한 파일/디렉토리를 순서대로 확인하고 처음 존재하는 것을 서빙. 마지막 인자는 fallback URI 또는 상태 코드.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files',
  },
  // ── 압축 ────────────────────────────────────────────────────
  gzip: {
    desc: '응답 gzip 압축을 활성화하거나 비활성화합니다.',
    default: 'off',
    doc: 'https://nginx.org/en/docs/http/ngx_http_gzip_module.html#gzip',
  },
  gzip_types: {
    desc: 'gzip 압축을 적용할 MIME 타입 목록. text/html은 항상 포함.',
    default: 'text/html',
    doc: 'https://nginx.org/en/docs/http/ngx_http_gzip_module.html#gzip_types',
  },
  // ── 캐시 / 헤더 ─────────────────────────────────────────────
  expires: {
    desc: '응답에 Expires 및 Cache-Control 헤더를 추가합니다. 음수(-1), off, epoch, max, 또는 시간값 사용 가능.',
    default: 'off',
    doc: 'https://nginx.org/en/docs/http/ngx_http_headers_module.html#expires',
  },
  add_header: {
    desc: '응답 헤더를 추가합니다. always 옵션으로 모든 응답 코드에 적용 가능.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header',
  },
  // ── SSL ─────────────────────────────────────────────────────
  ssl_certificate: {
    desc: 'PEM 형식의 SSL/TLS 서버 인증서 파일 경로를 지정합니다.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate',
  },
  ssl_certificate_key: {
    desc: 'PEM 형식의 SSL/TLS 서버 인증서 개인키 파일 경로를 지정합니다.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_certificate_key',
  },
  ssl_protocols: {
    desc: '활성화할 SSL/TLS 프로토콜 버전을 지정합니다. TLSv1.2, TLSv1.3 권장.',
    default: 'TLSv1 TLSv1.1 TLSv1.2 TLSv1.3',
    doc: 'https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_protocols',
  },
  ssl_ciphers: {
    desc: '활성화할 암호화 알고리즘 목록을 지정합니다.',
    default: 'HIGH:!aNULL:!MD5',
    doc: 'https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_ciphers',
  },
  ssl_session_cache: {
    desc: 'SSL 세션 캐시 타입과 크기. shared:SSL:10m 권장으로 성능 향상.',
    default: 'none',
    doc: 'https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_cache',
  },
  ssl_session_timeout: {
    desc: '클라이언트가 세션 파라미터를 재사용할 수 있는 시간.',
    default: '5m',
    doc: 'https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_session_timeout',
  },
  // ── Proxy ────────────────────────────────────────────────────
  proxy_pass: {
    desc: '요청을 전달할 프록시 서버 프로토콜과 주소를 설정합니다.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass',
  },
  proxy_connect_timeout: {
    desc: '업스트림 서버와의 연결 타임아웃. 75초를 초과하지 않도록 권장.',
    default: '60s',
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_connect_timeout',
  },
  proxy_read_timeout: {
    desc: '업스트림 서버로부터 응답을 읽는 타임아웃. 연속된 두 읽기 작업 사이의 시간.',
    default: '60s',
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout',
  },
  proxy_send_timeout: {
    desc: '업스트림 서버에 요청을 전송하는 타임아웃.',
    default: '60s',
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_send_timeout',
  },
  proxy_buffering: {
    desc: '업스트림 서버 응답의 버퍼링 활성화 여부. off 시 응답을 즉시 클라이언트에 전달.',
    default: 'on',
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering',
  },
  proxy_buffer_size: {
    desc: '업스트림 서버 응답의 첫 부분을 읽는 버퍼 크기.',
    default: '4k|8k',
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size',
  },
  proxy_cache: {
    desc: '응답 캐싱에 사용할 공유 메모리 영역을 지정합니다. off로 비활성화.',
    default: 'off',
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache',
  },
  proxy_cache_valid: {
    desc: '응답 코드별 캐시 유효 시간을 설정합니다.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid',
  },
  // ── FastCGI ──────────────────────────────────────────────────
  fastcgi_pass: {
    desc: 'FastCGI 서버 주소를 설정합니다. PHP-FPM 등과 연동 시 사용.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_pass',
  },
  fastcgi_index: {
    desc: 'URI가 /로 끝날 때 추가할 FastCGI 인덱스 파일명.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_index',
  },
  fastcgi_param: {
    desc: 'FastCGI 서버에 전달할 파라미터를 설정합니다.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_param',
  },
  // ── 접근 제어 ────────────────────────────────────────────────
  limit_req: {
    desc: '요청 속도 제한을 설정합니다. limit_req_zone과 함께 사용.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req',
  },
  limit_conn: {
    desc: '동시 연결 수 제한을 설정합니다. limit_conn_zone과 함께 사용.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html#limit_conn',
  },
  deny: {
    desc: '특정 IP 또는 네트워크의 접근을 거부합니다. all로 전체 차단 가능.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_access_module.html#deny',
  },
  allow: {
    desc: '특정 IP 또는 네트워크의 접근을 허용합니다. deny all과 함께 화이트리스트 구성에 사용.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_access_module.html#allow',
  },
  auth_basic: {
    desc: 'HTTP Basic 인증을 활성화합니다. 값이 realm 문자열로 표시되며, off로 비활성화.',
    default: 'off',
    doc: 'https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html#auth_basic',
  },
  auth_basic_user_file: {
    desc: 'HTTP Basic 인증에 사용할 사용자:비밀번호 파일 경로를 지정합니다.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html#auth_basic_user_file',
  },
  // ── URL 재작성 / 리다이렉트 ──────────────────────────────────
  return: {
    desc: '처리를 중단하고 지정된 코드 또는 URL로 응답/리다이렉트합니다.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return',
  },
  rewrite: {
    desc: '정규식으로 URI를 재작성합니다. last/break/redirect/permanent 플래그로 동작 제어.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite',
  },
  // ── Upstream 전용 ────────────────────────────────────────────
  keepalive: {
    desc: '업스트림 서버와의 유휴 keepalive 연결 최대 수. 커넥션 풀 크기.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive',
  },
  least_conn: {
    desc: '활성 연결이 가장 적은 서버로 요청을 전달하는 로드밸런싱 방식.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_upstream_module.html#least_conn',
  },
  ip_hash: {
    desc: '클라이언트 IP 기반 해시로 항상 같은 서버로 요청을 전달. 세션 고정에 유용.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_upstream_module.html#ip_hash',
  },
  hash: {
    desc: '지정한 키(URI, 변수 등) 기반 해시 로드밸런싱. consistent 옵션으로 일관 해시 가능.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_upstream_module.html#hash',
  },
  zone: {
    desc: '워커 프로세스 간 상태 공유를 위한 공유 메모리 영역 이름과 크기.',
    default: null,
    doc: 'https://nginx.org/en/docs/http/ngx_http_upstream_module.html#zone',
  },
}
