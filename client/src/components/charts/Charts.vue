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
              :max="new Date().toISOString().split('T')[0]"
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
              type="date"
              :max="new Date().toISOString().split('T')[0]"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mw-100 pb-3" style="height: 30vh">
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