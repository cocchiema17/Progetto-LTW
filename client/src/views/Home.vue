<template>
  <div class="home-container">
    <Navbar :user="user" />

    <Charts />

    <TableHeader
      :totalTransactions="totalTransactions"
      :totalPages="totalPages"
      @new-tx="onNewTx"
      @new-filters="onNewFilters"
    />

    <div class="table-responsive p-2">
      <table class="table">
        <thead class="sticky-top">
          <tr class="">
            <th scope="col">#</th>
            <th scope="col" @click="sortByColumn('title')" class="pointer">
              Title
              <span v-if="asc == 'ASC' && currentSort == 'title'">
                <i class="bi bi-sort-down text-success"></i>
              </span>
              <span v-else>
                <i class="bi bi-sort-up text-success"></i>
              </span>
            </th>
            <th
              scope="col"
              @click="sortByColumn('description')"
              class="pointer"
            >
              Description
              <span v-if="asc == 'ASC' && currentSort == 'description'">
                <i class="bi bi-sort-down text-success"></i>
              </span>
              <span v-else>
                <i class="bi bi-sort-up text-success"></i>
              </span>
            </th>
            <th scope="col" @click="sortByColumn('value')" class="pointer">
              Amount
              <span v-if="asc == 'ASC' && currentSort == 'value'">
                <i class="bi bi-sort-down text-success"></i>
              </span>
              <span v-else>
                <i class="bi bi-sort-up text-success"></i>
              </span>
            </th>
            <th scope="col" @click="sortByColumn('name')" class="pointer">
              Space
              <span v-if="asc == 'ASC' && currentSort == 'name'">
                <i class="bi bi-sort-down text-success"></i>
              </span>
              <span v-else>
                <i class="bi bi-sort-up text-success"></i>
              </span>
            </th>
            <th
              scope="col"
              @click="sortByColumn('categoryName')"
              class="pointer"
            >
              Category
              <span v-if="asc == 'ASC' && currentSort == 'categoryName'">
                <i class="bi bi-sort-down text-success"></i>
              </span>
              <span v-else>
                <i class="bi bi-sort-up text-success"></i>
              </span>
            </th>
            <th
              scope="col"
              @click="sortByColumn('transactionDate')"
              class="pointer"
            >
              Date
              <span v-if="asc == 'ASC' && currentSort == 'transactionDate'">
                <i class="bi bi-sort-down text-success"></i>
              </span>
              <span v-else>
                <i class="bi bi-sort-up text-success"></i>
              </span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transactions" :key="t.id">
            <th scope="row">{{ t.row_number }}</th>
            <td>{{ t.title }}</td>
            <td>{{ t.description }}</td>
            <td :class="t.type == 'expense' ? 'text-danger' : 'text-success'">
              {{ (t.type == "expense" ? "" : "+") + t.value + " € " }}
            </td>
            <td>{{ t.spaceName }}</td>
            <td>{{ t.categoryName }}</td>
            <td>
              {{ new Date(t.transactionDate).toLocaleDateString() }}
            </td>
            <td>
              <button
                class="btn btn-outline-success"
              >
              <i class="bi bi-pencil-square"></i>
              </button>
            </td>
            <td>
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

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <PaginationButtons
          :totalPages="totalPages"
          :pageSize="pageSize"
          :selectedPage="selectedPage"
          @page-clicked="onPageClicked"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import {
  getSpaces,
  getCategories,
  getTransactions,
  deleteTransaction,
} from "../api";

import { mapGetters } from "vuex";
import Navbar from "../components/Navbar";
import TableHeader from "../components/TableHeader";
import PaginationButtons from "../components/PaginationButtons";
import Charts from "../components/charts/Charts";
import { TYPE } from "vue-toastification";

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
      const results = await Promise.all([
        getSpaces(),
        getCategories(),
        getTransactions(0),
      ]);

      this.$store.dispatch("spaces", results[0]);
      this.$store.dispatch("categories", results[1]);

      this.transactions = results[2].value;
      this.totalTransactions = results[2].totalElements;
      this.totalPages = results[2].totalPages;
    } catch (err) {
      this.newToast("Failed to load data", TYPE.ERROR);
    }
  },
  methods: {
    async onNewTx(tx) {
      await this.fetchTransactions(this.selectedPage);

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
      console.log("FETCH TRANSACTIONS", sortColumn, asc);
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
    // TO DO
    async deleteTransaction(transition) {
      // console.log("DELETE", transition.id);
      await deleteTransaction(transition.id);
    },
  },
};
</script>

<style scoped>
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
</style>
