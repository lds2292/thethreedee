import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// iOS Safari: 100vh가 주소창을 포함해 계산되는 버그를 JS로 보정
// window.innerHeight = 실제 가용 높이를 항상 정확히 반환
function setVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
setVh()
window.addEventListener('resize', setVh)

createApp(App).mount('#app')
