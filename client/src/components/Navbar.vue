<template>
  <nav id="navbar" class="navbar body-tertiary border-bottom">
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h3">Finager</span>
      <ul class="nav nav-pills nav-fill align-items-center">
        <li class="nav-item">
          <a @click="onLogout" href="javascript:void(0)">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { logout } from "../api";

export default {
  name: "NavbarComp",
  props: ["user", "spaces"],
  methods: {
    async onLogout() {
      await logout();
      localStorage.removeItem("csrfToken");
      this.$store.dispatch("user", null);
      this.$router.push("/");
    },
  },
};
</script>