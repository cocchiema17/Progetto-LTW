<template>
  <div class="home-container">
    <Navbar :user="user" />

    <div class="container-fluid h-100 m-0 p-0">
      <div class="row p-3">
        <div class="col-8">
          <select class="form-select" v-model="chartSpace">
            <option v-for="(s, idx) in spaces" :key="idx" :value="idx">
              {{ s.name }}
            </option>
          </select>
        </div>

        <div class="col-2">
          <input class="form-control" type="date" />
        </div>

        <div class="col-2">
          <input class="form-control" type="date" />
        </div>
      </div>

      <!--<div class="container-fluid charts-container border m-0 p-3">
        <PieChart :transactions="transactions" />
      </div>-->
      <Charts :chartSpace="chartSpace" />

      <div
        class="table-container container-fluid m-0 p-0 justify-content-center"
      >
        <TableHeader
          :totalTransactions="totalTransactions"
          :pageSize="pageSize"
          :transactions="transactions"
          :totalPages="totalPages"
          @new-tx="onNewTx"
        />
        <div class="table-scroll">
          <table class="table table-hover align-middle table-bordered">
            <thead class="sticky-top">
              <tr class="table-light no-border-top">
                <th scope="col">#</th>
                <th scope="col" @click="sortByColumn('title')" class="pointer">Title</th>
                <th scope="col" @click="sortByColumn('description')" class="pointer">Description</th>
                <th scope="col" @click="sortByColumn('amount')" class="pointer">Amount</th>
                <th scope="col" @click="sortByColumn('space')" class="pointer">Space</th>
                <th scope="col" @click="sortByColumn('category')" class="pointer">Category</th>
                <th scope="col" @click="sortByColumn('date')" class="pointer">Date</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in transactions" :key="t.id">
                <th scope="row">{{ t.row_number }}</th>
                <td>{{ t.title }}</td>
                <td>{{ t.description }}</td>
                <td
                  :class="t.type == 'expense' ? 'text-danger' : 'text-success'"
                >
                  {{ (t.type == "expense" ? "-" : "+") + t.value + " € " }}
                </td>
                <td>{{ t.spaceName }}</td>
                <td>{{ t.categoryName }}</td>
                <td>
                  {{ new Date(t.transactionDate).toLocaleDateString() }}
                </td>
                <td><img src="../assets/cestino.png" class="pointer" @click.prevent="deleteTransaction(t)"/></td>
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
    </div>
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
      console.log(this.currentSort);
      console.log(this.isSortAsc);
      if (column == this.currentSort){
        this.isSortAsc = !this.isSortAsc;
      }
      else {
        this.isSortAsc = true;
        this.currentSort = column;
      }

      // this.transactions.sort((a, b) => {
      //   if (this.isSortAsc)
      //     return a[column] > b[column] ? 1 : -1;
      //   else
      //   return a[column] < b[column] ? 1 : -1;
      // });
    },
    async deleteTransaction(transition) {
      console.log("DELETE", transition);
    }
  },
};
</script>

<style scoped>
.home-container {
  padding-bottom: 60px;
  height: 100%;
}

.charts-wrapper {
  max-height: 40vh;
}

.charts-container {
  height: 40%;
}

.table-container {
  height: 60%;
}

.table-scroll {
  height: 77%;
  overflow-y: scroll;
  overflow-x: none;
  margin-bottom: 10px;
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
</style>
