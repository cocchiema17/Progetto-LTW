<template>
  <div class="d-flex justify-content-end align-items-center">
    <div class="p-2 flex-grow-1">
      <span v-if="totalTransactions != null" class="h4"
        >{{ totalTransactions }} Transactions</span
      >
    </div>

    <div class="btn-group p-1" role="group" aria-label="Basic example">
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
      </button>
      <button type="button" class="btn btn-outline-primary">Sort</button>
      <button type="button" class="btn btn-outline-primary">Download</button>
    </div>
    <button
      type="button"
      class="btn btn-link"
      data-bs-toggle="modal"
      data-bs-target="#newTransactionModal"
    >
      Add
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
      :totalTransactions="totalTransactions"
      :pageSize="pageSize"
      :transactions="transactions"
      :totalPages="totalPages"
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
  components: { NewTransactionModal, NewSpaceModal, FilterModal },
};
</script>
