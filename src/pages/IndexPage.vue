<template>
  <q-page class="flex justify-center">
    <div class="avatar-button-wrapper">
      <q-avatar
        size="150px"
        font-size="20px"
        color="primary"
        text-color="white"
        class="q-mb-lg"
        style="margin-top: 15vh"
      >
        <template v-slot:default>
          <div class="avatar-content">
            <div class="text-weight-medium">Total Calls</div>
            <div class="q-mt-md">{{ data?.NewList?.length || 0 }}</div>
          </div>
        </template>
      </q-avatar>
      <template v-for="(button, index) in buttonData" :key="index">
        <q-btn
          push
          unelevated
          color="primary"
          class="q-mt-sm"
          style="width: 90vw"
          @click="navigate(button)"
        >
          <template v-slot:default>
            <q-badge color="orange" floating :label="button.count"></q-badge>
            <q-item-label class="q-pa-sm">{{ button.name }}</q-item-label>
          </template>
        </q-btn>
      </template>
    </div>
  </q-page>
</template>

<script>
import { callService } from "src/stores/callServices.js";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const store = new callService();
    const router = useRouter();
    let data = ref({ NewList: [] });
    let buttonData = ref([
      { name: "Complaint", count: 0, link: "allocationList" },
      { name: "Commissioning", count: 0, link: "allocationList" },
      { name: "Preventive Maintenance", count: 0, link: "allocationList" },
      { name: "Offline", count: 0, link: "allocationList" },
    ]);

    async function fetchServiceList() {
      try {
        let res = await store.getEngServiceList();
        data.value = res;
      } catch (err) {
        console.log(err);
      }
    }

    function updateButtonCounts() {
      if (
        !data.value ||
        !data.value.NewList ||
        !Array.isArray(data.value.NewList)
      ) {
        return; // nothing to update yet
      }

      const counts = data.value.NewList.reduce(
        (acc, item) => {
          if (item.defCategory === "Complaint") {
            acc[0]++;
          } else if (item.defCategory === "Commissioning") {
            acc[1]++;
          } else if (item.defCategory === "Preventive Maintenance") {
            acc[2]++;
          } else {
            acc[3]++;
          }
          return acc;
        },
        [0, 0, 0, 0]
      );

      buttonData.value[0].count = counts[0];
      buttonData.value[1].count = counts[1];
      buttonData.value[2].count = counts[2];
      buttonData.value[3].count = counts[3];
    }

    watch(
      () => data.value.NewList,
      (newVal) => {
        if (Array.isArray(newVal)) {
          updateButtonCounts();
        }
      }
    );
    onMounted(() => {
      fetchServiceList();
    });

    return {
      data,
      buttonData,
      fetchServiceList,
      router,
    };
  },
  methods: {
    navigate(data) {
      console.log(data);
      this.router.push({ name: data.link, params: { type: data.name } });
    },
  },
};
</script>

<style>
.avatar-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
