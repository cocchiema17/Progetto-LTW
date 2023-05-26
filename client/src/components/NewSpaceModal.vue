<template>
  <div class="modal fade" id="newSpaceModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-center">Add Space</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form ref="spForm" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label">Name Space</label>
              <input
                class="form-control"
                type="text"
                minlength="3"
                maxlength="40"
                name="name"
                v-model="name"
                required
              />
              <p class="text-danger mt-1" v-if="errMessage">
                {{ errMessage }}
              </p>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            @click.prevent="resetData"
            type="button"
            class="btn btn-secondary"
            ref="closeBtn"
            data-bs-dismiss="modal"
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
import { createSpace } from "../api";
import { TYPE } from "vue-toastification";

export default (await import("vue")).defineComponent({
  name: "NewSpaceModalComp",
  computed: {
    ...mapGetters(["user", "spaces", "categories"]),
  },
  data() {
    return {
      name: "",
      errMessage: "",
    };
  },
  methods: {
    async onSave() {
      const form = this.$refs.spForm;
      const closeBtn = this.$refs.closeBtn;
      if (form.checkValidity()) {
        try {
          const newSpace = await createSpace(this.name);
          this.$store.dispatch("spaces", this.spaces.concat(newSpace));
          closeBtn.click();
          this.newToast("Space added", TYPE.SUCCESS);
          this.resetData();
        } catch (err) {
          if (err.response && err.response.status == 400) {
            this.errMessage = err.response.data.error.errors[0].message;
          } else {
            this.newToast("Space creation failed", TYPE.ERROR);
          }
        }
      }
      else {
        this.errMessage = "The name must have at least 3 characters";
      }
    },
    async resetData() {
      this.name = "";
      this.errMessage = "";
    },
  },
});
</script>