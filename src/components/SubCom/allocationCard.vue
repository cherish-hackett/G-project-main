<template>
  <q-layout>
    <q-header>
      <barHeader message="Call Allocation" />
    </q-header>
    <q-page-container>
      <q-card class="q-pa-md">
        <q-list dense>
          <q-item>
            <q-item-section class="text-weight-bold" top
              >Request No :</q-item-section
            >
            <q-item-section top>{{ cardData.serRequestNO }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Service Order No:</q-item-section
            >
            <q-item-section top>{{ cardData.serOrderNO }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >ESN/GSN</q-item-section
            >
            <q-item-section top>{{ cardData.esn }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-weight-bold label-section"
              >Equip Desc:</q-item-section
            >
            <q-item-section class="value-section text-wrap">
              <q-item-label>{{ cardData.equipDesc }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold">HMR</q-item-section>
            <q-item-section top>{{ cardData.hmr }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >APB/IEB :</q-item-section
            >
            <q-item-section top>{{ cardData.apb }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold">VOC :</q-item-section>
            <q-item-section top>{{ cardData.voc }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Customer Name :</q-item-section
            >
            <q-item-section top>{{ cardData.custname }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Customer Mobile No :</q-item-section
            >
            <q-item-section top>{{ cardData.custMob }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Customer Loc :</q-item-section
            >
            <q-item-section top>{{ cardData.custLoc }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold">Doc :</q-item-section>
            <q-item-section top>{{ cardData.doc }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Call Status :</q-item-section
            >
            <q-item-section top>{{ cardData.callStat }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Request Type :</q-item-section
            >
            <q-item-section top>{{ cardData.reqType }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section top class="text-weight-bold"
              >Created On :</q-item-section
            >
            <q-item-section top>{{
              dateFormate(cardData.createdON)
            }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Created By :</q-item-section
            >
            <q-item-section top>{{ cardData.createdBY }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section top class="text-weight-bold"
              >AMC/NON-AMC :</q-item-section
            >
            <q-item-section top>{{ cardData.amc }}</q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="text-weight-bold"
              >Warranty Status :</q-item-section
            >
            <q-item-section top>{{ cardData.warrantyStat }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section top class="text-weight-bold"
              >Call Ageing :</q-item-section
            >
            <q-item-section top>{{ cardData.serRequestNO }}</q-item-section>
          </q-item>
        </q-list>

        <q-card-actions class="justify-space" v-if="buttonShow">
          <template v-if="role === 'API_SERVENGG'">
            <q-btn class="bg-green text-white" @click="serEng('A')"
              >Approve</q-btn
            >
            <q-space />
            <q-btn class="bg-red text-white" @click="serEng('R')">Reject</q-btn>
          </template>
          <template v-else>
            <q-btn
              class="bg-green text-white"
              @click="assignData(cardData.reqType)"
              >Assign</q-btn
            >
            <q-space />
            <q-btn class="bg-red text-white" @click="test">Reject</q-btn>
          </template>
        </q-card-actions>
      </q-card>
      <q-dialog v-model="popup" persistent>
        <template v-if="role === 'API_SERVENGG'">
          <template v-if="status == 'A'">
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Select Time</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input filled v-model="selectedDateAndTime">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="selectedDateAndTime"
                          mask="YYYY-MM-DD HH:mm:ss"
                          :options="dateOptions"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="selectedDateAndTime"
                          mask="YYYY-MM-DD HH:mm:ss"
                          format24h
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn
                  flat
                  label="Go"
                  @click="serviceReqAccept(cardData)"
                />
              </q-card-actions> </q-card
          ></template>
          <template v-else>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Enter the Reason</div>
              </q-card-section>
              <q-card-section >

                  <q-input v-model="reason" filled type="textarea" label="Enter the Reason" />

              </q-card-section>
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn
                  flat
                  label="Submit"
                  @click="serviceReqAccept(cardData.serRequestNO)"
                />
              </q-card-actions>
            </q-card>
          </template>
        </template>
        <template v-else>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Select Engineer</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-select
                filled
                v-model="serviceEng"
                :options="serviceEngList"
                option-value="servEngg"
                option-label="servEnggName"
                label="Engineers"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Assign"
                @click="assignEngineer(cardData.serRequestNO)"
              />
            </q-card-actions>
          </q-card>
        </template>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { componentData } from "src/stores/componentData";
import { callList } from "src/stores/callList";
import { callService } from "src/stores/callServices";
import { date, useQuasar } from "quasar";
import barHeader from "./barHeader.vue";
import { ref, onMounted, watch, computed } from "vue";
import { date as dateUtils } from "quasar";
export default {
  components: {
    barHeader,
  },
  setup() {
    const selectedDateAndTime = ref(
      dateUtils.formatDate(new Date(), "YYYY-MM-DD HH:MM")
    );
    const buttonShow = ref(true);
    const $q = useQuasar();
    const popup = ref(false);
    const serviceEng = ref("");
    const serviceEngList = ref([]);
    const store = componentData();
    const store1 = callList();
    const store2 = callService();
    const cardData = store.getComponentDataObj;

    const formatDate = (data) => {
      return date.formatDate(data, "ddd, MMMM Do, YYYY");
    };


    const assignData = (type) => {
      let obj = {
        userId: "DEALERPER",
        type: type,
      };
      store1
        .getSerEng(obj)
        .then((res) => {
          console.log(res);
          serviceEngList.value = res["SERVICE ENGG"];
          popup.value = true;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const assignEngineer = () => {
      let obj = {
        servEngg: serviceEng.value.servEngg,
        requestNO: cardData.serRequestNO,
      };
      store1
        .postSerEng(obj)
        .then((res) => {
          if (res == "Issue while assigning documents to Service Engineer") {
            $q.notify({
              color: "red",
              position: "top",
              message: `Unsuccessful assignment`,
              icon: "task_alt",
            });
          } else {
            $q.notify({
              color: "green",
              position: "top",
              message: res,
              icon: "task_alt",
            });
            buttonShow.value = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      popup.value = false;
    };

    const getRole = () => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.userRole;
      }
    };
    const role = ref("");
    const todayDate = computed(() => {
      return dateUtils.formatDate(new Date(), "YYYY/MM/DD");
    });

    const dateOptions = computed(() => {
      return (date) => date >= todayDate.value;
    });
    onMounted(() => {
      role.value = getRole();
      console.log(role.value);
    });

    return {
      $q,
      buttonShow,
      popup,
      dateOptions,
      serviceEng,
      serviceEngList,
      cardData,
      formatDate,
      assignData,
      assignEngineer,
      selectedDateAndTime,
      role,
      store2
    };
  },
  data() {
    return {
      status: "",
      reason:""
    };
  },
  methods: {
  async  serviceReqAccept (req) {
      let obj = {
        status: this.status,
        comments: "",
        reqNO: req.serRequestNO,
        rejReason: this.reason,
        expectedArr: dateUtils.formatDate(
          new Date(this.selectedDateAndTime),
          "YYYY-MM-DD HH:MM:SS"
        ),
      };
    let res = await this.store2.actOnRequest(obj)
    localStorage.setItem('cardData', JSON.stringify(req));
      this.popup = false;
    },
    dateFormate(data) {
      return date.formatDate(data, "ddd,MMMM Do,YYYY");
    },
    serEng(sta) {
      this.popup = true;
      console.log(sta);
      this.status = sta;
    },
    test() {
      this.$q.notify({
        message: "Jim pinged you.",
        color: "purple",
        badgeColor: "yellow",
        badgeTextColor: "dark",
        badgeClass: "shadow-3 glossy my-badge-class",
      });
    },
  },
};
</script>

<style>
.q-list--dense > .q-item,
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
  word-wrap: break-word;
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
