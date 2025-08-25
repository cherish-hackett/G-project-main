import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { addForm } from "src/components/dynamicForm/indexDBService";
export const callService = defineStore("callService", {
  state: () => ({
    callServiceInfo: {},
    callServicereport: {},
    seviceList: [],
  }),
  actions: {
    async getEngServiceList() {
      let obj = {
        dealer: "",
        servEngg: "",
        requestNO: "",
        servEnggName: "",
      };
      return api
        .post("/auth/css/serviceEngg/getServiceList", obj)
        .then((res) => {
          console.log(res.data);
          this.callServiceInfo = res.data;
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    callServicesInfo(data) {
      return api
        .post("/auth/css/dealer/getServiceInfo", data)
        .then((res) => {
          console.log(res.data);
          this.callServiceInfo = res.data;
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    callServicesReport(data) {
      return api
        .post("/auth/css/dealer/getCountByDefType", data)
        .then((res) => {
          console.log(res.data);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    fetchServiceInfo(data) {
      return api
        .post("/auth/css/dealer/getServiceInfoDet", data)
        .then((res) => {
          console.log(res.data);
          this.seviceList = res.data["ServiceDetails"];
          return res.data["ServiceDetails"];
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },

    actOnRequest(data) {
      return api
        .post("/auth/css/serviceEngg/actOnRequest", data)
        .then((res) => {
          localStorage.setItem("message", res.data.Message);
          console.log(res.data);

          addForm(JSON.stringify(res.data));
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    UploadImage(data) {
      return api
        .post("/auth/css/fsr/image", data)
        .then((res) => {
          console.log("img upload", res);

          return res.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
  },
  getters: {
    getserviceList() {
      return this.seviceList;
    },
    getserviceEngList() {
      return this.callServiceInfo;
    },
  },
});
