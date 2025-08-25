<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="text-weight-medium">
          Dashboard
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list bordered separator>
        <q-item>
          <q-img src="../assets/logo.jpg"></q-img>
        </q-item>
        <q-item
          v-for="item in menu"
          :key="item.label"
          class="text-center"
          style="width: 300px"
          clickable
          :to="item.link !== 'signout' ? `/${item.link}` : undefined"
          tag="router-link"
          bordered
          @click="item.link === 'signout' ? signOut() : null"
        >
          <q-item-section avatar top>
            <q-avatar
              :icon="item.icon"
              color="grey-3"
              text-color="primary"
              bordered
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="arrow_forward_ios" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import MenuLinks from "./MenuLinks.json";
import serviceMenu from "./ServiceMenu.json";
import { useRouter } from "vue-router";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const menu = ref([]);

    const loadMenu = () => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        menu.value =
          userData.userRole === "API_DEALER" ? MenuLinks : serviceMenu;
      }
    };

    loadMenu();

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const signOut = () => {
      localStorage.removeItem("userData");
      router.push({ name: "login" });
    };

    return {
      menu,
      leftDrawerOpen,
      toggleLeftDrawer,
      signOut,
      router,
    };
  },
};
</script>
