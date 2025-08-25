<template>
  <q-bar class="bg-grey-1 text-grey-9 q-pa-lg">
   <q-btn dense flat icon="arrow_back_ios" @click="back" />
   <q-space />
   <div class="text-weight-bold justify-center q-mr-lg">
    {{message}}
   </div>
   <q-space />
 </q-bar>
</template>
<script>
import { useRouter } from 'vue-router';

export default {
 props:{
message:String
 },
 setup() {
     const router =useRouter();
     return{
         router
     }
 },
 methods:{
     back(){
return this.router.go(-1);
     },
 }
}
</script>