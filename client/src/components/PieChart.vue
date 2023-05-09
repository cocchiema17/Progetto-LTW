<template>
  <Pie :data="data" :options="{ responsive: true }" />
</template>

<script>
import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  ArcElement
} from "chart.js";

import { Pie } from "vue-chartjs";

ChartJS.register(CategoryScale, LinearScale, Tooltip, ArcElement);

export default {
  name: "PieChart",
  props: ["data"],
  components: { Pie },
};
</script>