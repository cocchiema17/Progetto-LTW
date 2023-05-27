<template>
  <div class="home-container">
    <Navbar />

    <Charts ref="chartsComp" />

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <TableHeader
            :totalTransactions="totalTransactions"
            :totalPages="totalPages"
            @new-tx="onNewTx"
            @new-filters="onNewFilters"
          />
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <div
            class="table-responsive"
          >
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
                      <span v-if="asc == 'ASC' && currentSort == 'title'">
                        <i class="bi bi-sort-down text-success"></i>
                      </span>
                      <span v-else>
                        <i class="bi bi-sort-up text-success"></i>
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
                      <span v-if="asc == 'ASC' && currentSort == 'description'">
                        <i class="bi bi-sort-down text-success"></i>
                      </span>
                      <span v-else>
                        <i class="bi bi-sort-up text-success"></i>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    @click="sortByColumn('value')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Amount</span>
                      <span v-if="asc == 'ASC' && currentSort == 'value'">
                        <i class="bi bi-sort-down text-success"></i>
                      </span>
                      <span v-else>
                        <i class="bi bi-sort-up text-success"></i>
                      </span>
                    </div>
                  </th>
                  <th scope="col" @click="sortByColumn('name')" class="pointer">
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Space</span>
                      <span v-if="asc == 'ASC' && currentSort == 'name'">
                        <i class="bi bi-sort-down text-success"></i>
                      </span>
                      <span v-else>
                        <i class="bi bi-sort-up text-success"></i>
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    @click="sortByColumn('categoryName')"
                    class="pointer"
                  >
                    <div class="d-flex flex-nowrap">
                      <span class="me-2">Category</span>
                      <span
                        v-if="asc == 'ASC' && currentSort == 'categoryName'"
                      >
                        <i class="bi bi-sort-down text-success"></i>
                      </span>
                      <span v-else>
                        <i class="bi bi-sort-up text-success"></i>
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
                      <span
                        v-if="asc == 'ASC' && currentSort == 'transactionDate'"
                      >
                        <i class="bi bi-sort-down text-success"></i>
                      </span>
                      <span v-else>
                        <i class="bi bi-sort-up text-success"></i>
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
                  <td class="d-flex">
                    <button
                      class="btn btn-outline-success me-2"
                      @click="updateTransaction(t)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="deleteTransaction(t)"
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
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
  </div>
</template>

<script>
import {
  getSpaces,
  getCategories,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "../api";

import { mapGetters } from "vuex";
import Navbar from "../components/Navbar";
import TableHeader from "../components/TableHeader";
import PaginationButtons from "../components/PaginationButtons";
import Charts from "../components/charts/Charts";
import { TYPE } from "vue-toastification";
import Color from "color";

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
      asc: "DESC",
      filters: {},
      isLoading: false,
    };
  },
  components: {
    Navbar,
    TableHeader,
    PaginationButtons,
    Charts,
  },
  async created() {
    try {
      this.isLoading = true;

      const results = await Promise.all([
        getSpaces(),
        getCategories(),
        getTransactions(0, this.pageSize),
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
      this.fetchTransactions(this.selectedPage);
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
      // fare chiamata get per aggiornare i grafici
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
    async sortByColumn(column) {
      console.log(column);
      if (column == this.currentSort) {
        this.asc = this.asc == "ASC" ? "DESC" : "ASC";
      } else {
        this.asc = "ASC";
        this.currentSort = column;
      }
      console.log(this.currentSort);
      console.log(this.asc);
      this.fetchTransactions(
        this.selectedPage,
        this.filters,
        this.currentSort,
        this.asc
      );
    },
    async deleteTransaction(transaction) {
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
    async updateTransaction(transaction) {
      try {
        await updateTransaction(transaction);
        this.newToast("Transaction updated", TYPE.SUCCESS);

        this.chartsComp.refresh();
      } catch (err) {
        this.newToast("Transaction update failed", TYPE.ERROR);
      }
    },
    isColorLight(color) {
      return Color(color).isLight(color);
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
