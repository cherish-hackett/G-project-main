<template>
  <q-card class="my-card q-pa-md" flat>
    <img src="../assets/logo1.png" />

    <q-card-section>
      <q-input label="Old password" filled />
      <q-input label="New password" />
      <q-input label="Confirm password" />
      <q-input
        filled
        v-model="pass"
        label="Password"
        :type="visibility ? 'text' : 'password'"
      >
        <template #append>
          <q-icon
            :name="visibility ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="visibility = !visibility"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-action class="fit row wrap justify-center items-start content-start">
    <q-btn>jhbbbh</q-btn>
    </q-card-action>
  </q-card>
</template>
<script>
import { ref } from "vue";
export default {
  setup() {
    const visibility = ref(false);
    return {
      visibility,
    };
  },
  data() {
    return {
      pass: "",
    };
  },
};
</script>
