<template>
  <div class="charts-container">
    <div class="row p-3 pb-0 charts-header">
      <div class="col-8">
        <select class="form-control form-control-sm" v-model="selectedSpace">
          <option v-for="s in spaces" :key="s.id" :value="s.id">
            {{ s.name }}
          </option>
        </select>
      </div>

      <div class="col-2">
        <input class="form-control form-control-sm" type="date" />
      </div>

      <div class="col-2">
        <input class="form-control form-control-sm" type="date" />
      </div>
    </div>

    <div class="row p-0 pl-3 pe-3 m-0 charts-wrapper">
      <div class="col-5 p-3 m-0 h-100 d-flex justify-content-center">
        <BarChart :data="barChartData" />
      </div>
      <div class="col-4 p-3 m-0 h-100 d-flex justify-content-center">
        <LineChart :data="lineChartData" />
      </div>
      <div class="col-3 p-3 m-0 h-100 d-flex justify-content-center">
        <PieChart :data="pieChartData" />
      </div>
    </div>
  </div>
</template>

<script>
import { TYPE } from "vue-toastification";
import { getChartsData } from "../../api";
import { mapGetters } from "vuex";

import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

export default {
  name: "ChartsComp",
  props: ["spaceId"],
  components: {
    PieChart,
    LineChart,
    BarChart,
  },
  computed: {
    ...mapGetters(["spaces"]),
  },
  data() {
    return {
      selectedSpace: null,
      barChartData: [],
      lineChartData: [],
      pieChartData: [],
    };
  },
  async created() {
    if (this.selectedSpace) {
      this.loadsCharts(this.selectedSpace);
    }
  },
  watch: {
    async selectedSpace(value) {
      this.loadsCharts(value);
    },
  },
  methods: {
    async loadsCharts(spaceId) {
      try {
        const { data } = await getChartsData(spaceId);
        this.pieChartData = data.pieChart;
        this.barChartData = data.barChart;
        this.lineChartData = data.lineChart;
      } catch (err) {
        this.newToast("Failed to load charts", TYPE.ERROR);
      }
    },
  },
};
</script>

<style>
.charts-container {
  height: 45vh;
}
.charts-header {
  height: 15%;
}
.charts-wrapper {
  height: 85%;
  overflow-x: auto;
  white-space: nowrap;
}
</style>