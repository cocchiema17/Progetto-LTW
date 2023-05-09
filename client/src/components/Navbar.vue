<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <h3 class="navbar-brand">Finager</h3>

      <ul class="nav nav-pills nav-fill" v-if="!user">
        <li class="nav-item">
          <router-link to="/login" class="nav-link">Sign in</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register" class="nav-link">Sign up</router-link>
        </li>
      </ul>

      <ul class="nav nav-pills nav-fill" v-if="user">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-light dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Change Bank Account
          </button>

          <ul class="dropdown-menu">
            <li v-for="s in spaces" :key="s.id">
              <button
                :class="[
                  selectedSpace == s.id
                    ? 'dropdown-item active'
                    : 'dropdown-item',
                ]"
              >
                {{ s.name }}
              </button>
            </li>
          </ul>
        </div>
        <li class="nav-item">
          <a href="javascript:void(0)" @click="onLogout" class="nav-link"
            >Logout</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NavbarComp",
  computed: {
    ...mapGetters(["user", "spaces", "selectedSpace"]),
  },
  methods: {
    async onLogout() {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "x-csrf-token": window.localStorage.getItem("csrfToken"),
        },
      });

      if (response.status == 204) {
        localStorage.removeItem("csrfToken");
        this.$store.dispatch("user", null);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style>
</style>