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
                  v-for="space in spaces"
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
                <option v-for="category in categories" :key="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="row g-3 mb-3">
              <div class="col">
                <label class="form-check-label" for="amount"> Amount: </label>
                <MoneyInput v-model="amount" required />
              </div>
              <div class="col">
                <label class="form-check-label" for="operator">
                  Operator:
                </label>
                <select class="form-control" v-model="operator">
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
              <div class="col" v-if="operator == 'BT'">
                <label class="form-check-label" for="amount2"> Amount: </label>
                <MoneyInput v-model="amount2" required />
              </div>
            </div>
            <Alert
              class="mb-0"
              :msg="errMessage"
              :type="'danger'"
              v-if="errMessage"
            />
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
import { mapGetters } from "vuex";
import { TYPE } from "vue-toastification";
import MoneyInput from "./MoneyInput";
import Alert from "./Alert";

export default {
  name: "FilterModalComp",
  components: { MoneyInput, Alert },
  computed: {
    ...mapGetters(["spaces", "categories"]),
  },
  data() {
    return {
      search: "",
      category: "",
      space: "",
      operator: "",
      amount: null,
      amount2: null,
      errMessage: null,
    };
  },
  methods: {
    async onFilter() {
      const closeBtn = this.$refs.closeBtn;
      if ((this.amount && !this.operator) || (!this.amount && this.operator)) {
        this.errMessage = "You must enter both amount and the operator";
      } else if (
        parseInt(this.amount) >= parseInt(this.amount2) &&
        this.operator === "BT"
      ) {
        this.errMessage = "The first value must be less than the second";
      } else {
        this.errMessage = null;
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
    async resetData() {
      this.search = "";
      this.category = "";
      this.space = "";
      this.operator = "";
      this.amount = null;
      this.amount2 = null;
      this.errMessage = null;
    },
    async resetFilters() {
      this.resetData();
      this.$emit("new-filters", {});
      const closeBtn = this.$refs.closeBtn;
      closeBtn.click();
      this.newToast("Filters reset", TYPE.SUCCESS);
    },
  },
};
</script>

<style scoped></style>
