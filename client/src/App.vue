<template>
  <div class="h-100">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "App",
  components: { Navbar },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Fira+Sans:400,500,600,700,800");

html,
body {
  margin: 0;
  padding: 0;
  font-weight: 400 !important;
  font-family: "Fira Sans", sans-serif !important;
  height: 100%;
}

#app {
  height: 100%;
}

.bg-app {
  background-color: #f5f8fa;
}

.centered-form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0;
}

.centered-form {
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

main {
  padding-bottom: 180px;
}

@media screen and (min-width: 600px) {
  .centered-form {
    background-color: white;
    border: 1px white;
    border-radius: 10px;
    padding: 30px;
  }
}
</style>
