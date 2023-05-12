
import { createRouter, createWebHistory } from 'vue-router';

import Intro from "./views/Intro";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import Forgot from "./views/Forgot";
import Reset from "./views/Reset";
import About from "./views/About";
import NotFound from "./views/NotFound";

const routes = [
  {
    path: "/",
    name: "Intro",
    component: Intro
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: Forgot
  },
  {
    path: "/reset/:token",
    name: "Reset",
    component: Reset
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;