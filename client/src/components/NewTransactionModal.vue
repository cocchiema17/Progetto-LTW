<template>
  <div class="modal fade" :id="name" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Add Transaction</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form novalidate>
            <div class="form-floating mb-3">
              <input
                type="text"
                id="email"
                v-model="email"
                placeholder="name@example.com"
              />

              <label for="email">Email address</label>
            </div>

            <div class="form-floating mb-3">
              <input
                type="password"
                name="password"
                v-model="password"
                maxlength="50"
                placeholder="Password"
              />

              <label for="email">Password</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewTransactionModalComp",
  props: ["name"],
};
</script>

<style>
</style>