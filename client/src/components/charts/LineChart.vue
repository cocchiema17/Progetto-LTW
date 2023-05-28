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
            borderWidth: 1,
            borderRadius: 15,
            borderSkipped: false,
            pointBackgroundColor: function (context) {
              var value = context.dataset.data[context.dataIndex];
              return value < 0 ? "#ff3a3a" : "#3a6bff";
            },
            pointBorderColor: function (context) {
              var value = context.dataset.data[context.dataIndex];
              return value < 0 ? "#ff3a3a" : "#3a6bff";
            },
            borderColor: '#72d377'
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