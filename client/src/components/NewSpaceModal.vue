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
          <!-- <form @submit.prevent="prova" ref="spForm"> -->
          <form ref="spForm" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label">Name Space</label>
              <input
                type="text"
                minlength="3"
                maxlength="40"
                name="name"
                v-model="name"
                required
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            @click.prevent="resetData"
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
import { createSpace } from "../api";

export default (await import("vue")).defineComponent({
  name: "NewSpaceModal",
  computed: {
    ...mapGetters(["user", "spaces", "categories"]),
  },
  data() {
    return {
      name: "",
    };
  },
  methods: {
    async onSave() {
      let errNameSpace = false;
      let nameSpace;
      this.spaces.forEach((space) => {
        nameSpace = space.name;
        if (nameSpace == this.name) {
          errNameSpace = true;
          alert(`Space with name ${this.name} already in use`);
        }
      });
      const form = this.$refs.spForm;
      console.log(this.user.id);
      console.log(this.name);
      console.log(errNameSpace);
      if (form.checkValidity() && !errNameSpace) {
        console.log(this.name);
        const space = await createSpace(this.name);
        console.log(space);
      }

      this.resetData();
    },
    async resetData() {
      this.name = "";
    },
  },
});
</script>

<style></style>
