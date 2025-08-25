<template>
  <q-layout>
    <q-header>
      <barHeaderVue :message="service" />
    </q-header>
    <q-page-container>
      <q-card flat>
        <q-card-section horizontal>
          <q-card-section>
            <q-input
              v-model="fromDate"
              label="Select From Date" 
        
              readonly
              clearable
              @click="showFromDatePopup = true"
              dense
              standout
            >
              <template v-slot:prepend>
                <q-icon name="calendar_month" color="primary" />
              </template>
            </q-input>
            <q-popup-proxy
              v-model="showFromDatePopup"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="fromDateRaw"
                @update:model-value="onFromDateSelected"
                mask="YYYY-MM-DD"
              />
            </q-popup-proxy>
          </q-card-section>

          <q-card-section>
            <q-input
              v-model="toDate"
              label="Select To Date"
              readonly
              clearable
              @click="showToDatePopup = true"
              standout
              dense
            >
              <template v-slot:prepend>
                <q-icon name="calendar_month" color="primary" />
              </template>
            </q-input>
            <q-popup-proxy
              v-model="showToDatePopup"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="toDateRaw"
                @update:model-value="onToDateSelected"
                mask="YYYY-MM-DD"
                :navigation-min-year-month="min"
                :navigation-max-year-month="max"
              />
            </q-popup-proxy>
          </q-card-section>

          <q-card-section>
            <q-btn
              class="q-mt-xs bg-primary text-white"
              @click="updateCounts"
              dense
              >Search</q-btn
            >
          </q-card-section>
        </q-card-section>
      </q-card>

      <div class="q-px-sm">
        <q-list bordered v-for="(data, index) in listData" :key="index">
          <q-item clickable @click="listNav(data)">
            <q-item-section>{{ data.label }}</q-item-section>
            <q-item-section side>
              <!-- <q-avatar class="bg-grey-4 text-red-7 text-subtitle2">
                {{ data.count }}
              </q-avatar> -->
              <!-- <q-badge rounded color="primary"  ></q-badge> -->
              <q-badge color="red"> {{ data.count }}</q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import serviceInfo from "./serviceInfo.json";
import serviceCall from "./serviceCall.json";
import { callService } from "../../stores/callServices.js";
import { ref, onMounted, watch } from "vue";
import { date, useQuasar } from "quasar";
import barHeaderVue from "../SubCom/barHeader.vue";
import { useRouter } from "vue-router";
import { Loading } from "quasar";
export default {
  components: {
    barHeaderVue,
  },
  setup() {
    const $q = useQuasar();
    const isServiceInfo = ref(localStorage.getItem("status") === "true");
    const route = useRouter();
    const showFromDatePopup = ref(false);
    const showToDatePopup = ref(false);
    const fromDateRaw = ref(date.subtractFromDate(new Date(), { months: 3 }));
    const toDateRaw = ref(new Date());
    const fromDate = ref(date.formatDate(fromDateRaw.value, "DD/MM/YYYY"));
    const toDate = ref(date.formatDate(toDateRaw.value, "DD/MM/YYYY"));
    const min = ref(date.formatDate(fromDateRaw.value, "YYYY/MM"));
    const max = ref(date.formatDate(toDateRaw.value, "YYYY/MM"));
    const listData = ref(isServiceInfo.value ? serviceInfo : serviceCall);
    const store = callService();
    const service = ref(
      isServiceInfo.value ? "service Info" : "service Report"
    );

    const da = ref({
      fromDate: fromDate.value,
      toDate: toDate.value,
    });

    const updateCounts = async () => {
      Loading.show();
      try {
        const updateMethod = isServiceInfo.value
          ? store.callServicesInfo
          : store.callServicesReport;
        const keys = isServiceInfo.value
          ? ["NEW", "PENDING", "TEMPOARY CLOSED", "CLOSED"]
          : [
              "Breakdown repair",
              "PVM# Preventive Maintenance",
              "PRC# Pre-Commissioning",
              "IAC# Installation and Commissioning",
              "NEW",
              "RET# Retro Fitment",
              "TEMPOARY CLOSED",
              "GWL# Good Will",
              "VIS# Visit",
            ];

        const res = await updateMethod(da.value);
        keys.forEach((key, index) => {
          if (listData.value[index]) {
            listData.value[index].count = res[key] || 0;
          }
        });
        Loading.hide();
      } catch (err) {
        
        console.error(err);
      }
    };

    watch(fromDate, (newVal) => {
      console.log(newVal);
      const parsedDate = date.extractDate(newVal, "DD/MM/YYYY");
      min.value = date.formatDate(parsedDate, "YYYY/MM");
      console.log(min.value);
      max.value = date.formatDate(
        date.addToDate(parsedDate, { months: 2 }),
        "YYYY/MM"
      );
      da.value.fromDate = newVal;
      // updateCounts();
    });

    watch(toDate, (newVal) => {
      da.value.toDate = newVal;
      // updateCounts();
    });

    onMounted(() => {
      updateCounts();
    });

    const onFromDateSelected = (newDate) => {
      fromDate.value = date.formatDate(newDate, "DD/MM/YYYY");
      showFromDatePopup.value = false;
    };

    const onToDateSelected = (newDate) => {
      toDate.value = date.formatDate(newDate, "DD/MM/YYYY");
      showToDatePopup.value = false;
    };

    return {
      $q,
      service,
      store,
      min,
      max,
      listData,
      fromDateRaw,
      toDateRaw,
      showFromDatePopup,
      showToDatePopup,
      fromDate,
      toDate,
      onFromDateSelected,
      onToDateSelected,
      updateCounts,
      route,
    };
  },
  methods: {
    async listNav(data) {
      const obj = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        type: data.type,
      };
      if (data.count > 0) {
        try {
          const res = await this.store.fetchServiceInfo(obj);
          console.log(res);
          if (res != null) {
            this.route.push({
              name: "serviceList",
              params: { type: data.type },
            });
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        this.$q.notify({
          color: "red",
          position: "top",
          message: "No data is available",
          icon: "cancel",
        });
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
