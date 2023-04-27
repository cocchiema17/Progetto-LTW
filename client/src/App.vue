<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Fira+Sans:400,500,600,700,800");

body {
  font-weight: 400 !important;
  font-family: "Fira Sans", sans-serif !important;
}

.centered-form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f8fa;
  padding: 0;
}

.centered-form {
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
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
