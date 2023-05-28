<template>
  <div>
    <div class="row g-3 mt-2 ps-4 pe-4 w-100">
      <div class="col-12 col-md-6">
        <div class="row">
          <div class="col-2 d-flex justify-content-center">
            <label class="col-form-label">Space</label>
          </div>
          <div class="col-10">
            <select class="form-select" v-model="selectedSpace">
              <option v-for="s in spaces" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="row">
          <div class="col-2 d-flex justify-content-center">
            <label class="col-form-label">Da</label>
          </div>
          <div class="col-10">
            <input
              class="form-control"
              type="date"
              v-model="fromDate"
              :max="toDate"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="row">
          <div class="col-2 d-flex justify-content-center">
            <label class="col-form-label">A</label>
          </div>
          <div class="col-10">
            <input
              class="form-control"
              v-model="toDate"
              type="date"
              :min="fromDate"
              :max="new Date().toISOString().split('T')[0]"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mw-100 pb-3" style="height: 40vh">
      <div class="w-100 row p-3 h-100 flex-nowrap" style="overflow-x: auto">
        <div class="col-lg-5">
          <BarChart :data="barChartData" />
        </div>
        <div class="col-lg-5">
          <LineChart :data="lineChartData" />
        </div>
        <div class="col-lg-2">
          <PieChart :data="pieChartData" />
        </div>
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
      fromDate: this.todayPlusMonths(-6),
      toDate: null,
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
    selectedSpace(value) {
      if (value) {
        this.loadsCharts(value, this.fromDate, this.toDate);
      }
    },
    fromDate(value) {
      if (this.selectedSpace && value.length == 10) {
        this.loadsCharts(this.selectedSpace, value, this.toDate);
      }
    },
    toDate(value) {
      if (this.selectedSpace && value.length == 10) {
        this.loadsCharts(this.selectedSpace, this.fromDate, value);
      }
    },
  },
  methods: {
    async loadsCharts(spaceId, fromDate, toDate) {
      if (!spaceId) return;

      try {
        const { data } = await getChartsData(spaceId, fromDate, toDate);
        this.pieChartData = data.pieChart;
        this.barChartData = data.barChart;
        this.lineChartData = data.lineChart;
      } catch (err) {
        this.newToast("Failed to load charts", TYPE.ERROR);
      }
    },
    refresh() {
      this.loadsCharts(this.selectedSpace, this.fromDate, this.toDate);
    },
    todayPlusMonths(months) {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth() + months, d.getDate())
        .toISOString()
        .split("T")[0];
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 10px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: none;
  margin: 0px 120px 0px 120px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #0e6dfd;
  border-radius: 10px;
  background-repeat: no-repeat, no-repeat;
  background-size: 30px;
}
</style>