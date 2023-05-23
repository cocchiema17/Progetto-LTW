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
            <p class="errMessage">
              <span v-if="isError"> Error on Amount or Operator </span>
            </p>
            <p class="errMessage">
              <span v-if="isErrorBT">
                The first value must be less than the second
              </span>
            </p>
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
import { getTransactions } from "../api";

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
  props: {
    totalTransactions: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    transactions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async onFilter() {
      const form = this.$refs.filForm;
      if (
        (form.amount.value && !form.operator.value) ||
        (!form.amount.value && form.operator.value)
      ) {
        this.isError = true;
      } else if (
        parseInt(form.amount.value) >= parseInt(form.amount2.value) &&
        form.operator.value === "BT"
      ) {
        console.log("ELSE IF", form.amount.value, form.amount2.value);
        this.isErrorBT = true;
      } else {
        this.isError = false;
        this.isErrorBT = false;
        try {
          const result = await getTransactions(
            this.pageSize,
            0,
            this.space != "" ? this.space : null,
            this.category != "" ? this.category : null,
            this.search != "" ? this.search : null,
            this.amount != "" ? this.amount : null,
            this.operator != "" ? this.operator : null,
            this.operator === "BT" ? this.amount2 : null
          );
          console.log(result);
          // richiamare un metodo (dichiarato in Home) e utilizzarlo per cambiare this.totalTransactions, this.totalPages e this.transactions
        } catch (err) {
          console.log(err);
        }
      }
    },
    onChangeOperator(isDefault = true) {
      // console.log("CHANGE OPERATOR", this.$refs.filForm.operator.value);
      const op = this.$refs.filForm.operator.value;
      const amount = document.getElementById("amount-conteiner");
      const operator = document.getElementById("operator-conteiner");
      const amount2 = document.getElementById("amount2-conteiner");
      if (op == "BT" && isDefault) {
        // console.log("BETWEEN", op);
        console.log(this.$refs.filForm);
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
  },
});
</script>

<style scoped>
.errMessage {
  color: red;
  font-size: small;
}
</style>
