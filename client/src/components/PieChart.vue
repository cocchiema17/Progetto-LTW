<template>
  <Pie class="h-100" :data="chartData" :options="{ responsive: true }" />
</template>

<script>
import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

import { Pie } from "vue-chartjs";

ChartJS.register(CategoryScale, LinearScale, Tooltip, ArcElement);

export default {
  name: "PieChart",
  props: ["transactions"],
  components: { Pie },
  computed: {
    chartData() {
      const categories = Array.from(
        new Set(this.transactions.map((t) => t.categoryName))
      );
      const pieData = categories.map(
        (c) => this.transactions.filter((t) => t.categoryName == c).length
      );
      return {
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
    },
  },
};
</script>

<style scoped>

</style>