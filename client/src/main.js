import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./vuex";

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";
import MoneySpinner from 'v-money-spinner';

createApp(App)
  .use(store)
  .use(router)
  .use(MoneySpinner)
  .mount('#app');