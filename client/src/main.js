import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./vuex";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.css';

createApp(App)
  .use(store)
  .use(router)
  .use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true
  })
  .mount('#app');