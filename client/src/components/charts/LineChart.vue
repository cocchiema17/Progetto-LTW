<template>
  <Line
    :options="{ responsive: true, maintainAspectRatio: false }"
    :data="chartData"
  />
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
import { getMonthName } from "../../utils";

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

      this.data.forEach((d) => {
        labels.push(`${getMonthName(parseInt(d.month))}, ${d.year}`);

        data.push(d.value);
      });

      const chartData = {
        labels,
        datasets: [
          {
            data,
            label: "Space value",
            borderColor: "#86bbd8",
            backgroundColor: "#86bbd8",
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