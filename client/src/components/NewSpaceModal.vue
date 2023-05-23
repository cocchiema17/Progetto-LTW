<template>
  <div class="modal fade" id="newSpaceModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
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
              <p class="errMessage">
                <span v-if="isError">
                  {{ errMessage }}
                </span>
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
import { createSpace, getSpaces } from "../api";
import { useToast, TYPE } from "vue-toastification";

export default (await import("vue")).defineComponent({
  name: "NewSpaceModalComp",
  computed: {
    ...mapGetters(["user", "spaces", "categories"]),
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      name: "",
      isError: false,
      errMessage: "",
    };
  },
  methods: {
    async onSave() {
      const form = this.$refs.spForm;
      const closeBtn = this.$refs.closeBtn;
      if (form.checkValidity()) {
        let isReqErr = false;
        try {
          await createSpace(this.name);
        } catch (err) {
          this.errMessage = err.response.data.error.errors[0].message;
          this.isError = true;
          isReqErr = true;
          this.newToast("Space creation failed", TYPE.ERROR);
        } finally {
          if (!isReqErr) {
            closeBtn.click();
            this.newToast("Space added", TYPE.SUCCESS);
            this.resetData();
            this.$store.dispatch("spaces", await getSpaces());
          }
        }
      }
    },
    async resetData() {
      this.name = "";
      this.isError = false;
    },
    newToast(msg, type) {
      this.toast(msg, {
        position: "bottom-right",
        timeout: 3000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 1.0,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false,
        type,
      });
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
