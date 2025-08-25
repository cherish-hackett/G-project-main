<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <barHeader message="Offline Data" />
    </q-header>
    <q-page-container>
      <q-tabs
        v-model="selectedTab"
        @change="handleTabChange"
        inline-label
        mobile-arrows="false"
        outside-arrows="false"
      >
        <q-tab
          v-for="(tab, index) in formData.FSRdetails"
          :key="index"
          :name="tab.tabId"
        >
          {{ tab.tabName }}
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="selectedTab">
        <q-tab-panel
          v-for="(tab, index) in formData.FSRdetails"
          :key="index"
          :name="tab.tabId"
        >
          <div
            v-for="field in tab.fsrFieldDetList"
            :key="field.fieldId"
            class="q-mb-md"
          >
            <template v-if="field.fieldType === 'IMAGE'">
              <q-input
                :label="field.fieldName"
                outlined
                dense
                readonly
                v-model="field.fieldValue"
              />
              <input
                type="file"
                @change="
                  handleImageUpload(
                    $event,
                    field.fieldId,
                    tab.tabId,
                    field.fieldIndex,
                    tab.tabIndex
                  )
                "
              />
              <img
                v-if="field.fieldLength"
                :src="field.fieldLength"
                alt="Image Preview"
                class="image-preview"
              />
            </template>
            <component
              v-else
              :is="getComponentType(field.fieldType)"
              v-model="field.fieldValue"
              :label="field.fieldName"
              :type="getFieldType(field.fieldType)"
              :options="
                field.fieldType === 'SELECT'
                  ? field.fieldOptions.split(',').map((option) => option.trim())
                  : []
              "
              :readonly="field.isfieldEditable === 'F'"
              outlined
              dense
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-btn type="submit" label="Submit" color="primary" @click="submitForm" />
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  QTabs,
  QTab,
  QTabPanels,
  QTabPanel,
  QBtn,
  QInput,
  QSelect,
} from "quasar";
import { getForm, updateForm, addForm } from "./indexDBService";
import {
  deleteImage,
  updateImage,
  getImages,
  addImage,
  getImage,
} from "./imageDB.js";
import { callService } from "src/stores/callServices";
import barHeader from "src/components/SubCom/barHeader.vue";
export default {
  components: {
    QTabs,
    QTab,
    QTabPanels,
    QTabPanel,
    QBtn,
    QInput,
    QSelect,
    barHeader,
  },
  setup() {
    const store = new callService();
    return {
      store,
    };
  },
  data() {
    return {
      selectedTab: "COMPREQ",
      formData: Object,
      saveInterval: null,
    };
  },
  async created() {
    await this.initializeFormData();
    this.startAutoSave();
  },
  beforeUnmount() {
    this.stopAutoSave();
  },
  methods: {
    async initializeFormData() {
      const form = await getForm(localStorage.getItem("message"));
      if (form) {
        this.formData = form;
        console.log(form);
      }
    },
    startAutoSave() {
      this.saveInterval = setInterval(this.saveForm, 120000);
    },
    stopAutoSave() {
      if (this.saveInterval) {
        clearInterval(this.saveInterval);
      }
    },
    async saveForm() {
      try {
        const existingRecord = await getForm(this.formData.Message);
        if (
          existingRecord &&
          JSON.stringify(existingRecord) === JSON.stringify(this.formData)
        ) {
          console.log("No changes detected, skipping save.");
          return;
        } else {
          await updateForm(JSON.stringify(this.formData)); // Update the form data without key parameter
          console.log("Form data saved automatically");
        }
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    },
    async submitForm() {
      this.stopAutoSave();
      try {
        await updateForm(JSON.stringify(this.formData));
        let img = await getImages();
        console.log("vsdnbsdv", img);

        for (let index = 0; index < img.length; index++) {
          const form = new FormData();
          form.append("file", img[index].file);
          form.append("docID", this.formData.requestNO);
          form.append("fieldInd", img[index].fieldInd);
          form.append("defectType", this.formData.defectType);
          form.append("requestNO", this.formData.requestNO);
          form.append("fieldName", img[index].field);
          form.append("fieldType", "IMAGE");
          form.append("tabId", img[index].tabId);
          console.log("FormData for Image:", formData);
      //             for (let pair of formData.entries()) {
      //   console.log(pair[0] + ':', pair[1]);
      // }
          this.store.UploadImage(formData);
        }
        console.log("Form submitted successfully");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    getComponentType(fieldType) {
      switch (fieldType) {
        case "TEXT":
        case "NUMBER":
        case "EMAIL":
        case "TEXTAREA":
          return "q-input";
        case "SELECT":
          return "q-select";
        case "IMAGE":
          return "q-input";
        default:
          return "q-input";
      }
    },
    getFieldType(fieldType) {
      switch (fieldType) {
        case "NUMBER":
          return "number";
        case "EMAIL":
          return "email";
        case "TEXTAREA":
          return "textarea";
        case "IMAGE":
          return "file";
        default:
          return "text";
      }
    },
    async handleTabChange() {
      // localStorage.getItem('cardData');
      await this.saveForm();
    },
    async handleImageUpload(event, fieldId, tabId, fieldIndex, tabIndex) {
      console.log(fieldId, tabId);
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target.result;
          const form = await getForm(this.formData.Message);
          if (form) {
            form.FSRdetails[tabIndex - 1].fsrFieldDetList[
              fieldIndex
            ].fieldLength = base64String;
            form.FSRdetails[tabIndex - 1].fsrFieldDetList[
              fieldIndex
            ].fieldValue = file.name;
            this.formData = form;
            console.log(form);
          }
          await addImage(file, fieldId, fieldIndex, tabId, file.name);
        };
        reader.readAsDataURL(file);
      }
    },
    async loadImageFromIndexedDB(indexid, tabid) {
      const imageRecord = await getImage(indexid, tabid);
      if (imageRecord && imageRecord.file) {
        const reader = new FileReader();
        reader.readAsDataURL(imageRecord.file);
      }
    },
  },
  async mounted() {
    for (let tab of this.formData.FSRdetails) {
      for (let field of tab.fsrFieldDetList) {
        if (field.fieldType === "IMAGE") {
          await this.loadImageFromIndexedDB(field.fieldId, tab.tabId);
        }
      }
    }
  },
};
</script>

<style scoped>
.q-page {
  padding: 20px;
}
.image-preview {
  margin-top: 10px;
  max-width: 100%;
  height: auto;
}
</style>
