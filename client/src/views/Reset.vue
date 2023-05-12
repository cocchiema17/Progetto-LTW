<template>
  <div class="centered-form-wrapper container-fluid bg-app">
    <form
      class="centered-form"
      ref="logForm"
      @submit.prevent="submit"
      novalidate
    >
      <h1 class="display-6 mb-5 text-center">Recover password</h1>

      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          id="newPassword"
          v-model="form.newPassword"
          placeholder="New password"
        />
        <label for="newPassword">New password</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="Confirm Password"
        />
        <label for="confirmPassword">Confirm password</label>
      </div>

      <div class="d-grid gap-2">
        <button class="btn btn-primary">Reset</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ResetView",
  data() {
    return {
      form: {
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
};
</script>
