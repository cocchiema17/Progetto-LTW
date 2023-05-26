<template>
  <div class="d-flex justify-content-end align-items-center ps-3 pe-3">
    <div class="flex-grow-1">
      <span v-if="totalTransactions != null" class="h4"
        >{{ totalTransactions }} Transactions</span
      >
    </div>

    <div class="btn-group p-1" role="group" aria-label="Basic example">
      <button
        type="button"
        class="btn btn-outline-success"
        data-bs-toggle="modal"
        data-bs-target="#newSpaceModal"
      >
        Add space
      </button>
      <button
        type="button"
        class="btn btn-outline-success"
        data-bs-toggle="modal"
        data-bs-target="#filterModal"
      >
        Filter
        <span class="badge text-bg-success">{{ filtersNumber }}</span>
      </button>
      <button type="button" class="btn btn-outline-success">Download</button>
    </div>
    <button
      type="button"
      class="btn btn-link text-success"
      data-bs-toggle="modal"
      data-bs-target="#newTransactionModal"
    >
      Add
      <i class="bi bi-plus-circle-fill text-success"></i>
    </button>

    <NewTransactionModal
      name="newTransactionModal"
      :totalTransactions="totalTransactions"
      :pageSize="pageSize"
      @new-tx="(e) => $emit('new-tx', e)"
    />
    <NewSpaceModal name="newSpaceModal" />
    <FilterModal
      name="filterModal"
      @new-filters="onNewFilters"
    />
  </div>
</template>

<script>
import NewTransactionModal from "./NewTransactionModal";
import FilterModal from "./FilterModal";
import NewSpaceModal from "./NewSpaceModal";

export default {
  name: "TableHeaderComp",
  // props: ["totalTransactions", "pageSize"],
  props: {
    totalTransactions: {
      type: Number,
      required: true,
    },
  },
  data () {
    return {
      filtersNumber: 0
    }
  },
  components: { NewTransactionModal, NewSpaceModal, FilterModal },
  methods: {
    onNewFilters(filters) {
      console.log("FILTERS IN TABLE HEADER", filters);
      this.filtersNumber = Object.values(filters).filter(f => f && f != "").length;
      this.$emit('new-filters', filters);
    }
  }
};
</script>
