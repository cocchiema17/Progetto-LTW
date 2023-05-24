<template>
  <Line class="h-100  w-100" :options="{ responsive: false }" :data="chartData" />
</template>

<script>
import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";

import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  LineElement,
  PointElement
);

export default {
  name: "LineChartComp",
  props: ["data"],
  components: { Line },
  computed: {
    chartData() {
      const labels = [];
      const data = [];

      console.log(this.data);

      this.data.forEach((d) => {
        labels.push(`${d.month}, ${d.year}`);
        data.push(d.value);
      });

      const chartData = {
        labels,
        datasets: [
          {
            data,
            label: "Space value",
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgb(54, 162, 235, 0.5)",
            borderWidth: 1,
            borderRadius: 15,
            borderSkipped: false,
          },
        ],
      };

      return chartData;
    },
  },
};
</script>
<style>
</style>