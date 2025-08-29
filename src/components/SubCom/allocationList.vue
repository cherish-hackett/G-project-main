<template>
  <q-layout>
    <q-header>
      <q-bar class="bg-grey-1 text-grey-9 q-pa-lg">
        <q-btn dense flat icon="arrow_back_ios" @click="back" />
        <q-space />
        <div class="text-weight-bold justify-center q-mr-lg">
          <template v-if="!searchActive">
            {{ bartitle }}
          </template>
          <template v-else>
            <q-input
              dense
              v-model="searchQuery"
              placeholder="Search..."
              @blur="searchActive = true"
              @change="performSearch"
            />
          </template>
        </div>
        <q-space />
        <q-btn dense flat icon="search" @click="toggleSearch" />
      </q-bar>
    </q-header>

    <q-page-container>
      <q-item
        clickable
        v-for="(data, index) in filteredList"
        :key="index"
        @click="navigate(data)"
      >
        <q-item-section avatar top>
          <q-avatar class="bg-primary text-white">{{ avt }}</q-avatar>
        </q-item-section>

        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium">Request NO:</span>
            <span class="text-grey-8">{{ data.serRequestNO }}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            ESN : {{ data.serialNO }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, ref, nextTick, watch, onMounted } from "vue"; // Import necessary functions
import { useRoute, useRouter } from "vue-router";
import { callList } from "src/stores/callList";
import { callService } from "src/stores/callServices";
import { componentData } from "src/stores/componentData";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter(); // Use useRouter for navigation
    const store = callList();
    const store2 = callService();
    const setDataStore = componentData();
    const type = route.params.type;
    console.log(type);

    const bartitle = ref("");
    const avt = ref("");
    const searchQuery = ref("");
    const searchActive = ref(false);

    onMounted(async () => {
      await store2.getEngServiceList(); // fetch once on page load
    });

    const list = computed(() => {
      const final = [];
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const newList = store2.serviceList?.NewList ?? [];

        if (userData.userRole === "API_SERVENGG") {
          for (let i = 0; i < newList.length; i++) {
            const service = newList[i];
            if (
              type === "Preventive Maintenance" &&
              service.defCategory === "Preventive Maintenance"
            ) {
              final.push(service);
            } else if (
              type === "Complaint" &&
              service.defCategory === "Complaint"
            ) {
              final.push(service);
            } else if (
              type === "Commissioning" &&
              service.defCategory === "Commissioning"
            ) {
              final.push(service);
            }
          }
        } else {
          const newList = store.getCallList?.ServiceDetails ?? [];
          console.log("call list: " + newList);
          for (let i = 0; i < newList.length; i++) {
            const service = newList[i];
            if (type === "PM" && service.reqType === "PVM") {
              final.push(service);
            } else if (
              type === "CM" &&
              (service.reqType === "PRC" || service.reqType === "IAC")
            ) {
              final.push(service);
            } else if (
              type === "CP" &&
              !["PRC", "IAC", "PVM"].includes(service.reqType)
            ) {
              final.push(service);
            }
          }
        }
      } else {
        console.log("no data found");
      }
      console.log(final);
      return final;
    });

    watch(
      () => type,
      (newType) => {
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          // console.log(store2.getserviceEngList.NewList.length);
          const newList = store2.getserviceEngList?.NewList ?? [];
          console.log(newList);
          if (userData.userRole === "API_SERVENGG") {
            if (newType === "Preventive Maintenance") {
              bartitle.value = "Preventive Maintenance";
              avt.value = "PM";
            } else if (newType === "Commissioning") {
              bartitle.value = "Commissioning";
              avt.value = "CM";
            } else if (newType === "Complaint") {
              bartitle.value = "Complaint";
              avt.value = "CP";
            } else {
              bartitle.value = "";
              avt.value = "";
            }
          } else {
            if (newType === "PM") {
              bartitle.value = "Preventive Maintenance";
              avt.value = "PM";
            } else if (newType === "CM") {
              bartitle.value = "Commissioning";
              avt.value = "CM";
            } else if (newType === "CP") {
              bartitle.value = "Complaint";
              avt.value = "CP";
            } else {
              bartitle.value = "";
              avt.value = "";
            }
          }
        }
      },
      { immediate: true }
    );

    const filteredList = computed(() => {
      console.log(searchActive.value, list.value, "searchActive.value");
      if (!searchActive.value) {
        return list.value;
      }
      const searchTerm = searchQuery.value.toLowerCase();
      console.log(list.value, "list.value");
      return list.value.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm)
        )
      );
    });

    const back = () => {
      router.go(-1);
    };

    return {
      avt,
      bartitle,
      type,
      list,
      filteredList,
      setDataStore,
      router,
      back,
      searchQuery,
      searchActive,
    };
  },
  methods: {
    navigate(data) {
      this.setDataStore.setComponentDataObj(data);
      this.router.push({ name: "card" });
    },
    toggleSearch() {
      this.searchActive = !this.searchActive;
      if (this.searchActive) {
        nextTick(() => {
          document.querySelector('input[type="text"]').focus();
        });
      }
    },
  },
};
</script>
