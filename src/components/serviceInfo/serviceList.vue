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
        <q-item clickable v-for="(data, index) in filteredList" :key="index" @click="navigate(data)">
          <q-item-section avatar top>
            <q-avatar class="bg-primary text-white">{{ type }}</q-avatar>
          </q-item-section>

          <q-item-section top>
            <q-item-label lines="1">
              <span class="text-weight-medium">Request NO:</span>
              <span class="text-grey-8">{{ data.esn }}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              Service NO: {{ data.serRequestNO }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-page-container>
    </q-layout>
  </template>

  <script>
  import { computed, ref, nextTick, watch } from 'vue'; // Import necessary functions
  import { useRoute, useRouter } from 'vue-router';
  import { callService } from 'src/stores/callServices';
  import { componentData } from 'src/stores/componentData';
  import { Loading } from "quasar";

  export default {
    setup() {
      const route = useRoute();
      const router = useRouter(); // Use useRouter for navigation
      const store = callService();
      const setDataStore = componentData();
      const type = route.params.type;
      const bartitle = ref(localStorage.getItem("status") === true ?"service report":"Service complaint");
      const searchQuery = ref('');
      const searchActive = ref(false);
      let list = store.getserviceList;
      console.log("service list: " + list);

      const filteredList = computed(() => {
        console.log(list);
        if (!searchActive.value) {
          return list;
        }
        const searchTerm = searchQuery.value.toLowerCase();
        return list.filter(item =>
          Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm)
          )
        );
      });

      const back = () => {
        router.go(-1);
      };

      return {
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
        Loading.show();
        this.setDataStore.setComponentDataObj(data);
        this.router.push({ name: 'seviceCard' , params:{message:this.bartitle}});
        Loading.hide();
      },
      toggleSearch() {
        this.searchActive = !this.searchActive;
        if (this.searchActive) {
          nextTick(() => {
            document.querySelector('input[type="text"]').focus();
          });
        }
      }
    }
  };
  </script>
