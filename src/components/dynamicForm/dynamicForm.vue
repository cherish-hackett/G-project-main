<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header with custom component -->
    <q-header>
      <barHeader message="Offline Data" />
    </q-header>

    <q-page-container>
      <!-- Dynamic Tabs -->
      <q-tabs
        v-model="selectedTab"
        @change="handleTabChange"
        inline-label
        :mobile-arrows="false"
        :outside-arrows="false"
      >
        <!-- Render one tab per FSR detail -->
        <q-tab
          v-for="(tab, index) in formData.FSRdetails"
          :key="index"
          :name="tab.tabId"
        >
          {{ tab.tabName }}
        </q-tab>
      </q-tabs>

      <!-- Tab Panels -->
      <q-tab-panels v-model="selectedTab">
        <q-tab-panel
          v-for="(tab, index) in formData.FSRdetails"
          :key="index"
          :name="tab.tabId"
        >
          <!-- Render form fields dynamically -->
          <div
            v-for="field in tab.fsrFieldDetList"
            :key="field.fieldId"
            class="q-mb-md"
          >
            <!-- IMAGE Field Handling -->
            <template v-if="field.fieldType === 'IMAGE'">
              <q-input
                :label="field.fieldName"
                outlined
                dense
                readonly
                v-model="field.fieldValue"
              />
              <!-- Image Upload Input -->
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
              <!-- Image Preview -->
              <img
                v-if="field.fieldLength"
                :src="field.fieldLength"
                alt="Image Preview"
                class="image-preview"
              />
            </template>

            <!-- All Other Field Types -->
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

      <!-- Submit Button -->
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

const AUTO_SAVE_INTERVAL = import.meta.AUTO_SAVE_INTERVAL; // Default to 2 min if not set
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
    // Pinia store instance
    const store = new callService();
    return { store };
  },

  // data() {
  //   return {
  //     selectedTab: "COMPREQ", // Default selected tab
  //     formData: { FSRdetails: [] }, // Main form object (dynamic fields)
  //     saveInterval: null, // Interval handler for auto-save
  //   };
  // },

  data() {
    return {
      selectedTab: "COMPREQ",
      formData: {
        Message: localStorage.getItem("message") || `msg_${Date.now()}`,
        FSRdetails: [],
      },
      saveInterval: null,
    };
  },

  // --------- LIFECYCLE HOOKS ---------
  // async created() {
  //   // Load saved form data from IndexedDB (if exists)
  //   const form = await getForm(localStorage.getItem("message"));
  //   if (form) {
  //     this.formData = form;
  //   }
  //   await this.initializeFormData();

  //   // Start auto-save timer (every 2 min)
  //   this.startAutoSave();
  // },

  async created() {
    let messageKey = localStorage.getItem("message");

    if (!messageKey) {
      messageKey = `msg_${Date.now()}`;
      localStorage.setItem("message", messageKey);
    }

    const form = await getForm(messageKey);
    if (form) {
      this.formData = form;
    } else {
      this.formData.Message = messageKey; // ensure it's set
    }

    await this.initializeFormData();
    this.startAutoSave();
  },

  beforeUnmount() {
    // Stop auto-save on component destroy
    this.stopAutoSave();
  },

  async mounted() {
    // Load saved images from IndexedDB for each field
    if (this.formData && Array.isArray(this.formData.FSRdetails)) {
      for (let tab of this.formData.FSRdetails) {
        for (let field of tab.fsrFieldDetList) {
          if (field.fieldType === "IMAGE") {
            await this.loadImageFromIndexedDB(field.fieldId, tab.tabId);
          }
        }
      }
    }
  },

  methods: {
    // --------- FORM INITIALIZATION ---------
    async initializeFormData() {
      const form = await getForm(localStorage.getItem("message"));
      if (form) {
        this.formData = form;
        console.log("Loaded form from DB:", form);
      }
    },

    // --------- AUTO SAVE ---------
    startAutoSave() {
      this.saveInterval = setInterval(this.saveForm, AUTO_SAVE_INTERVAL); // 2 min
    },
    stopAutoSave() {
      if (this.saveInterval) {
        clearInterval(this.saveInterval);
      }
    },
    // async saveForm() {
    //   try {
    //     const existingRecord = await getForm(this.formData.Message);

    //     // Save only if changes detected
    //     if (
    //       existingRecord &&
    //       JSON.stringify(existingRecord) === JSON.stringify(this.formData)
    //     ) {
    //       console.log("No changes detected, skipping save.");
    //       return;
    //     } else {
    //       await updateForm(JSON.stringify(this.formData));
    //       console.log("Form data saved automatically");
    //     }
    //   } catch (error) {
    //     console.error("Error saving form data:", error);
    //   }
    // },

    async saveForm() {
      try {
        if (!this.formData.Message) {
          this.formData.Message =
            localStorage.getItem("message") || `msg_${Date.now()}`;
          localStorage.setItem("message", this.formData.Message);
        }

        const existingRecord = await getForm(this.formData.Message);

        if (
          existingRecord &&
          JSON.stringify(existingRecord) === JSON.stringify(this.formData)
        ) {
          console.log("No changes detected, skipping save.");
          return;
        } else {
          await updateForm(JSON.stringify(this.formData));
          console.log("Form data saved automatically");
        }
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    },

    // --------- FORM SUBMISSION ---------
    async submitForm() {
      this.stopAutoSave();
      try {
        // Save form before submitting
        await updateForm(JSON.stringify(this.formData));

        // Get all saved images from IndexedDB
        let img = await getImages();
        console.log("Images from IndexedDB:", img);

        for (let index = 0; index < img.length; index++) {
          const formData = new FormData();
          formData.append("file", img[index].file);
          formData.append("docID", this.formData.requestNO);
          formData.append("fieldInd", img[index].fieldInd);
          formData.append("defectType", this.formData.defectType);
          formData.append("requestNO", this.formData.requestNO);
          formData.append("fieldName", img[index].field);
          formData.append("fieldType", "IMAGE");
          formData.append("tabId", img[index].tabId);

          console.log("FormData for Image:", formData);

          // Upload image via store
          this.store.UploadImage(formData);
        }

        console.log("Form submitted successfully");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    // --------- FIELD COMPONENT MAPPER ---------
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
          return "q-input"; // still using input for IMAGE field
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

    // --------- EVENT HANDLERS ---------
    async handleTabChange() {
      // Save form when user switches tab
      await this.saveForm();
    },

    // Handle Image Upload from file input
    async handleImageUpload(event, fieldId, tabId, fieldIndex, tabIndex) {
      console.log("Uploading image for:", fieldId, tabId);
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target.result;
          const form = await getForm(this.formData.Message);

          if (form) {
            // Save image data (base64 + file name) in formData
            form.FSRdetails[tabIndex - 1].fsrFieldDetList[
              fieldIndex
            ].fieldLength = base64String;
            form.FSRdetails[tabIndex - 1].fsrFieldDetList[
              fieldIndex
            ].fieldValue = file.name;
            this.formData = form;
            console.log("Updated form with image:", form);
          }

          // Store file in IndexedDB for offline persistence
          await addImage(file, fieldId, fieldIndex, tabId, file.name);
        };
        reader.readAsDataURL(file);
      }
    },

    // Load image file from IndexedDB and display
    async loadImageFromIndexedDB(indexid, tabid) {
      const imageRecord = await getImage(indexid, tabid);
      if (imageRecord && imageRecord.file) {
        const reader = new FileReader();
        reader.readAsDataURL(imageRecord.file);
      }
    },
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
