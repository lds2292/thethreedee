<template>
  <div class="summary">
    <!-- Worker -->
    <div v-if="hasWorker" class="card">
      <div class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        Worker
      </div>
      <div class="card-body">
        <div v-if="summary.worker.processes" class="row">
          <span class="key">worker_processes</span>
          <span class="val">{{ summary.worker.processes }}</span>
        </div>
        <div v-if="summary.worker.connections" class="row">
          <span class="key">worker_connections</span>
          <span class="val">{{ summary.worker.connections }}</span>
        </div>
      </div>
    </div>

    <!-- Gzip -->
    <div v-if="summary.gzip !== null" class="card">
      <div class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
        Gzip
      </div>
      <div class="card-body">
        <div class="row">
          <span class="key">gzip</span>
          <span class="val" :class="summary.gzip === 'on' ? 'val-on' : 'val-off'">{{ summary.gzip }}</span>
        </div>
      </div>
    </div>

    <!-- SSL -->
    <div v-if="summary.ssl.length" class="card">
      <div class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        SSL Certificates
      </div>
      <div class="card-body">
        <div v-for="(cert, i) in summary.ssl" :key="i" class="row">
          <span class="val mono">{{ cert }}</span>
        </div>
      </div>
    </div>

    <!-- Upstreams -->
    <div v-if="summary.upstreams.length" class="card">
      <div class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="12"/><polyline points="7 17 12 12 17 17"/><line x1="7" y1="21" x2="7" y2="17"/><line x1="17" y1="21" x2="17" y2="17"/></svg>
        Upstreams
      </div>
      <div class="card-body">
        <div v-for="(up, i) in summary.upstreams" :key="i" class="upstream">
          <div class="upstream-name">{{ up.name }}</div>
          <div v-for="(srv, j) in up.servers" :key="j" class="row sub">
            <span class="key">server</span>
            <span class="val mono">{{ srv }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Virtual Hosts -->
    <div v-if="summary.virtualHosts.length" class="card">
      <div class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Virtual Hosts
      </div>
      <div class="card-body">
        <div v-for="(vh, i) in summary.virtualHosts" :key="i" class="vhost">
          <div v-if="vh.serverName.length" class="row">
            <span class="key">server_name</span>
            <span class="val mono">{{ vh.serverName.join(', ') }}</span>
          </div>
          <div v-if="vh.listen.length" class="row">
            <span class="key">listen</span>
            <span class="val mono">{{ vh.listen.join(', ') }}</span>
          </div>
          <div v-if="i < summary.virtualHosts.length - 1" class="vhost-divider"></div>
        </div>
      </div>
    </div>

    <!-- Locations -->
    <div v-if="summary.locations.length" class="card">
      <div class="card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Locations
      </div>
      <div class="card-body">
        <div v-for="(loc, i) in summary.locations" :key="i" class="location">
          <div class="location-path">{{ loc.path }}</div>
          <div v-if="loc.proxyPass" class="row sub">
            <span class="key">proxy_pass</span>
            <span class="val mono">{{ loc.proxyPass }}</span>
          </div>
          <div v-if="loc.root" class="row sub">
            <span class="key">root</span>
            <span class="val mono">{{ loc.root }}</span>
          </div>
          <div v-if="loc.alias" class="row sub">
            <span class="key">alias</span>
            <span class="val mono">{{ loc.alias }}</span>
          </div>
          <div v-if="!loc.proxyPass && !loc.root && !loc.alias" class="row sub">
            <span class="val muted">—</span>
          </div>
          <div v-if="i < summary.locations.length - 1" class="vhost-divider"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="isEmpty" class="empty">
      <p>요약할 설정이 없습니다.<br>server {}, upstream {}, gzip, worker_processes 등을 확인하세요.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  summary: { type: Object, required: true },
})

const hasWorker = computed(() =>
  props.summary.worker.processes || props.summary.worker.connections
)

const isEmpty = computed(() =>
  !hasWorker.value &&
  props.summary.gzip === null &&
  !props.summary.ssl.length &&
  !props.summary.upstreams.length &&
  !props.summary.virtualHosts.length &&
  !props.summary.locations.length
)
</script>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  overflow: hidden;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  background: #1c1c26;
  border-bottom: 1px solid #2a2a3a;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.card-body {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 13px;
  line-height: 1.5;
}

.row.sub {
  padding-left: 14px;
}

.key {
  color: #60a5fa;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  flex-shrink: 0;
  min-width: 120px;
}

.val {
  color: #d1d5db;
  word-break: break-all;
}

.val.mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
}

.val.muted {
  color: #4b5563;
}

.val-on  { color: #4ade80; }
.val-off { color: #f87171; }

.upstream {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upstream-name {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #a78bfa;
  margin-bottom: 2px;
}

.vhost {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vhost-divider {
  height: 1px;
  background: #2a2a3a;
  margin: 6px 0;
}

.location {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-path {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #c4b5fd;
  margin-bottom: 2px;
}

.empty {
  text-align: center;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.8;
  padding: 40px 0;
}
</style>
