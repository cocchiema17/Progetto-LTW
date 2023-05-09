<template>
  <div class="container-fluid">
    <Nav />
    <div class="p-3">
      <UserHome v-if="user" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserHome from "../components/UserHome";
import Nav from "../components/Navbar";

export default {
  name: "HomePage",
  computed: {
    ...mapGetters(["user"]),
  },
  components: { Nav, UserHome },
  async created() {
    const headers = {
      "x-csrf-token": localStorage.getItem("csrfToken"),
    };

    const response = await fetch("/api/auth/currentUser", { headers });

    if (response.status === 200) {
      const user = await response.json();
      this.$store.dispatch("user", user);
    }
  },
};
</script>

<style scoped>
</style>