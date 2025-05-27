import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue' // Import AutoAnimate

const app = createApp(App)
app.use(autoAnimatePlugin) // Register AutoAnimate
app.mount('#app')