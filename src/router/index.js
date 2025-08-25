import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  Router.beforeEach((to, from, next) => {
    // const store = useAuthStore();
    // const isAuthResolved = store.authState;
    let auth;
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log(userData);
      auth = userData.isValid;
    }
    if (to.name !== "login" && !auth) {
      next({ name: "login" });
    } else if (to.name === "login" && auth) {
      console.log(auth);
      next({ name: "dashbord" });
    } else {
      next();
    }
  });
  return Router;
});
