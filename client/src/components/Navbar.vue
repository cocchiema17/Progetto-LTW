<template>
  <nav id="navbar" class="navbar body-tertiary border-bottom">
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h3"> Finager </span>
      <ul class="nav nav-pills nav-fill align-items-center">
        <li class="nav-item" v-if="!user">
          <router-link to="/login" class="nav-link">Sign in</router-link>
        </li>
        <li class="nav-item" v-if="!user">
          <router-link to="/register" class="nav-link">Sign up</router-link>
        </li>
        <li class="nav-item" v-if="user && this.$route.name != 'Home'">
          <router-link to="/home" class="nav-link">Home</router-link>
        </li>
        <li class="nav-item" v-if="user && this.$route.name == 'Home'">
          <a @click="onLogout" href="javascript:void(0)">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { logout } from "../api";
import { mapGetters } from "vuex";

export default {
  name: "NavbarComp",
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    async onLogout() {
      await logout();
      localStorage.removeItem("csrfToken");
      this.$store.dispatch("isLogged", false);
      this.$store.dispatch("user", null);
      this.$router.push("/");
    },
  },
};
</script>