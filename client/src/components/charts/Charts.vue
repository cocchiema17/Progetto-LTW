<template>
  <div class="row">
    <PieChart :data="pieChartData" />
    <LineChart :data="lineChartData" />
    <BarChart :data="barChartData" />
  </div>
</template>

<script>
import { TYPE } from "vue-toastification";
import { getChartsData } from "../../api";

import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

export default {
  name: "ChartsComp",
  props: ["chartSpace"],
  components: {
    PieChart,
    LineChart,
    BarChart,
  },
  data() {
    return {
      chartsData: [],
    };
  },
  computed: {
    pieChartData() {
      return [];
    },
    lineChartData() {
      return [];
    },
    barChartData() {
      return [];
    },
  },
  async created() {},
  watch: {
    async chartSpace(spaceId) {
      this.loadsCharts(spaceId);
    },
  },
  methods: {
    async loadsCharts(spaceId) {
      try {
        this.chartsData = await getChartsData(spaceId);
      } catch (err) {
        this.newToast("Failed to load charts", TYPE.ERROR);
      }
    },
  },
};
</script>

<style>
</style>