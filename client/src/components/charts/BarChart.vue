<template>
  <Bar
    :options="{ responsive: true, maintainAspectRatio: false }"
    :data="chartData"
  />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getMonthName } from "../../utils";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChartComp",
  props: ["data"],
  components: { Bar },
  computed: {
    chartData() {
      const grouped = {};

      this.data.forEach((d) => {
        const month = d.month;
        const year = d.year;

        grouped[`${month}-${year}`] = {
          expense: 0,
          revenue: 0,
        };
      });

      this.data.forEach((d) => {
        const month = d.month;
        const year = d.year;

        grouped[`${month}-${year}`][d.type] = d.total;
      });

      const chartData = {
        labels: [],
        datasets: [
          {
            data: [],
            label: "Expense",
            borderColor: "#ff3a3a",
            backgroundColor: "#ff3a3a",
            borderWidth: 1,
            borderRadius: 15,
            borderSkipped: false,
          },
          {
            data: [],
            label: "Revenue",
            borderColor: "#3a6bff",
            backgroundColor: "#3a6bff",
            borderWidth: 1,
            borderRadius: 15,
            borderSkipped: false,
          },
        ],
      };

      Object.entries(grouped).forEach((v) => {
        const [month, year] = v[0].split("-");
        chartData.labels.push(`${getMonthName(parseInt(month))}, ${year}`);

        chartData.datasets[0].data.push(v[1]["expense"]);
        chartData.datasets[1].data.push(v[1]["revenue"]);
      });

      return chartData;
    },
  },
};
</script>
<style>
</style>