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
          type="email"
          class="form-control"
          id="email"
          v-model="form.email"
          placeholder="name@example.com"
        />
        <label for="email">Email address</label>
      </div>

      <div class="d-grid gap-2">
        <button class="btn btn-primary">Send</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ForgotView",
  data() {
    return {
      form: {
        email: "",
      },
    };
  },
};
</script>
