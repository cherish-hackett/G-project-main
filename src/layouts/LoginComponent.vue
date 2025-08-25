<template>
  <div class="flex flex-center">
    <q-card class="q-pa-sm" style="width: 300px; margin-top: 25vh" square flat>
      <q-card-section class="q-pa-none">
        <q-img src="../assets/logo1.png" style="" class="q-pa-none q-ma-none" />
        <q-form ref="form" @submit="onSubmit">
          <q-input
            v-model="user.username"
            label="username"
            required
            class="q-pt-md"
            outlined
          />
          <q-input
            outlined
            v-model="user.password"
            label="Password"
            required
            class="q-pt-md"
            :type="visibility ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="visibility ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="visibility = !visibility"
              />
            </template>
          </q-input>
          <div class="q-pt-md row justify-center">
            <div class="col-6 text-center">
              <q-btn
                label="Login"
                aria-label="Login"
                type="submit"
                color="primary"
              />
            </div>
          </div>
          <div class="q-pt-md q-pb-none row justify-center">
            <div class="col-6 text-center">
              <q-btn
                v-if="showInstallButton"
                label="Install App"
                aria-label="Install App"
                type="button"
                color="secondary"
                @click="installApp"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="showPrompt"
      transition-show="slide-up"
      transition-hide="slide-down"
      position="bottom"
    >
      <q-card class="animated-dialog">
        <q-card-section>
          <div class="q-mt-none">
            To install this app on your iOS device, tap the
            <q-icon name="ios_share" size="lg" color="primary" /> icon at the
            bottom of your screen, then tap <strong>Add to Home Screen</strong>.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { QForm, QInput, QIcon, QBtn, Loading } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.js";
import { useQuasar } from "quasar";
import { isIOS } from "src/boot/pwa-install-prompt.js";
export default defineComponent({
  components: {
    QForm,
    QInput,
    QIcon,
    QBtn,
  },
  data() {
    return {
      user: {
        username: undefined,
        password: undefined,
      },
      showInstallButton: false,
      deferredPrompt: null,
    };
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const authStore = useAuthStore();
    const form = ref(null);
    const visibility = ref(false);

    const showPrompt = ref(false);

    onMounted(() => {
      console.log(isIOS());
      if (isIOS()) {
        showPrompt.value = true;
      }
    });
    return {
      showPrompt,
      form,
      visibility,
      authStore,
      router,
    };
  },
  methods: {
    onSubmit() {
      Loading.show();
      this.authStore.loginWithEmailAndPassword(this.user).then((response) => {
        if (response.isValid) {
          this.$q.notify({
            color: "green",
            position: "top",
            message: `Login successful (${response.firstName})`,
            icon: "task_alt",
          });
          Loading.hide();
          this.router.push("/dashbord");
        } else {
          Loading.hide();
          this.$q.notify({
            color: "red",
            position: "top",
            message: `Invalid credentials`,
          });
        }
      });
    },
    installApp() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          this.deferredPrompt = null;
          this.showInstallButton = false;
        });
      }
    },
  },
  mounted() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton = true;
    });
  },
});
</script>

<style scoped>
.animated-dialog {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.q-dialog__inner {
  animation: slideIn 0.5s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.q-card {
  transition: transform 0.3s ease-in-out;
}
</style>
