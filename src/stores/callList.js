import { defineStore } from "pinia";
import { api } from "src/boot/axios"; // Global axios instance

// Define Pinia store: poStore (manages service call allocation & reports)
export const callList = defineStore("poStore", {
  // --------- STATE (reactive data store) ---------
  state: () => ({
    callList: [], // Stores list of open/pending service calls
    callReportObj: {}, // Stores service report data (currently not updated directly here)
    formdata: {}, // Placeholder for form-related data (future use)
  }),

  // --------- ACTIONS (async operations / API calls) ---------
  actions: {
    /**
     * Fetch list of open/pending service call allocations.
     * API: /auth/css/dealer/getOpenPendingListDet
     */
    async fetchCallAllocationList(data) {
      console.log("Request payload:", data);
      try {
        const res = await api.post(
          "/auth/css/dealer/getOpenPendingListDet",
          data
        );
        console.log("Response:", res.data);

        this.callList = res.data; // Save response to state
        return res.data;
      } catch (err) {
        console.error("Error fetching call allocation list:", err);
        throw err;
      }
    },

    /**
     * Fetch call report (bucket-wise summary).
     * API: /auth/css/dealer/getOpenCompBucketWise
     */
    async callReport(data) {
      try {
        const res = await api.post(
          "/auth/css/dealer/getOpenCompBucketWise",
          data
        );
        console.log("Call Report:", res.data);

        // NOTE: Currently not stored in state (directly returned)
        return res.data;
      } catch (err) {
        console.error("Error fetching call report:", err);
        throw err;
      }
    },

    /**
     * Fetch detailed call report (bucket details).
     * API: /auth/css/dealer/getOpenCompBucketDet
     */
    async callReportData(data) {
      try {
        const res = await api.post(
          "/auth/css/dealer/getOpenCompBucketDet",
          data
        );
        console.log("Detailed Call Report:", res.data);

        return res.data;
      } catch (err) {
        console.error("Error fetching detailed call report:", err);
        throw err;
      }
    },

    /**
     * Fetch list of available Service Engineers.
     * API: /auth/css/dealer/getServiceEngglist
     */
    async getSerEng(data) {
      try {
        const res = await api.post("/auth/css/dealer/getServiceEngglist", data);
        console.log("Service Engineer List:", res.data);

        return res.data;
      } catch (err) {
        console.error("Error fetching service engineer list:", err);
        throw err;
      }
    },

    /**
     * Assign a service call to a Service Engineer.
     * API: /auth/css/dealer/assignOpenCalltoSerEngg
     */
    async postSerEng(data) {
      try {
        const res = await api.post(
          "/auth/css/dealer/assignOpenCalltoSerEngg",
          data
        );
        console.log("Assign Call Response:", res.data);

        return res.data;
      } catch (err) {
        console.error("Error assigning call to service engineer:", err);
        throw err;
      }
    },
  },

  // --------- GETTERS (computed values from state) ---------
  getters: {
    /**
     * Get service call list stored in state.
     */
    getCallList() {
      return this.callList;
    },
  },
});
