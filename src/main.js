import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'daisyui/dist/full.css';


createApp(App).use(router).mount('#app');
