<template>
  <Bar class="h-100 w-100" :options="{ responsive: false }" :data="chartData" />
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
      //const labels = [];

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
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 1,
            borderRadius: 15,
            borderSkipped: false,
          },
          {
            data: [],
            label: "Revenute",
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgb(54, 162, 235, 0.5)',
            borderWidth: 1,
            borderRadius: 15,
            borderSkipped: false,
          },
        ],
      };

      Object.entries(grouped).forEach((v) => {
        chartData.labels.push(v[0]);
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