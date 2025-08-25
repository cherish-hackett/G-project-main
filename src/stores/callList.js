import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const callList = defineStore('poStore', {
  state: () => ({
    callList: [],
    callReportObj: {},
    formdata: {}
  }),
  actions: {
    fetchCallAllocationList(data) {
      console.log(data);
      return api.post('/auth/css/dealer/getOpenPendingListDet', data)
        .then(res => {
          console.log(res.data);
          this.callList = res.data;
          return res.data;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    callReport(data) {
      return api.post('/auth/css/dealer/getOpenCompBucketWise', data)
        .then(res => {
          console.log(res.data);
          // this.callList = res.data;
          return res.data;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    callReportData(data) {
      return api.post('/auth/css/dealer/getOpenCompBucketDet', data)
        .then(res => {
          console.log(res.data);
          // this.callList = res.data;
          return res.data;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    getSerEng(data) {
      return api.post('/auth/css/dealer/getServiceEngglist', data)
        .then(res => {
          console.log(res.data);
          // this.callList = res.data;
          return res.data;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    postSerEng(data) {
      return api.post('/auth/css/dealer/assignOpenCalltoSerEngg', data)
        .then(res => {
          console.log(res.data);
          // this.callList = res.data;
          return res.data;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
   
  },
  getters: {
    getCallList(){
      
      return this.callList ;
    }
  }
});
