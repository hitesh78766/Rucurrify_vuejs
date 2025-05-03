
// Plugins
import { registerPlugins } from '@/plugins'


// Components
import App from './App.vue'
// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/style/main.css'


// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
