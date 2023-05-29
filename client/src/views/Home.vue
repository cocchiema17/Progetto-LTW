<template>
  <div class="home-container">
    <Charts ref="chartsComp" />

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <TableHeader
            :totalTransactions="totalTransactions"
            :totalPages="totalPages"
            @new-tx="onNewTx"
            @new-filters="onNewFilters"
            @download-report="onDownloadReport"
          />
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <div
                class="spinner-border text-primary"
                role="status"
                v-if="isLoading"
              />
              <thead class="sticky-top">
                <tr class="">
                  <th scope="col">#</th>
                  <th
                    scope="col"
                    @click="sortByColumn('title')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Title</span>
                      <span v-if="asc && currentSort == 'title'">
                        <i class="bi bi-sort-up text-primary"></i>
                      </span>
                      <span v-if="!asc && currentSort == 'title'">
                        <i class="bi bi-sort-down text-primary"></i>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    @click="sortByColumn('description')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Description</span>
                      <span v-if="asc && currentSort == 'description'">
                        <i class="bi bi-sort-up text-primary"></i>
                      </span>
                      <span v-if="!asc && currentSort == 'description'">
                        <i class="bi bi-sort-down text-primary"></i>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    @click="sortByColumn('amount')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Amount</span>
                      <span v-if="asc && currentSort == 'amount'">
                        <i class="bi bi-sort-up text-primary"></i>
                      </span>
                      <span v-if="!asc && currentSort == 'amount'">
                        <i class="bi bi-sort-down text-primary"></i>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    @click="sortByColumn('space')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Space</span>
                      <span v-if="asc && currentSort == 'space'">
                        <i class="bi bi-sort-up text-primary"></i>
                      </span>
                      <span v-if="!asc && currentSort == 'space'">
                        <i class="bi bi-sort-down text-primary"></i>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    @click="sortByColumn('category')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Category</span>
                      <span v-if="asc && currentSort == 'category'">
                        <i class="bi bi-sort-up text-primary"></i>
                      </span>
                      <span v-if="!asc && currentSort == 'category'">
                        <i class="bi bi-sort-down text-primary"></i>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    @click="sortByColumn('transactionDate')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Date</span>
                      <span v-if="asc && currentSort == 'transactionDate'">
                        <i class="bi bi-sort-up text-primary"></i>
                      </span>
                      <span v-if="!asc && currentSort == 'transactionDate'">
                        <i class="bi bi-sort-down text-primary"></i>
                      </span>
                    </div>
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in transactions" :key="t.id">
                  <th scope="row">{{ t.row_number }}</th>
                  <td>{{ t.title }}</td>
                  <td>{{ t.description }}</td>
                  <td
                    :class="
                      t.type == 'expense' ? 'text-danger' : 'text-success'
                    "
                  >
                    {{ (t.type == "expense" ? "" : "+") + t.value + " € " }}
                  </td>
                  <td>{{ t.spaceName }}</td>
                  <td>
                    <span
                      class="badge"
                      :style="{
                        background: t.categoryColor + ' !important',
                        color: isColorLight(t.categoryColor)
                          ? 'black'
                          : 'white',
                        fontSize: '15px',
                      }"
                      >{{ t.categoryName }}</span
                    >
                  </td>
                  <td>
                    {{ new Date(t.transactionDate).toLocaleDateString() }}
                  </td>
                  <td>
                    <div class="d-flex flex-nowrap justify-content-center">
                      <button
                        class="btn btn-outline-primary me-2"
                        @click="onUpdateTransaction(t)"
                        data-bs-toggle="modal"
                        data-bs-target="#updateTransactionModal"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button
                        class="btn btn-outline-danger"
                        @click="onDeleteTransaction(t)"
                      >
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <PaginationButtons
            v-if="totalPages != 0"
            :totalPages="totalPages"
            :pageSize="pageSize"
            :selectedPage="selectedPage"
            @page-clicked="onPageClicked"
          />
        </div>
      </div>
    </div>
    <UpdateTransactionModal ref="updateModal" @tx-updated="onTxUpdated" />
  </div>
</template>

<script>
import {
  getSpaces,
  getCategories,
  getTransactions,
  deleteTransaction,
  getExcelReport,
} from "../api";

import { mapGetters } from "vuex";
import TableHeader from "../components/TableHeader";
import PaginationButtons from "../components/PaginationButtons";
import Charts from "../components/charts/Charts";
import { TYPE } from "vue-toastification";
import Color from "color";
import UpdateTransactionModal from "../components/UpdateTransactionModal";

export default {
  name: "HomePage",
  computed: {
    ...mapGetters(["user", "spaces", "categories"]),
  },
  data() {
    return {
      transactions: [],
      totalTransactions: 0,
      selectedPage: 0,
      totalPages: 0,
      pageSize: 10,
      chartSpace: 0,
      currentSort: "transactionDate",
      asc: false,
      filters: {},
      isLoading: false,
      txToUpdate: {},
    };
  },
  components: {
    TableHeader,
    PaginationButtons,
    Charts,
    UpdateTransactionModal,
  },
  async created() {
    try {
      this.isLoading = true;

      const results = await Promise.all([
        getSpaces(),
        getCategories(),
        getTransactions(0, this.pageSize, {}, this.currentSort, this.asc),
      ]);

      this.$store.dispatch("spaces", results[0]);
      this.$store.dispatch("categories", results[1]);

      this.transactions = results[2].value;
      this.totalTransactions = results[2].totalElements;
      this.totalPages = results[2].totalPages;
    } catch (err) {
      this.newToast("Failed to load data", TYPE.ERROR);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async onNewTx(tx) {
      this.fetchTransactions(
        this.selectedPage,
        this.filters,
        this.currentSort,
        this.asc
      );
      this.$refs.chartsComp.refresh();

      const c = this.categories.find(
        (c) => c.spaceId == tx.spaceId && c.categoryName == tx.categoryName
      );

      if (!c) {
        const space = this.spaces.find((s) => s.id == tx.spaceId);

        this.categories.push({
          name: tx.categoryName,
          spaceId: tx.spaceId,
          spaceName: space.name,
        });
      }
    },
    onPageClicked(page) {
      this.selectedPage = page;
      this.fetchTransactions(page, this.filters, this.currentSort, this.asc);
    },
    async fetchTransactions(page, filters, sortColumn = null, asc = null) {
      try {
        this.isLoading = true;

        const { totalElements, totalPages, value } = await getTransactions(
          page,
          this.pageSize,
          filters,
          sortColumn,
          asc
        );

        this.transactions = value;
        this.totalTransactions = totalElements;
        this.totalPages = totalPages;
      } catch (err) {
        this.newToast("Failed to load data", TYPE.ERROR);
      } finally {
        this.isLoading = false;
      }
    },
    onNewFilters(filters) {
      this.filters = filters;

      this.fetchTransactions(
        this.selectedPage,
        filters,
        this.currentSort,
        this.asc
      );
    },
    sortByColumn(column) {
      if (column == this.currentSort) {
        this.asc = !this.asc;
      } else {
        this.asc = true;
        this.currentSort = column;
      }

      this.fetchTransactions(
        this.selectedPage,
        this.filters,
        this.currentSort,
        this.asc
      );
    },
    async onDeleteTransaction(transaction) {
      try {
        await deleteTransaction(transaction.id);
        this.newToast("Transaction deleted", TYPE.SUCCESS);

        this.fetchTransactions(
          this.selectedPage,
          this.filters,
          this.currentSort,
          this.asc
        );
        this.$refs.chartsComp.refresh();
      } catch (err) {
        this.newToast("Transaction deletion failed", TYPE.ERROR);
      }
    },
    isColorLight(color) {
      return Color(color).isLight(color);
    },
    async onDownloadReport() {
      try {
        const response = await getExcelReport();

        const fileData = new Blob([response], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadLink = document.createElement("a");

        downloadLink.href = window.URL.createObjectURL(fileData);
        downloadLink.setAttribute("download", "Report.xlsx");

        downloadLink.click();
      } catch (err) {
        console.error(err);
        this.newToast("Report download failed", TYPE.ERROR);
      }
    },
    onUpdateTransaction(tx) {
      this.$refs.updateModal.setTx(tx);
    },
    onTxUpdated() {
      this.fetchTransactions(
        this.selectedPage,
        this.filters,
        this.currentSort,
        this.asc
      );
      this.$refs.chartsComp.refresh();
    },
  },
};
</script>

<style scoped>
table {
  position: relative;
}

.spinner-border {
  position: absolute;
  top: 50%;
  left: 50%;
}

.home-container {
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
}

.no-border-top {
  border-top: 0 !important;
}

.dropdown {
  text-align: center;
}

.pointer {
  cursor: pointer;
}

.pointer:hover {
  text-decoration: underline;
}

::-webkit-scrollbar {
  width: 10px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: none;
  margin: 0px 120px 0px 120px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #0e6dfd;
  border-radius: 10px;
  background-repeat: no-repeat, no-repeat;
  background-size: 30px;
}
</style>
