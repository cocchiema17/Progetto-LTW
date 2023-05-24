<template>
  <div class="modal fade" id="sortModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-center">Sorting Preference</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form ref="sortForm" novalidate>
            <div class="mb-3">
              <label class="form-check-label" for="radioButton4">
                Date:
              </label>
              <select class="form-control" v-model="space">
                <option value="" selected>None</option>
                <option
                  v-for="space in this.$store.state.spaces"
                  :key="space.name"
                  :value="space.name"
                >
                  {{ space.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-check-label" for="radioButton5">
                Amount:
              </label>
              <select class="form-control" v-model="category">
                <option value="">None</option>
                <option
                  v-for="category in this.$store.state.categories"
                  :key="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            ref="closeBtn"
            data-bs-dismiss="modal"
            @click.prevent="resetData"
          >
            Close
          </button>

          <button
            @click.prevent="onSort"
            type="button"
            class="btn btn-primary"
          >
            Sort
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style></style>
