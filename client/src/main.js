import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./vuex";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import { useToast, TYPE } from "vue-toastification";

createApp(App)
  .use(store)
  .use(router)
  .use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true
  })
  .mixin({
    methods: {
      newToast(msg, type = TYPE.SUCCESS, position = "bottom-right") {
        const toast = useToast();
        toast(msg, {
          position,
          timeout: 3000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 1.0,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false,
          type,
        });
      },
    }
  })
  .mount('#app');