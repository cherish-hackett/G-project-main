<!-- <template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input filled v-model="formattedDate">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="selectedDate"
              mask="YYYY-MM-DD"
              :options="(date) => date >= '2024/08/01'"
              @input="updateFormattedDate"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time
              v-model="selectedTime"
              mask="HH:mm:ss"
              format24h
              @input="updateFormattedDate"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { date as dateUtils } from "quasar";

export default {
  setup() {
    const selectedDate = ref(dateUtils.formatDate(new Date(), "YYYY-MM-DD"));
    const selectedTime = ref("00:00:00");

    const disablePastDates = (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      const selectedDate = dateUtils.formatDate(new Date(), "YYYY-MM-DD")
      console.log(`Selected Date: ${selectedDate}`);

      // Disable past dates
      return date >= selectedDate;
    };

    return {
      selectedDate,
      selectedTime,
      formattedDate,
      disablePastDates,
      updateFormattedDate,
    };
  },
};
</script> -->

<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input filled v-model="formattedDate">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="formattedDate"
              mask="YYYY-MM-DD HH:MM:SS"
              :options="dateOptions"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time
              v-model="formattedDate"
               mask="YYYY-MM-DD HH:mm:ss"
           
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { date as dateUtils  } from 'quasar';

export default {
  data() {
    return {
      formattedDate: dateUtils.formatDate(new Date(), "YYYY-MM-DD HH:MM:SS")
    };
  },
  computed: {
    todayDate() {
      return dateUtils.formatDate(new Date(), "YYYY/MM/DD");
    },
    dateOptions() {
      return (date) => date >= this.todayDate;
    },
  },
  methods: {
    updateFormattedDate() {
      this.formattedDate = `${this.selectedDate} ${this.selectedTime}`;
    },
  },
};
</script>

