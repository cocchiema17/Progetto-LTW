<template>
  <Pie
    :options="{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: false,
        title: false,
      },
    }"
    :data="chartData"
  />
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
  name: "PieChartComp",
  props: ["data"],
  components: { Pie },
  computed: {
    chartData() {
      const labels = [];

      const datasets = [
        {
          data: [],
          backgroundColor: this.data.map(d => d.color),
          borderWidth: 1,
          borderSkipped: false,
        },
      ];

      this.data.forEach((d) => {
        labels.push(d.categoryName);
        datasets[0].data.push(d.count);
      });

      return {
        labels,
        datasets,
      };
    },
  },
};
</script>

<style scoped>
</style>