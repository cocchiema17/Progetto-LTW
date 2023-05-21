<template>
  <div class="modal fade" id="filterModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-center">Add Filter</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form ref="filForm" novalidate>
            <div class="mb-3">
              <label for="search" class="form-label">Search:</label>
              <input type="search" id="search" v-model="search" />
            </div>
            <div class="mb-3">
              <label class="form-check-label" for="radioButton4">
                Space:
              </label>
              <select v-model="space">
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
                Category:
              </label>
              <select v-model="category">
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
            @click.prevent="resetData"
          >
            Reset
          </button>

          <button
            @click.prevent="onFilter"
            type="button"
            class="btn btn-primary"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFilteredUserTransactions } from "../api";

export default (await import("vue")).defineComponent({
  name: "FilterModalComp",
  data() {
    return {
      search: "",
      category: "",
      space: "",
    };
  },
  methods: {
    async onFilter() {
      // const form = this.$refs.filForm;
      // const closeBtn = this.$refs.closeBtn;
      try {
        await getFilteredUserTransactions(this.search, this.space, this.category);
      } catch(err) {
        console.log(err);
      }
    },
    async resetData() {
      this.search = "";
      this.category = "";
      this.space = "";
    }
  },
});
</script>

<style></style>
