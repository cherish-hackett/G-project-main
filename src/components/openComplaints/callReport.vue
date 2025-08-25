<template>
    <q-layout view="lHh Lpr lFf">
      <q-header>
        <barHeader message="Call Report" />
      </q-header>
      <q-page-container>
        <PieChart :chartData="chartData" :buttonData="buttonData" v-if="dataFetched" />
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  import PieChart from '../SubCom/PieChart.vue';
  import barHeader from '../SubCom/barHeader.vue';
  import { callList } from '../../stores/callList.js';
  import { Loading } from "quasar";
  export default {
    components: {
      PieChart,
      barHeader
    },
    setup() {
      const store = new callList();
      return {
        store
      }
    },
    data() {
      return {
        buttonData: [
          { label: 'Not Assigned', count: 0, path: 'callReportList', type: 'N' },
          { label: 'Assigned to Technician', count: 0, path: 'callReportList', type: 'A' },
          { label: 'Accepted By Technician', count: 0, path: 'callReportList', type: 'S' },
          { label: 'Technician On Job', count: 0, path: 'callReportList', type: 'J' }
        ],
        chartData: {
          labels: ['<24 Hrs', '24-48 Hrs', '>=48 Hrs'],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ['#FF6384', '#36A2EB', 'red']
            }
          ]
        },
        dataFetched: false
      };
    },
    methods: {
      async getList() {
        Loading.show();
        const da = {type: "" };
        try {
          const response = await this.store.callReport(da);
  
          // Assigning values to buttonData
          this.buttonData[0].count = response["Not Assigned"];
          this.buttonData[1].count = response["Assigned To Technician"];
          this.buttonData[2].count = response["Accepted by Technician"];
          this.buttonData[3].count = response["Technician on Job"];
  
          // Updating chartData
          this.chartData.datasets[0].data = [
            response["<24Hrs"],
            response["24-48Hrs"],
            response[">=48Hrs"]
          ];
  
          this.dataFetched = true; 
          Loading.hide();
        } catch (err) {
          console.error(err);
        }
      }
    },
    mounted() {
      this.getList();
    }
  };
  </script>
  