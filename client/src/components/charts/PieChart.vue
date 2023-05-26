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
import randomColor from "randomcolor"; // import the script
import color from "color";

ChartJS.register(CategoryScale, LinearScale, Tooltip, ArcElement);

export default {
  name: "PieChartComp",
  props: ["data"],
  components: { Pie },
  computed: {
    chartData() {
      const labels = [];
      const backgroundColor = randomColor({
        count: this.data.length,
        format: "rgba",
        alpha: 0.5,
      });
      const borderColor = backgroundColor.map((c) => color(c).alpha(1).hexa());

      const datasets = [
        {
          data: [],
          backgroundColor,
          borderColor,
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