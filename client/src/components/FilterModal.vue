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
              <div class="col-6 pe-3 m-0">
                <label class="form-check-label" for="amount"> Amount: </label>
                <input
                  class="form-control"
                  type="number"
                  v-model="amount"
                  id="amount"
                />
              </div>
              <div class="col-6 p-0 m-0">
                <label class="form-check-label" for="operator">
                  Operator:
                </label>
                <select
                  class="form-control"
                  v-model="operator"
                  id="operator"
                  on-change="onChangeOperator();"
                >
                  <option value="">None</option>
                  <option value="EQ">=</option>
                  <option value="NE">≠</option>
                  <option value="GT">&gt;</option>
                  <option value="GE">&gt;=</option>
                  <option value="LT">&lt;</option>
                  <option value="LE">&lt;=</option>
                  <option value="BT">&gt; &lt;</option>
                </select>
              </div>
            </div>
            <p class="errMessage">
              <span v-if="isError">
                Devi inserire anche un operatore oltre al valore
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
      isError: false,
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
      // const closeBtn = this.$refs.closeBtn;
      if (form.amount.value && !form.operator.value) {
        this.isError = true;
      } else {
        this.isError = false;
        try {
          const result = await getTransactions(
            this.pageSize,
            0,
            this.space,
            this.category,
            this.search
          );
          console.log(result);
          // aggiungere nel form l'input per amount e collegarlo al back-end
          // richiamare un metodo (dichiarato in Home) e utilizzarlo per cambiare this.totalTransactions, this.totalPages e this.transactions
        } catch (err) {
          console.log(err);
        }
      }
    },
    async onChangeOperator() {
      console.log(this.$refs.filForm);
      console.log("CHANGE OPERATOR", this.$refs.filForm.operator.value);
      return true;
    },
    async resetData() {
      this.search = "";
      this.category = "";
      this.space = "";
      this.operator = "";
      this.amount = "";
      this.isError = false;
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
