<template>
  <div class="modal fade" id="filterModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-center">Add Filter</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closeBtn"
          ></button>
        </div>
        <div class="modal-body">
          <form ref="filForm" novalidate>
            <div class="mb-3">
              <label for="search" class="form-label">Search:</label>
              <input
                class="form-control"
                type="search"
                id="search"
                v-model="search"
              />
            </div>
            <div class="mb-3">
              <label class="form-check-label" for="space"> Space: </label>
              <select class="form-control" v-model="space" id="space">
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
              <label class="form-check-label" for="category"> Category: </label>
              <select class="form-control" v-model="category" id="category">
                <option value="">None</option>
                <option
                  v-for="category in this.$store.state.categories"
                  :key="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="input-group mb-3">
              <div class="col-6 pe-3 m-0" id="amount-conteiner">
                <label class="form-check-label" for="amount"> Amount: </label>
                <input
                  class="form-control"
                  type="number"
                  v-model="amount"
                  id="amount"
                />
              </div>
              <div class="col-6 p-0 m-0" id="operator-conteiner">
                <label class="form-check-label" for="operator">
                  Operator:
                </label>
                <select
                  class="form-control"
                  v-model="operator"
                  id="operator"
                  @change="onChangeOperator"
                >
                  <option value="">None</option>
                  <option value="EQ">=</option>
                  <option value="NE">≠</option>
                  <option value="GT">&gt;</option>
                  <option value="GE">&gt;=</option>
                  <option value="LT">&lt;</option>
                  <option value="LE">&lt;=</option>
                  <option value="BT">≥ ≤</option>
                </select>
              </div>
              <div class="col-4 ps-3 m-0 d-none" id="amount2-conteiner">
                <label class="form-check-label" for="amount2"> Amount: </label>
                <input
                  class="form-control"
                  type="number"
                  v-model="amount2"
                  id="amount2"
                />
              </div>
            </div>
            <p class="text-danger mt-1">
              <span v-if="isError"> Error on Amount or Operator </span>
            </p>
            <p class="text-danger mt-1">
              <span v-if="isErrorBT">
                The first value must be less than the second
              </span>
            </p>
          </form>
        </div>
        <div class="modal-footer" style="justify-content: space-between">
          <button
            type="button"
            class="btn btn-primary"
            @click.prevent="resetFilters()"
          >
            Reset Filters
          </button>

          <div>
            <button
              type="button"
              class="btn btn-secondary me-3"
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
  </div>
</template>

<script>
import { TYPE } from "vue-toastification";

export default (await import("vue")).defineComponent({
  name: "FilterModalComp",
  data() {
    return {
      search: "",
      category: "",
      space: "",
      operator: "",
      amount: "",
      amount2: "",
      isError: false,
      isErrorBT: false,
    };
  },
  methods: {
    async onFilter() {
      const form = this.$refs.filForm;
      const closeBtn = this.$refs.closeBtn;
      if (
        (form.amount.value && !form.operator.value) ||
        (!form.amount.value && form.operator.value)
      ) {
        this.isError = true;
      } else if (
        parseInt(form.amount.value) >= parseInt(form.amount2.value) &&
        form.operator.value === "BT"
      ) {
        this.isErrorBT = true;
      } else {
        this.isError = false;
        this.isErrorBT = false;
        this.$emit("new-filters", {
          search: this.search || null,
          space: this.space || null,
          categoryName: this.category || null,
          amount: typeof this.amount === "number" ? this.amount : null,
          operator: this.operator || null,
          amount2: typeof this.amount2 === "number" ? this.amount2 : null,
        });
        closeBtn.click();
        this.newToast("Filters added", TYPE.SUCCESS);
      }
    },
    onChangeOperator(isDefault = true) {
      const op = this.$refs.filForm.operator.value;
      const amount = document.getElementById("amount-conteiner");
      const operator = document.getElementById("operator-conteiner");
      const amount2 = document.getElementById("amount2-conteiner");
      if (op == "BT" && isDefault) {
        amount.classList.remove("col-6");
        amount.classList.add("col-4");
        operator.classList.remove("col-6");
        operator.classList.add("col-4");
        amount2.classList.remove("d-none");
      } else {
        amount.classList.add("col-6");
        amount.classList.remove("col-4");
        operator.classList.add("col-6");
        operator.classList.remove("col-4");
        amount2.classList.add("d-none");
        this.amount2 = "";
      }
    },
    async resetData() {
      this.search = "";
      this.category = "";
      this.space = "";
      this.operator = "";
      this.amount = "";
      this.amount2 = "";
      this.isError = false;
      this.isErrorBT = false;
      this.onChangeOperator(false);
    },
    async resetFilters() {
      this.resetData();
      this.$emit("new-filters", {});
      const closeBtn = this.$refs.closeBtn;
      closeBtn.click();
      this.newToast("Filters reset", TYPE.SUCCESS);
    },
  },
});
</script>

<style scoped>
</style>
