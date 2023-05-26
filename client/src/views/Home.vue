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

    <!-- <ul class="nav justify-content-center">
      <li class="nav-item">
        <PaginationButtons
          :totalPages="totalPages"
          :pageSize="pageSize"
          :selectedPage="selectedPage"
          @page-clicked="onPageClicked"
        /> -->
    <div class="table-responsive p-2">
      <table class="table">
        <thead class="sticky-top">
          <tr class="">
            <th scope="col">#</th>
            <th scope="col" @click="sortByColumn('title')" class="pointer">
              Title
            </th>
            <th
              scope="col"
              @click="sortByColumn('description')"
              class="pointer"
            >
              Description
            </th>
            <th scope="col" @click="sortByColumn('value')" class="pointer">
              Amount
            </th>
            <th scope="col" @click="sortByColumn('name')" class="pointer">
              Space
            </th>
            <th
              scope="col"
              @click="sortByColumn('categoryName')"
              class="pointer"
            >
              Category
            </th>
            <th
              scope="col"
              @click="sortByColumn('transactionDate')"
              class="pointer"
            >
              Date
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
              <button class="btn btn-outline-danger" @click="deleteTransaction(t)">
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
  getCurrentUser,
  getSpaces,
  getCategories,
  getTransactions,
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
      currentSort: "",
      isSortAsc: false,
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
      const user = await getCurrentUser();
      this.$store.dispatch("user", user);
    } catch (err) {
      this.$router.push("/login");
      return;
    }

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
      this.fetchTransactions(
        page,
        this.filters,
        this.currentSort,
        this.isSortAsc
      );
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
      // console.log("FILTERS IN HOME", filters);
      this.fetchTransactions(
        this.selectedPage,
        filters,
        this.currentSort,
        this.isSortAsc
      );
    },
    async sortByColumn(column) {
      console.log(column);
      if (column == this.currentSort) {
        this.isSortAsc = !this.isSortAsc;
      } else {
        this.isSortAsc = true;
        this.currentSort = column;
      }
      console.log(this.currentSort);
      console.log(this.isSortAsc);
      this.fetchTransactions(
        this.selectedPage,
        this.filters,
        this.currentSort,
        this.isSortAsc
      );
    },
    async deleteTransaction(transition) {
      console.log("DELETE", transition);
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
