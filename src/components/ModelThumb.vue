<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="thumb-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Dark grid floor -->
    <line v-for="i in 6" :key="'h'+i"
      :x1="10" :y1="H * 0.55 + (i-1) * 10" :x2="W - 10" :y2="H * 0.55 + (i-1) * 10"
      stroke="#1e1e2a" stroke-width="1"
    />
    <line v-for="i in 8" :key="'v'+i"
      :x1="10 + (i-1) * (W / 7)" :y1="H * 0.52" :x2="10 + (i-1) * (W / 7)" :y2="H - 5"
      stroke="#1e1e2a" stroke-width="1"
    />

    <!-- Shape -->
    <g :style="{ transform: `translate(${cx}px, ${cy}px)` }">
      <!-- back face -->
      <polygon :points="backFace" :fill="`${color}08`" :stroke="`${color}40`" stroke-width="1.2"/>
      <!-- top face -->
      <polygon :points="topFace" :fill="`${color}10`" :stroke="`${color}55`" stroke-width="1.2"/>
      <!-- right face -->
      <polygon :points="rightFace" :fill="`${color}14`" :stroke="`${color}60`" stroke-width="1.2"/>
      <!-- front face -->
      <polygon :points="frontFace" :fill="`${color}0d`" :stroke="color" stroke-width="1.8"/>
    </g>

    <!-- Glow -->
    <ellipse :cx="cx" :cy="H * 0.72" :rx="r * 1.1" ry="8"
      :fill="color" opacity="0.1" filter="url(#blur)"
    />
    <defs>
      <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  seed:  { type: Number, default: 1 },
  color: { type: String, default: '#a78bfa' },
})

const W = 280
const H = 210

// Deterministic "random" from seed
function sr(offset = 0) {
  const x = Math.sin(props.seed * 127.1 + offset * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const cx = computed(() => W / 2)
const cy = computed(() => H * 0.38)

// Box size variation per seed
const r = computed(() => 44 + sr(0) * 18)
const skew = computed(() => 0.3 + sr(1) * 0.25)

// Isometric-ish box faces
const frontFace = computed(() => {
  const s = r.value
  return `${-s},${-s * 0.5}  ${s},${-s * 0.5}  ${s},${s * 0.5}  ${-s},${s * 0.5}`
})

const topFace = computed(() => {
  const s = r.value
  const sk = skew.value
  return `${-s},${-s * 0.5}  ${s},${-s * 0.5}  ${s + s * sk},${-s * 0.5 - s * sk}  ${-s + s * sk},${-s * 0.5 - s * sk}`
})

const rightFace = computed(() => {
  const s = r.value
  const sk = skew.value
  return `${s},${-s * 0.5}  ${s + s * sk},${-s * 0.5 - s * sk}  ${s + s * sk},${s * 0.5 - s * sk}  ${s},${s * 0.5}`
})

const backFace = computed(() => {
  const s = r.value
  const sk = skew.value
  return `${-s + s * sk},${-s * 0.5 - s * sk}  ${s + s * sk},${-s * 0.5 - s * sk}  ${s + s * sk},${s * 0.5 - s * sk}  ${-s + s * sk},${s * 0.5 - s * sk}`
})
</script>

<style scoped>
.thumb-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
