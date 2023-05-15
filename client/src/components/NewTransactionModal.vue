<template>
  <div class="modal fade" :id="name" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-center">Add Transaction</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form
            ref="txForm"
            novalidate
            :class="{ 'was-validated': formValidated }"
          >
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input
                class="form-control"
                type="text"
                id="title"
                v-model="title"
                required
                minlength="3"
                maxlength="40"
              />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <input
                class="form-control"
                type="text"
                id="description"
                v-model="description"
                maxlength="200"
              />
            </div>

            <div class="mb-3">
              <label for="date" class="form-label">Date</label>
              <input
                class="form-control"
                type="date"
                id="date"
                v-model="date"
                :max="new Date()"
                required
              />
            </div>

            <div class="mb-3">
              <label for="date" class="form-label">Attachment</label>
              <input class="form-control" type="file" />
            </div>

            <div class="input-group mb-3">
              <div class="col-6 pe-3 m-0">
                <label for="category" class="form-label">Category</label>
                <input
                  class="form-control"
                  v-model="categoryName"
                  id="category"
                  list="categoriesSuggest"
                  required
                />
                <datalist id="categoriesSuggest">
                  <option
                    v-for="c in categories"
                    :key="c.id"
                    :style="{ color: c.color }"
                  >
                    {{ c.name }}
                  </option>
                </datalist>
              </div>
              <div class="col-6 p-0 m-0">
                <label for="space" class="form-label">Space</label>
                <select
                  class="form-control"
                  v-model="spaceIdx"
                  id="space"
                  required
                >
                  <option v-for="(s, idx) in spaces" :key="idx" :value="idx">
                    {{ s.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="amount" class="form-label">Amount</label>
              <MoneyInput v-model="value" />
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

          <button @click.prevent="onSave" type="button" class="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MoneyInput from "./MoneyInput";
import { createTransaction } from "../api";

export default {
  name: "NewTransactionModalComp",
  components: { MoneyInput },
  computed: {
    ...mapGetters(["spaces", "categories"]),
  },
  props: ["name"],
  data() {
    return {
      title: "",
      description: "",
      date: "",
      file: null,
      categoryName: "",
      spaceIdx: 0,
      value: 0,
      formValidated: false,
    };
  },
  methods: {
    async onSave() {
      const form = this.$refs.txForm;

      if (form.checkValidity()) {
        const tx = await createTransaction({
          title: this.title,
          description: this.description,
          date: this.date,
          categoryName: this.categoryName,
          spaceId: this.spaces[this.spaceIdx].id,
          value: this.value,
        });
        console.log("New tx!", tx);
        this.resetData();
      }

      this.formValidated = true;
    },

    resetData() {
      this.title = "";
      this.description = "";
      this.date = "";
      this.categoryName = "";
      this.spaceId = "";
      this.value = "";
    },
  },
};
</script>



<style scoped>
.form-control.no-validate:valid {
  border-color: #ced4da;
  padding-right: 0.75rem;
  background: none;
}
</style>