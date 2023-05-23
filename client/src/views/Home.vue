<template>
  <div class="home-container">
    <Navbar :user="user" />

    <div class="container-fluid h-100 m-0 p-0">
      <div class="container-fluid charts-container border m-0 p-3">
        <PieChart :transactions="transactions" />
      </div>

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
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Amount</th>
                <th scope="col">Space</th>
                <th scope="col">Category</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, idx) in transactions" :key="t.id">
                <th scope="row">{{ idx + 1 }}</th>
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
              </tr>
            </tbody>
          </table>
        </div>

        <TableFooter
          :totalPages="totalPages"
          :pageSize="pageSize"
          :selectedPage="selectedPage"
          @page-clicked="onPageClicked"
        />
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
import TableFooter from "../components/TableFooter";
import PieChart from "../components/PieChart";

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
    };
  },
  components: {
    Navbar,
    PieChart,
    TableHeader,
    TableFooter,
  },
  async created() {
    try {
      const user = await getCurrentUser();
      this.$store.dispatch("user", user);
    } catch (err) {
      this.$router.push("/login");
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
      alert(err.message);
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
  height: 65%;
  overflow-y: scroll;
  margin-bottom: 10px;
}

.no-border-top {
  border-top: 0 !important;
}

.dropdown {
  text-align: center;
}
</style>
