<template>
     <div class="q-pa-sm">
      <template v-for="(data,index) in cardDat" :key="index">
        <q-card class="my-card  q-ma-sm" @click="navigate(data)">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon :name="data.icon"></q-icon>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{data.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
      </template>
     </div>
</template>
<script>

import { useRoute, useRouter } from 'vue-router';
export default {
    setup() {
        const route = useRouter();
        return{
          route
        }
    },
    data(){
        return{
            cardDat:[
                {
                    icon:'fa-solid fa-phone-volume',
                    name:'CALL ALLOCATION',
                    path:'/home1'
                },
                {
                    icon:'fa-solid fa-arrow-trend-up',
                    name:'OPEN COMPLAINTS REPORT',
                    path:'/callReport'
                },
                {
                    icon:'fa-solid fa-arrow-trend-up',
                    name:'SERVICE INFO REPORT',
                    path:'/service'
                },
                {
                    icon:'fa-regular fa-rectangle-list',
                    name:'SERVICE CALL STATUS BY CALL TYPE',
                    path:'/service'
                },
                {
                    icon:'support_agent',
                    name:'CUSTOMER FEEDBACK',
                    path:''
                }

            ]
        }
    },
    methods:{
        navigate(data){
          if(data.name =="SERVICE INFO REPORT"){
            localStorage.removeItem("status")
            localStorage.setItem("status" , true)
            return this.route.push(data.path)
          }else if (data.name=="SERVICE CALL STATUS BY CALL TYPE"){
            localStorage.removeItem("status")
            localStorage.setItem("status" , false)
            return this.route.push(data.path)
          }else{
            return this.route.push(data.path)
          }
        }
    }
}
</script>