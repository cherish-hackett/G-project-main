<template>
    <q-layout>
        <q-header>
            <barHeader :message="title" />
        </q-header>
        <q-page-container>
            <q-card class="q-pa-md">
                <q-list dense>
                    <q-item>
                        <q-item-section class="text-weight-bold" top>Request No :</q-item-section>
                        <q-item-section top>{{ cardData.serRequestNO }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Service Order No:</q-item-section>
                        <q-item-section top>{{ cardData.serOrderNO }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">ESN/GSN</q-item-section>
                        <q-item-section top>{{ cardData.esn }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section class="text-weight-bold label-section">Equip Desc:</q-item-section>
                        <q-item-section class="value-section text-wrap">
                            <q-item-label>{{ cardData.equipDesc }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">HMR</q-item-section>
                        <q-item-section top>{{ cardData.hmr }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">APB/IEB :</q-item-section>
                        <q-item-section top>{{ cardData.apb }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">VOC :</q-item-section>
                        <q-item-section top>{{ cardData.voc }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Customer Name :</q-item-section>
                        <q-item-section top>{{ cardData.custname }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Customer Mobile No :</q-item-section>
                        <q-item-section top>{{ cardData.custMob }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Customer Loc :</q-item-section>
                        <q-item-section top>{{ cardData.custLoc }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Doc :</q-item-section>
                        <q-item-section top>{{ cardData.doc }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Call Status :</q-item-section>
                        <q-item-section top>{{ cardData.callStat }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Request Type :</q-item-section>
                        <q-item-section top>{{ cardData.reqType }}</q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section top class="text-weight-bold">Created On :</q-item-section>
                        <q-item-section top>{{ dateFormate(cardData.createdON) }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Created By :</q-item-section>
                        <q-item-section top>{{ cardData.createdBY }}</q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section top class="text-weight-bold">AMC/NON-AMC :</q-item-section>
                        <q-item-section top>{{ cardData.amc }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top class="text-weight-bold">Warranty Status :</q-item-section>
                        <q-item-section top>{{ cardData.warrantyStat }}</q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section top class="text-weight-bold">Call Ageing :</q-item-section>
                        <q-item-section top>{{ cardData.serRequestNO }}</q-item-section>
                    </q-item>



                </q-list>

            </q-card>
        </q-page-container>
    </q-layout>
</template>

<script>
import { componentData } from 'src/stores/componentData';
import { callList } from 'src/stores/callList';
import { useRoute } from 'vue-router';
import { date,useQuasar } from 'quasar';
import barHeader from '../SubCom/barHeader.vue';
import { ref } from 'vue';
import { route } from 'quasar/wrappers';


export default {
    components: {
        barHeader
    },
    setup() {
        const route = useRoute();
        const $q = useQuasar()
        const serviceEng = ref('');
        const serviceEngList = ref([]);
        const store = componentData();
        const cardData = store.getComponentDataObj;
        const title = route.params.message;
        const formatDate = (data) => {
            return date.formatDate(data, 'ddd, MMMM Do, YYYY');
        };
        return {
            $q,
            title,
            serviceEng,
            serviceEngList,
            cardData,
            formatDate
        };
    },
    methods: {
        dateFormate(data) {
            return date.formatDate(data, 'ddd,MMMM Do,YYYY');
        },
    }
};
</script>

<style>
.q-list--dense>.q-item,
.q-item--dense {
    min-height: 23px;
    padding: 0px 0px;
}

.label-section {
    flex: 1;
    text-align: left;
}

.value-section {
    flex: 2;
    text-align: left;
    white-space: normal;
    /* Ensure text wraps */
    word-wrap: break-word;
    /* Ensure long words break correctly */
}

.q-card {
    overflow: hidden;
}

.q-item-label {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
}

@media (max-width: 600px) {
    .label-section {
        text-align: left;
        padding-right: 10px;
    }

    .value-section {
        text-align: left;
        padding-left: 10px;
    }
}
</style>
