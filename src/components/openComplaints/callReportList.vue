<template>
    <q-layout>
        <q-header >
            <q-bar class="bg-grey-2 text-grey-9 q-pa-lg">
                <q-btn dense flat icon="arrow_back_ios" @click="back" />
                <q-space />
                <div class="text-weight-bold justify-center q-mr-lg">
                    <template v-if="!searchActive">
                        {{ bartitle }}
                    </template>
                    <template v-else>
                        <q-input dense v-model="searchQuery" placeholder="Search..." @blur="searchActive = true"
                            @change="performSearch" />
                    </template>
                </div>
                <q-space />
                <q-btn dense flat icon="search" @click="toggleSearch" />
                <q-btn flat round dense icon="filter_list" @click="dialog = true" label="Filter" class="q-ml-sm" />
            </q-bar>
        </q-header>

        <q-page-container>
            <q-item clickable v-for="(data, index) in filteredList" :key="index" @click="navigate(data)">
                <q-item-section avatar top>
                    <q-avatar class="bg-primary text-white">{{ avt }}</q-avatar>
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium">Request NO:</span>
                        <span class="text-grey-8">{{ data.serRequestNO }}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">
                        Service NO: {{ data.serOrderNO }}
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-dialog v-model="dialog" persistent :maximized="maximizedToggle" transition-show="slide-up"
                transition-hide="slide-down">
                <q-card>
                    <q-bar class="bg-primary text-white q-pa-lg">
                        <q-btn @click="applyFilter" dense flat icon="check">
                            <q-tooltip class="bg-white text-green">Apply</q-tooltip>
                        </q-btn>
                        <q-space />
                        <q-btn dense flat icon="close" v-close-popup>
                            <q-tooltip class="bg-white text-red">Close</q-tooltip>
                        </q-btn>
                    </q-bar>

                    <q-card-section>
                        <q-input v-model="fromDate" label="Select From Date" readonly clearable
                            @click="showFromDatePopup = true">
                            <template v-slot:prepend>
                                <q-icon name="calendar_month" color="blue" />
                            </template>
                        </q-input>

                        <q-popup-proxy v-model="showFromDatePopup" transition-show="scale" transition-hide="scale">
                            <q-date v-model="fromDateRaw" @update:model-value="onFromDateSelected" mask="YYYY-MM-DD" />
                        </q-popup-proxy>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input v-model="toDate" label="Select To Date" readonly clearable
                            @click="showToDatePopup = true">
                            <template v-slot:prepend>
                                <q-icon name="calendar_month" color="blue"/>
                            </template>
                        </q-input>

                        <q-popup-proxy v-model="showToDatePopup" transition-show="scale" transition-hide="scale">
                            <q-date v-model="toDateRaw" @update:model-value="onToDateSelected" mask="YYYY-MM-DD" />
                        </q-popup-proxy>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </q-page-container>
    </q-layout>
</template>

<script>
import { computed, ref, nextTick, watch } from 'vue'; // Import necessary functions
import { useRoute, useRouter } from 'vue-router';
import { callList } from 'src/stores/callList';
import { componentData } from 'src/stores/componentData';
import { date } from 'quasar';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const store = callList();
        const setDataStore = componentData();
        const type = route.params.type;
        console.log(type);

        const bartitle = ref('');
        const avt = ref('');
        const searchQuery = ref('');
        const searchActive = ref(false);
        const dialog = ref(false);
        const maximizedToggle = ref(true);

        const fromDateRaw = ref(date.subtractFromDate(new Date(), { months: 3 }));
        const toDateRaw = ref(new Date());
        const fromDate = ref(date.formatDate(fromDateRaw.value, 'DD/MM/YYYY'));
        const toDate = ref(date.formatDate(toDateRaw.value, 'DD/MM/YYYY'));
        const showFromDatePopup = ref(false);
        const showToDatePopup = ref(false);

        watch(() => type, (newType) => {
            if (newType === 'N') {
                bartitle.value = 'Not Assigned';
                avt.value = 'N';
            } else if (newType === 'A') {
                bartitle.value = 'Assigned To Technician';
                avt.value = 'A';
            } else if (newType === 'J') {
                bartitle.value = 'Technician on Job';
                avt.value = 'J';
            } else if (newType === 'S') {
                bartitle.value = 'Accepted by Technician';
                avt.value = 'S';
            } else {
                bartitle.value = '';
                avt.value = '';
            }
        }, { immediate: true });

        const list = ref([]);

        const fetchData = async () => {
            try {
                const final = {
                    userId: "DEALERPER",
                    fromDate: date.formatDate(fromDateRaw.value, 'YYYY-MM-DD'),
                    toDate: date.formatDate(toDateRaw.value, 'YYYY-MM-DD'),
                    type: type
                };
                const res = await store.callReportData(final);
                console.log(bartitle.value);
                list.value = res[bartitle.value];
            } catch (err) {
                console.log(err);
            }
        };

        watch([fromDateRaw, toDateRaw, type], fetchData, { immediate: true });

        const filteredList = computed(() => {
            if (!searchActive.value) {
                return list.value;
            }
            const searchTerm = searchQuery.value.toLowerCase();
            return list.value.filter(item =>
                Object.values(item).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm)
                )
            );
        });

        const back = () => {
            router.go(-1);
        };

        const onFromDateSelected = (dateValue) => {
            fromDate.value = date.formatDate(dateValue, 'DD/MM/YYYY');
            fromDateRaw.value = dateValue;
            showFromDatePopup.value = false;
        };

        const onToDateSelected = (dateValue) => {
            toDate.value = date.formatDate(dateValue, 'DD/MM/YYYY');
            toDateRaw.value = dateValue;
            showToDatePopup.value = false;
        };

        const applyFilter = () => {
            dialog.value = false;
            fetchData();
        };

        return {
            avt,
            bartitle,
            type,
            list,
            filteredList,
            setDataStore,
            dialog,
            maximizedToggle,
            router,
            fromDate,
            toDate,
            showFromDatePopup,
            showToDatePopup,
            back,
            searchQuery,
            searchActive,
            onFromDateSelected,
            onToDateSelected,
            applyFilter,
            toggleSearch() {
                searchActive.value = !searchActive.value;
                if (searchActive.value) {
                    nextTick(() => {
                        document.querySelector('input[type="text"]').focus();
                    });
                }
            }
        };
    },
    methods:{
        navigate(data) {
      this.setDataStore.setComponentDataObj(data);
      this.router.push({ name: 'seviceCard' ,params:{ message : "call Report"} }); 
    },
    }
};
</script>