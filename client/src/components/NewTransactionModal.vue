<template>
  <div class="modal fade" :id="name" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
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
                required
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
                required
                :max="new Date().toISOString().split('T')[0]"
              />
            </div>

            <!-- <div class="mb-3">
              <label for="date" class="form-label">Attachment</label>
              <input class="form-control" type="file" />
            </div> -->

            <div class="input-group mb-3">
              <div class="col-6 pe-3 m-0">
                <label for="category" class="form-label">Category</label>
                <input
                  class="form-control"
                  v-model="categoryName"
                  id="category"
                  list="categoriesSuggest"
                  @change="onChangeCategory"
                  required
                />
                <datalist id="categoriesSuggest">
                  <option
                    v-for="c in selectedCategories"
                    :key="c.id"
                    :style="{ color: c.color }"
                  >
                    {{ c.name }}
                  </option>
                </datalist>
              </div>

              <div
                class="col-6"
                v-if="!(this.categoryName in categories) && this.categoryName != ''"
              >
                <label class="form-label" for="color"> Color </label>
                <input
                  class="form-control"
                  type="color"
                  v-model="color"
                  id="color"
                />
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
              <MoneyInput v-model="value" required />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            ref="closeBtn"
          >
            Close
          </button>

          <button @click.prevent="onSave" type="button" class="btn btn-success">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createTransaction } from "../api";
import MoneyInput from "./MoneyInput";
import { TYPE } from "vue-toastification";

export default {
  name: "NewTransactionModalComp",
  computed: {
    ...mapGetters(["spaces", "categories"]),
  },
  components: { MoneyInput },
  props: ["name"],
  data() {
    return {
      title: "",
      description: "",
      date: "",
      file: null,
      categoryName: "",
      spaceIdx: 0,
      color: "",
      value: null,
      formValidated: false,
    };
  },
  methods: {
    async onSave() {
      const form = this.$refs.txForm;
      const closeBtn = this.$refs.closeBtn;

      if (form.checkValidity()) {
        try {
          const tx = await createTransaction({
            title: this.title,
            description: this.description,
            date: this.date,
            categoryName: this.categoryName,
            color: this.color,
            spaceId: this.spaces[this.spaceIdx].id,
            value: this.value,
          });

          (tx.spaceName = this.spaces[this.spaceIdx].name),
            (this.formValidated = false);

          this.$emit("new-tx", tx);
          closeBtn.click();
          this.newToast("Transaction added");
        } catch (err) {
          console.log(err);
          this.newToast("Transaction creation failed", TYPE.ERROR);
        }
      } else {
        this.formValidated = true;
      }
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
