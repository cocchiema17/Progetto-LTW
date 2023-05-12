<template>
  <div class="d-flex justify-content-end align-items-center">
    <div class="p-2 flex-grow-1">
      <span v-if="totalTransactions != null" class="h4"
        >{{ totalTransactions }} Transactions</span
      >
    </div>

    <div class="btn-group p-1" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-outline-primary">Filter</button>
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

    <NewTransactionModal name="newTransactionModal" />
  </div>
</template>

<script>
import NewTransactionModal from "./NewTransactionModal";

export default {
  name: "TableHeaderComp",
  props: ["totalTransactions"],
  components: { NewTransactionModal },
};
</script>
