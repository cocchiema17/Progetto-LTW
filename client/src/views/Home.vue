<template>
  <div class="home-container">
    <Navbar :user="user" />

    <Charts />

    <TableHeader
      :totalTransactions="totalTransactions"
      :pageSize="pageSize"
      :transactions="transactions"
      :totalPages="totalPages"
      @new-tx="onNewTx"
    />
    <!-- <table class="table table-hover align-middle table-bordered">
      <thead class="sticky-top">
        <tr class="table-light no-border-top">
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Amount</th>
          <th scope="col">Space</th>
          <th scope="col">Category</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in transactions" :key="t.id">
          <th scope="row">{{ t.row_number }}</th>
          <td>{{ t.title }}</td>
          <td>{{ t.description }}</td>
          <td :class="t.type == 'expense' ? 'text-danger' : 'text-success'">
            {{ (t.type == "expense" ? "-" : "+") + t.value + " € " }}
          </td>
          <td>{{ t.spaceName }}</td>
          <td>{{ t.categoryName }}</td>
          <td>
            {{ new Date(t.transactionDate).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>  -->

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
            <th scope="col" @click="sortByColumn('date')" class="pointer">
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
              {{ (t.type == "expense" ? "-" : "+") + t.value + " € " }}
            </td>
            <td>{{ t.spaceName }}</td>
            <td>{{ t.categoryName }}</td>
            <td>
              {{ new Date(t.transactionDate).toLocaleDateString() }}
            </td>
            <td>
              <!-- <img
                src="../assets/cestino.png"
                class="pointer"
                @click.prevent="deleteTransaction(t)"
              /> -->

              <button class="btn btn-outline-danger">
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
  <!-- </div>
  </div> -->
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
      isSortAsc: true,
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
        getTransactions(this.pageSize, 0),
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
    async onPageClicked(page) {
      this.selectedPage = page;
      await this.fetchTransactions(page);
    },
    async fetchTransactions(page) {
      const { totalElements, totalPages, value } = await getTransactions(
        this.pageSize,
        page
      );

      this.transactions = value;
      this.totalTransactions = totalElements;
      this.totalPages = totalPages;
    },
    async sortByColumn(column) {
      console.log(column);
      if (column == this.currentSort) {
        this.isSortAsc = !this.isSortAsc;
      } else {
        this.isSortAsc = true;
        this.currentSort = column;
      }
      try {
        const result = await getTransactions(this.pageSize, this.selectedPage);
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    },
    // async sortByColumn(column) {
    //   if (column === this.currentSortColumn) {
    //     this.isSortAsc = !this.isSortAsc;
    //   } else {
    //     this.isSortAsc = true;
    //     this.currentSortColumn = column;
    //   }

    //   this.transactions.sort((a, b) => {
    //     console.log("A: ", a);
    //     console.log("B: ", b);
    //     const valueA = this.getValueByColumn(a, column);
    //     const valueB = this.getValueByColumn(b, column);

    //     if (typeof valueA === "number" && typeof valueB === "number") {
    //       return this.compareNumbers(valueA, valueB);
    //     } else if (valueA instanceof Date && valueB instanceof Date) {
    //       return this.compareDates(valueA, valueB);
    //     } else {
    //       return this.compareStrings(valueA, valueB);
    //     }
    //   });
    // },

    // getValueByColumn(item, column) {
    //   const columnValue = item[column];

    //   if (typeof columnValue === "string") {
    //     return columnValue.toLowerCase(); // Converto in minuscolo per l'ordinamento non case-sensitive delle stringhe
    //   }

    //   return columnValue;
    // },

    // compareNumbers(a, b) {
    //   return this.isSortAsc ? a - b : b - a;
    // },

    // compareDates(a, b) {
    //   return this.isSortAsc
    //     ? a.getTime() - b.getTime()
    //     : b.getTime() - a.getTime();
    // },

    // compareStrings(a, b) {
    //   if (a < b) return this.isSortAsc ? -1 : 1;
    //   if (a > b) return this.isSortAsc ? 1 : -1;
    //   return 0;
    // },
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
</style>
