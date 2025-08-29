import { defineStore } from "pinia";
import { api } from "src/boot/axios"; // Axios instance (configured globally)
import { addForm } from "src/components/dynamicForm/indexDBService"; // IndexedDB utility for storing forms locally

// Define Pinia store: callService
export const callService = defineStore("callService", {
  // --------- STATE (reactive data store) ---------
  state: () => ({
    callServiceInfo: {}, // Stores detailed info about a particular service
    callServicereport: {}, // Stores service report data (like counts/statistics)
    serviceList: [], // Stores list of services assigned to engineer/dealer
  }),

  // --------- ACTIONS (async operations / API calls) ---------
  actions: {
    /**
     * Fetch list of services assigned to a Service Engineer.
     * API: /auth/css/serviceEngg/getServiceList
     */
    async getEngServiceList() {
      let obj = {
        dealer: "",
        servEngg: "",
        requestNO: "",
        servEnggName: "",
      };
      let res = await api.post("/auth/css/serviceEngg/getServiceList", obj);
      try {
        console.log("services list: ", res.data);
        this.serviceList = await res.data; // Update state with response
        return this.serviceList;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    /**
     * Fetch service info details for a dealer.
     * API: /auth/css/dealer/getServiceInfo
     */
    async callServicesInfo(data) {
      let res = await api.post("/auth/css/dealer/getServiceInfo", data);
      try {
        console.log("service info details: ", res.data);
        this.callServiceInfo = res.data; // Store service info in state
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    /**
     * Fetch service report based on defect type (counts/statistics).
     * API: /auth/css/dealer/getCountByDefType
     */
    async callServicesReport(data) {
      let res = await api.post("/auth/css/dealer/getCountByDefType", data);
      try {
        console.log(res.data);
        this.callServicereport = res.data; // Store report in state
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    /**
     * Fetch detailed service info (extended details).
     * API: /auth/css/dealer/getServiceInfoDet
     */
    async fetchServiceInfo(data) {
      let res = await api.post("/auth/css/dealer/getServiceInfoDet", data);
      try {
        console.log(res.data);
        // NOTE: Not saving in state, just returning data
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    /**
     * Perform action on a service request (e.g., approve/reject/update).
     * API: /auth/css/serviceEngg/actOnRequest
     * - Stores message in localStorage
     * - Saves data in IndexedDB using addForm()
     */
    async actOnRequest(data) {
      try {
        const res = await api.post("/auth/css/serviceEngg/actOnRequest", data);

        // Save server message in localStorage (for UI alerts later)
        localStorage.setItem("message", res.data.Message);

        console.log(res.data);

        // Save API response locally in IndexedDB
        addForm(JSON.stringify(res.data));

        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    /**
     * Upload an image related to a service.
     * API: /auth/css/fsr/image
     */
    async UploadImage(data) {
      try {
        const res = await api.post("/auth/css/fsr/image", data);
        console.log("img upload", res);
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },

  // --------- GETTERS (read-only computed data from state) ---------
  getters: {
    // Get list of services
    getserviceList() {
      return this.seviceList;
    },

    // Get detailed service info
    getserviceEngList() {
      return this.callServiceInfo;
    },
  },
});
