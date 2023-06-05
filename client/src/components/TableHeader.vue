<template>
  <div
    class="d-flex flex-wrap align-items-end ps-3 pe-3 justify-content-between align-content-center"
  >
    <div class="flex-grow-1">
      <h4>{{ totalTransactions }} Transactions</h4>
    </div>

    <div class="d-flex">
      <div>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            class="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#newSpaceModal"
          >
            Add space
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#filterModal"
          >
            Filter
            <span class="badge text-bg-primary">{{ filtersNumber }}</span>
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="onDownload"
          >
            Download
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          class="btn btn-link text-primary"
          data-bs-toggle="modal"
          data-bs-target="#newTransactionModal"
        >
          Add
          <i class="bi bi-plus-circle-fill text-primary" />
        </button>
      </div>
    </div>

    <NewTransactionModal
      name="newTransactionModal"
      :totalTransactions="totalTransactions"
      @new-tx="(e) => $emit('new-tx', e)"
    />
    <NewSpaceModal name="newSpaceModal" />
    <FilterModal name="filterModal" @new-filters="onNewFilters" />
  </div>
</template>

<script>
import NewTransactionModal from "./NewTransactionModal";
import FilterModal from "./FilterModal";
import NewSpaceModal from "./NewSpaceModal";

export default {
  name: "TableHeaderComp",
  props: {
    totalTransactions: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      filtersNumber: 0,
    };
  },
  components: { NewTransactionModal, NewSpaceModal, FilterModal },
  methods: {
    onNewFilters(filters) {
      this.filtersNumber = Object.values(filters).filter(
        (f) => f && f != ""
      ).length;
      this.$emit("new-filters", filters);
    },
    onDownload() {
      this.$emit("download-report");
    },
  },
};
</script>
