<template>
  <div></div>
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

      const months = Array.from(
        new Set(value.map((t) => new Date(t.transactionDate).getMonth()))
      );
      const barData = months.map(
        (m) =>
          value.filter((t) => new Date(t.transactionDate).getMonth() == m)
            .length
      );

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
