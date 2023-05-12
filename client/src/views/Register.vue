<template>
  <div class="centered-form-wrapper container-fluid bg-app">
    <form class="centered-form" @submit.prevent="onSubmit" novalidate>
      <h1 class="display-6 mb-5 text-center">Register to Finager!</h1>

      <Alert
        v-for="e in errorMessages"
        :msg="e.message"
        :type="'danger'"
        :key="e.idx"
      />

      <div class="form-floating mb-3">
        <input
          type="text"
          :class="{ 'form-control': true, 'is-invalid': errors.firstName }"
          id="firstName"
          v-model="firstName"
          placeholder="First Name"
        />
        <div v-if="this.errors.firstName" class="invalid-feedback d-block">
          {{ errors.firstName }}
        </div>
        <label for="firstName">First name</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="text"
          :class="{ 'form-control': true, 'is-invalid': errors.lastName }"
          id="lastName"
          v-model="lastName"
          placeholder="Last Name"
        />
        <div v-if="this.errors.lastName" class="invalid-feedback d-block">
          {{ errors.lastName }}
        </div>
        <label for="lastName">Last name</label>
      </div>

      <div class="form-floating mb-3">
        <input
          type="email"
          :class="{ 'form-control': true, 'is-invalid': errors.email }"
          id="email"
          maxlength="50"
          v-model="email"
          placeholder="name@example.com"
        />
        <div v-if="this.errors.email" class="invalid-feedback d-block">
          {{ errors.email }}
        </div>
        <label for="email">Email address</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="password"
          :class="{ 'form-control': true, 'is-invalid': errors.password }"
          name="password"
          maxlength="50"
          v-model="password"
          placeholder="Password"
        />
        <div v-if="this.errors.password" class="invalid-feedback d-block">
          {{ errors.password }}
        </div>
        <label for="password">Password</label>
      </div>
      <div class="d-grid gap-2">
        <button class="btn btn-primary" :disabled="!isSubmitEnabled">
          Sign up
        </button>
        <p class="already-registered">
          <router-link to="login">Already registered?</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import Alert from "../components/Alert.vue";

export default {
  name: "RegisterPage",
  components: {
    Alert,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      errors: {},
      errorMessages: [],
      isValid: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
      },
    };
  },
  computed: {
    isSubmitEnabled() {
      return Object.values(this.isValid).every((v) => v === true);
    },
  },
  watch: {
    firstName(value) {
      const l = this.length(value);
      let msg = null;

      if (l == 0) msg = "First name is required";
      else if (l < 3) msg = "First name too short";
      else if (l > 50) msg = "First name can be at most 50 chars";
      else if (!this.isAlpha(value)) msg = "First name not valid";

      this.isValid.firstName = msg == null;
      this.errors.firstName = msg;
    },
    lastName(value) {
      const l = this.length(value);
      let msg = null;

      if (l == 0) msg = "Last name is required";
      else if (l < 3) msg = "Last name too short";
      else if (l > 50) msg = "Last name too long";
      else if (!this.isAlpha(value)) msg = "Last name not valid";

      this.isValid.lastName = msg == null;
      this.errors.lastName = msg;
    },
    email(value) {
      const l = this.length(value);
      let msg = null;

      if (l == 0) msg = "Email is required";
      else if (!/^[^@]+@\w+(\.\w+)+\w$/.test(value)) msg = "Email is invalid";

      this.isValid.email = msg == null;
      this.errors.email = msg;
    },
    password(value) {
      const l = this.length(value);
      let msg = null;

      if (l == 0) msg = "Password is required";
      else if (l < 3) msg = "Password too short";
      else if (l > 50) msg = "Password too long";

      this.isValid.password = msg == null;
      this.errors.password = msg;
    },
  },
  methods: {
    isAlpha(value) {
      return /^[a-zA-Z]+$/.test(value);
    },
    length(value) {
      return value && value.length ? value.length : 0;
    },
    async onSubmit() {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        }),
      });

      if (response.status === 201) {
        this.$router.push("/login");
      } else {
        const { error } = await response.json();
        if (error) {
          this.errorMessages = error.errors.map((e, idx) => {
            return {
              idx,
              message: e.message,
            };
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.already-registered,
.already-registered a {
  text-align: right;
  font-size: 15px;
  padding-top: 10px;
  color: grey;
  margin: 0;
}
</style>