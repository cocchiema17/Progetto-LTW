<template>
  <div class="home-container">
    <Navbar :user="user" :spaces="spaces" @space-selected="onSpaceSelected" />

    <div class="container-fluid h-100 m-0 p-0">
      <div class="container-fluid charts-container border m-0 p-3">
        <PieChart :transactions="transactions" />
      </div>

      <div
        class="table-container container-fluid m-0 p-0 justify-content-center"
      >
        <TableHeader :totalTransactions="totalTransactions" />

        <table class="table table-hover align-middle table-bordered">
          <thead class="sticky-top">
            <tr class="table-light">
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.id">
              <td>{{ t.title }}</td>
              <td>{{ t.description }}</td>
              <td>
                <p
                  :class="[
                    t.type == 'expense' ? 'text-danger' : 'text-success',
                  ]"
                >
                  {{ t.type == "expense" ? "-" : "+" }}{{ t.currency }}
                  {{ t.value }}
                </p>
              </td>
              <td>{{ t.categoryName }}</td>
              <td>
                {{ new Date(t.transactionDate).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>

        <TableFooter />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Navbar from "../components/Navbar";
import TableHeader from "../components/TableHeader";
import TableFooter from "../components/TableFooter";
import PieChart from "../components/PieChart";

export default {
  name: "HomePage",
  computed: {
    ...mapGetters(["user"]),
  },
  data() {
    return {
      spaces: [],
      transactions: [],
      totalTransactions: null,
    };
  },
  components: {
    Navbar,
    PieChart,
    TableHeader,
    TableFooter,
  },
  async created() {
    const result = await fetch("/api/auth/currentUser", {
      headers: {
        "x-csrf-token": localStorage.getItem("csrfToken"),
      },
    });

    if (result.status === 200) {
      const user = await result.json();
      this.$store.dispatch("user", user);

      this.fetchSpaces();
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    async fetchSpaces() {
      const result = await fetch("/api/spaces", {
        headers: {
          "x-csrf-token": localStorage.getItem("csrfToken"),
        },
      });

      if (result.status === 200) {
        const { value } = await result.json();
        this.spaces = value;
      }
    },

    async fetchTransactions(spaceId, page, pageSize) {
      const result = await fetch("/api/transactions?spaceId=" + spaceId, {
        headers: {
          "x-csrf-token": localStorage.getItem("csrfToken"),
        },
        params: {
          page,
          pageSize,
        },
      });

      if (result.status === 200) {
        const { totalElements, value } = await result.json();
        this.totalTransactions = totalElements;
        this.transactions = value;
      }
    },

    onSpaceSelected(space) {
      this.fetchTransactions(space.id, 1, 10);
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
  overflow-y: scroll;
}
</style>