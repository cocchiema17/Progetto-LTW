<template>
  <footer
    class="d-flex p-2 align-content-center align-items-center fixed-bottom border-top bg-white"
  >
    <div class="flex-grow-1">
      <ul class="nav justify-content-start align-items-center">
        <li>
          <span class="text-body-secondary">© 2023 Finager, Inc</span>
        </li>
      </ul>
    </div>

    <div class="flex-grow-1">
      <ul class="nav navbar-nav justify-content-center align-items-center">
        <li>
          <a href="#" class="nav-link">About</a>
        </li>
      </ul>
    </div>

    <div class="flex-grow-1">
      <ul class="nav justify-content-end align-items-center">
        <li class="me-2">
          <a href="https://twitter.com/FinagerInfo" target="_blank">
          <img
            src="https://cdn.cdnlogo.com/logos/t/39/twitter.svg"
            width="40"
          />
        </a>
        </li>
        <li>
          <a href="https://www.instagram.com/" target="_blank">
          <img
            src="https://cdn.cdnlogo.com/logos/i/28/instagram.png"
            width="40"
          />
        </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComp",
};
</script>

<style>
</style>