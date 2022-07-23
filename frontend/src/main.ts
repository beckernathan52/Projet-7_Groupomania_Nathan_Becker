import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia} from "pinia";

const piniaStore = createPinia()

createApp(App).use(piniaStore).use(router).mount('#app')
