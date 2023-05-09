<template>
  <div>
    <div class="row charts-wrapper">
      <PieChart v-if="loaded" :data="pieChartData" />
      <BarChart v-if="loaded" :data="barChartData" />
    </div>

    <div class="d-flex justify-content-end mt-3 align-items-baseline">
      <div class="d-flex">
        <div class="btn-group p-1" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-primary">Filter</button>
          <button type="button" class="btn btn-outline-primary">Sort</button>
          <button type="button" class="btn btn-outline-primary">
            Download
          </button>
        </div>
        <button type="button" class="btn btn-link">Add</button>
      </div>
    </div>

    <table class="table table-hover align-middle">
      <thead>
        <tr class="table-light">
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Amount</th>
          <th scope="col">Category</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="t in transactions" :key="t.id">
          <td>{{ t.title }}</td>
          <td>{{ t.description }}</td>
          <td>
            <p :class="[t.type == 'expense' ? 'text-danger' : 'text-success']">
              {{ t.type == "expense" ? "-" : "+" }}{{ t.currency }}
              {{ t.value }}
            </p>
          </td>
          <td>{{ t.categoryName }}</td>
          <td>{{ new Date(t.transactionDate).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import BarChart from "./BarChart";
import PieChart from "./PieChart";

export default {
  name: "App",
  components: {
    PieChart,
    BarChart,
  },
  computed: {
    ...mapGetters(["selectedSpace"]),
  },
  data() {
    return {
      transactions: [],
      pieChartData: [],
      loaded: false,
    };
  },
  async created() {
    const response = await fetch("/api/transactions?spaceId=2", {
      method: "GET",
      headers: {
        "x-csrf-token": localStorage.getItem("csrfToken"),
      },
    });

    if (response.status === 200) {
      const { value } = await response.json();
      this.transactions = value;

      const categories = Array.from(new Set(value.map((t) => t.categoryName)));
      const pieData = categories.map(
        (c) => value.filter((t) => t.categoryName == c).length
      );

      const months = Array.from(
        new Set(value.map((t) => new Date(t.transactionDate).getMonth()))
      );
      const barData = months.map(
        (m) =>
          value.filter((t) => new Date(t.transactionDate).getMonth() == m)
            .length
      );

      this.pieChartData = {
        labels: categories,
        datasets: [
          {
            data: pieData,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
          },
        ],
      };

      this.barChartData = {
        labels: months,
        datasets: [
          {
            data: barData,
            borderWidth: 1,
          },
        ],
      };

      this.loaded = true;
    }
  },
};
</script>

<style scoped>
.charts-wrapper {
  max-height: 40vh;
}
</style>