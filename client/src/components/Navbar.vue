<template>
  <nav id="navbar" class="navbar body-tertiary border-bottom">
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h3">Finager</span>
      <ul class="nav nav-pills nav-fill align-items-center">
        <li class="nav-item me-3">
          <div class="dropdown">
            <button
              class="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Change Space
            </button>
            <ul class="dropdown-menu">
              <li v-for="s in spaces" :key="s.id">
                <button
                  class="dropdown-item"
                  @click="(e) => this.$emit('space-selected', s)"
                >
                  {{ s.name }}
                </button>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <a @click="onLogout" href="javascript:void(0)">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarComp",
  props: ["user", "spaces"],
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