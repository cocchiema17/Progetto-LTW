<template>
  <div class="container-fluid">
    <Nav />
    <div class="container p-3">
      {{ displayName }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Nav from "../components/Navbar.vue";

export default {
  name: "HomePage",
  computed: {
    ...mapGetters(["user"]),
    displayName() {
      if (this.user) {
        return this.user.firstName + " " + this.user.lastName;
      }

      return null;
    },
  },
  components: { Nav },
  async created() {
    const response = await fetch("/api/auth/currentUser", {
      method: "GET",
      headers: {
        "x-csrf-token": window.localStorage.getItem("csrfToken"),
      },
    });

    if (response.status === 200) {
      const user = await response.json();
      this.$store.dispatch("user", user);
    }
  },
};
</script>

<style scoped>
</style>