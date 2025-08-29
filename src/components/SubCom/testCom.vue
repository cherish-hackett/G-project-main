<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <barHeader message="Call Allocation" />
    </q-header>
    <q-page-container>
      <PieChart
        :chartData="chartData"
        :buttonData="buttonData"
        v-if="dataFetched"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import PieChart from "./PieChart.vue";
import barHeader from "./barHeader.vue";
import { callList } from "../../stores/callList.js";
import { Loading } from "quasar";
export default {
  components: {
    PieChart,
    barHeader,
  },
  setup() {
    const store = new callList();
    return {
      store,
    };
  },
  data() {
    return {
      buttonData: [
        { label: "Complaint", count: 0, path: "allocationList", type: "CP" },
        {
          label: "Commissioning",
          count: 0,
          path: "allocationList",
          type: "CM",
        },
        {
          label: "Preventive Maintenance",
          count: 0,
          path: "allocationList",
          type: "PM",
        },
      ],
      chartData: {
        labels: ["Complaint", "Commissioning", "Preventive Maintenance"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ["#FF6384", "#36A2EB", "red"],
          },
        ],
      },
      dataFetched: false, // Loading flag
    };
  },
  methods: {
    async getList() {
      Loading.show();
      const da = { type: "" };
      try {
        const response = await this.store.fetchCallAllocationList(da);
        const serviceDetails = response.ServiceDetails;
        console.log(serviceDetails);

        const counts = serviceDetails.reduce(
          (acc, item) => {
            if (item.reqType === "PVM") {
              acc[0]++;
            } else if (item.reqType === "IAC" || item.reqType === "PRC") {
              acc[1]++;
            } else {
              acc[2]++;
            }
            return acc;
          },
          [0, 0, 0]
        );
        this.buttonData[0].count = counts[2];
        this.buttonData[1].count = counts[1];
        this.buttonData[2].count = counts[0];

        // Update chart data
        this.chartData.datasets[0].data[0] = counts[2];
        this.chartData.datasets[0].data[1] = counts[1];
        this.chartData.datasets[0].data[2] = counts[0];

        console.log(this.chartData.datasets[0].data);
        this.dataFetched = true;
        Loading.hide();
      } catch (error) {
        console.error("Error fetching call allocation list:", error);
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
