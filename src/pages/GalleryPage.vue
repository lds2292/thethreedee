<template>
  <div class="page">
    <!-- Nav -->
    <nav class="nav">
      <RouterLink to="/" class="nav-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        The 3D
      </RouterLink>
      <RouterLink to="/viewer" class="btn-upload">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        </svg>
        업로드
      </RouterLink>
    </nav>

    <!-- Header -->
    <div class="gallery-header">
      <h1 class="gallery-title">갤러리</h1>
      <p class="gallery-desc">커뮤니티가 공유한 3D 모델을 탐색하세요</p>

      <!-- Search -->
      <div class="gallery-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="모델명, 작성자 검색..."
        />
      </div>

      <!-- Filters -->
      <div class="filter-row">
        <div class="filter-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="filter-tab"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="filter-right">
          <!-- Format filter -->
          <div class="select-wrap">
            <select v-model="formatFilter" class="filter-select">
              <option value="">모든 포맷</option>
              <option value="stl">STL</option>
              <option value="obj">OBJ</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="select-arrow">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <!-- Sort -->
          <div class="select-wrap">
            <select v-model="sortBy" class="filter-select">
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
              <option value="downloads">다운로드순</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="select-arrow">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="gallery-body">
      <div v-if="filteredModels.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3a3a4f" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>검색 결과가 없습니다</p>
      </div>

      <div v-else class="model-grid">
        <div
          v-for="model in filteredModels"
          :key="model.id"
          class="model-card"
          @click="openModel(model)"
        >
          <!-- Thumbnail -->
          <div class="card-thumb">
            <ModelThumb :seed="model.id" :color="model.color" />
            <span class="format-badge">{{ model.format.toUpperCase() }}</span>
          </div>

          <!-- Info -->
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-title">{{ model.name }}</span>
            </div>
            <div class="card-meta">
              <span class="card-author">
                <span class="avatar" :style="{ background: model.avatarColor }">
                  {{ model.author[0] }}
                </span>
                {{ model.author }}
              </span>
              <span class="card-tris">{{ model.tris }} tris</span>
            </div>
            <div class="card-footer">
              <button class="like-btn" :class="{ liked: model.liked }" @click.stop="toggleLike(model)">
                <svg width="13" height="13" viewBox="0 0 24 24" :fill="model.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {{ model.likes }}
              </button>
              <span class="card-date">{{ model.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModelThumb from '../components/ModelThumb.vue'

const searchQuery = ref('')
const activeTab = ref('all')
const formatFilter = ref('')
const sortBy = ref('latest')

const tabs = [
  { label: '전체', value: 'all' },
  { label: '3D 프린팅', value: 'print' },
  { label: '캐릭터', value: 'character' },
  { label: '건축', value: 'architecture' },
  { label: '소품', value: 'props' },
]

const models = ref([
  { id: 1,  name: 'Minimalist Vase',       author: 'jiyeon_k',  format: 'stl', tris: '2.4K', likes: 128, liked: false, date: '2일 전',  color: '#a78bfa', avatarColor: '#7c3aed', category: 'print',        tags: [] },
  { id: 2,  name: 'Robot Head v2',         author: 'mech_park',  format: 'obj', tris: '8.1K', likes: 342, liked: false, date: '5일 전',  color: '#818cf8', avatarColor: '#4338ca', category: 'character',     tags: [] },
  { id: 3,  name: 'Cable Organizer',       author: 'maker_cho',  format: 'stl', tris: '0.6K', likes: 57,  liked: false, date: '1주 전', color: '#34d399', avatarColor: '#059669', category: 'props',         tags: [] },
  { id: 4,  name: 'Low-poly Fox',          author: 'artlab_lee', format: 'obj', tris: '1.2K', likes: 215, liked: false, date: '1주 전', color: '#fb923c', avatarColor: '#ea580c', category: 'character',     tags: [] },
  { id: 5,  name: 'Modular Shelf Bracket', author: 'jiyeon_k',  format: 'stl', tris: '0.3K', likes: 44,  liked: false, date: '2주 전', color: '#f472b6', avatarColor: '#db2777', category: 'print',        tags: [] },
  { id: 6,  name: 'Tokyo Tower',           author: 'arch_kim',  format: 'obj', tris: '14K',  likes: 489, liked: false, date: '2주 전', color: '#60a5fa', avatarColor: '#2563eb', category: 'architecture',  tags: [] },
  { id: 7,  name: 'Gear Set',              author: 'mech_park',  format: 'stl', tris: '5.8K', likes: 93,  liked: false, date: '3주 전', color: '#facc15', avatarColor: '#ca8a04', category: 'props',         tags: [] },
  { id: 8,  name: 'Organic Lamp Shade',    author: 'artlab_lee', format: 'obj', tris: '3.3K', likes: 176, liked: false, date: '1달 전', color: '#c084fc', avatarColor: '#9333ea', category: 'print',        tags: [] },
  { id: 9,  name: 'Tiny House',            author: 'arch_kim',  format: 'stl', tris: '4.7K', likes: 261, liked: false, date: '1달 전', color: '#4ade80', avatarColor: '#16a34a', category: 'architecture',  tags: [] },
])

function toggleLike(model) {
  model.liked = !model.liked
  model.likes += model.liked ? 1 : -1
}

function openModel(model) {
  // TODO: 라우팅 /models/:id
  console.log('open', model.id)
}

const filteredModels = computed(() => {
  let list = models.value

  if (activeTab.value !== 'all') {
    list = list.filter(m => m.category === activeTab.value)
  }
  if (formatFilter.value) {
    list = list.filter(m => m.format === formatFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(m =>
      m.name.toLowerCase().includes(q) || m.author.toLowerCase().includes(q)
    )
  }

  if (sortBy.value === 'popular') {
    list = [...list].sort((a, b) => b.likes - a.likes)
  }

  return list
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #0f0f13;
  color: #e0e0e0;
}

/* ── Nav ──────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 40px;
  height: 60px;
  background: rgba(15, 15, 19, 0.9);
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
  text-decoration: none;
  flex-shrink: 0;
}

.gallery-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  padding: 0 16px;
  color: #6b7280;
  margin-bottom: 24px;
  transition: border-color 0.2s;
}

.gallery-search:focus-within {
  border-color: rgba(167, 139, 250, 0.4);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #e0e0e0;
  height: 42px;
}

.search-input::placeholder { color: #4b5563; }

.btn-upload {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #0f0f13;
  background: #a78bfa;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.btn-upload:hover { background: #c4b5fd; }

/* ── Gallery Header ───────────────────────────────────── */
.gallery-header {
  padding: 48px 40px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f0f0f5;
  margin: 0 0 6px;
}

.gallery-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #1e1e2a;
  padding-bottom: 0;
}

.filter-tabs {
  display: flex;
  gap: 4px;
}

.filter-tab {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}

.filter-tab:hover { color: #c4b5fd; }

.filter-tab.active {
  color: #a78bfa;
  border-bottom-color: #a78bfa;
}

.filter-right {
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
}

.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.filter-select {
  appearance: none;
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 6px 32px 6px 12px;
  font-size: 13px;
  color: #9ca3af;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.filter-select:hover { border-color: #4b4b6a; }

.select-arrow {
  position: absolute;
  right: 10px;
  color: #6b7280;
  pointer-events: none;
}

/* ── Gallery Body ─────────────────────────────────────── */
.gallery-body {
  padding: 32px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 100px 0;
  color: #4b5563;
  font-size: 14px;
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* ── Model Card ───────────────────────────────────────── */
.model-card {
  background: #16161d;
  border: 1px solid #2a2a3a;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.model-card:hover {
  border-color: rgba(167, 139, 250, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.card-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #0f0f13;
  overflow: hidden;
}

.format-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  background: rgba(15, 15, 19, 0.85);
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
  color: #a78bfa;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.card-info {
  padding: 14px 16px;
}

.card-title-row {
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #f0f0f5;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.card-tris {
  font-size: 11px;
  color: #4b5563;
  font-family: monospace;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #1e1e2a;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.like-btn:hover { color: #f472b6; }
.like-btn.liked  { color: #f472b6; }

.card-date {
  font-size: 11px;
  color: #4b5563;
}
</style>
