<template>
  <Bar :data="data" :options="{ responsive: true }" />
</template>
<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  props: ["data"],
  components: { Bar },
};
</script>
