import { defineStore } from 'pinia';

export const componentData = defineStore('componentData', {
  state: () => ({
    detailes: {},
  }),
  actions: {
    setComponentDataObj(data) {
      console.log(data);
      return this.detailes = data;
    },
  },
  getters: {
    getComponentDataObj(){
      
      return this.detailes ;
    }
  }
});
