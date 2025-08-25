const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../layouts/LoginComponent.vue"),
    // component: () => import("src/components/SubCom/submitOrRejSerEng.vue"),
  },
  {
    path: "/dashbord",
    name: "dashbord",
    component: () => import("layouts/MainLayout.vue"),
    redirect: (to) => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.userRole === "API_DEALER"
          ? "/dashbord/dealer"
          : "/dashbord/serEng";
      }
    },
    children: [
      {
        path: "serEng",
        name: "serEng",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "dealer",
        name: "dealer",
        component: () => import("pages/serviceIndexpage.vue"),
      },
      {
        path: "/forgetPas",
        name: "forgetPas",
        component: () => import("pages/forgetPass.vue"),
      },
    ],
  },
  {
    path: "/ser",
    component: () => import("pages/serviceIndexpage.vue"),
  },
  {
    path: "/callReport",
    name: "callReport",
    component: () => import("../components/openComplaints/callReport.vue"),
  },
  {
    path: "/callReportList/:type",
    name: "callReportList",
    component: () => import("../components/openComplaints/callReportList.vue"),
  },
  {
    path: "/home",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/home1",
    component: () => import("../components/SubCom/testCom.vue"),
  },
  {
    path: "/card",
    name: "card",
    component: () => import("../components/SubCom/allocationCard.vue"),
  },
  {
    path: "/allocationList/:type",
    name: "allocationList",
    component: () => import("../components/SubCom/allocationList.vue"),
  },
  ,
  {
    path: "/service",
    name: "service",
    component: () => import("../components/serviceInfo/serviceInfoReport.vue"),
  },
  {
    path: "/serviceList/:type",
    name: "serviceList",
    component: () => import("../components/serviceInfo/serviceList.vue"),
  },
  {
    path: "/seviceCard/:message",
    name: "seviceCard",
    component: () => import("../components/serviceInfo/serviceCard.vue"),
  },
  {
    path: "/testform",
    name: "testform",
    component: () => import("../components/dynamicForm/testForm.vue"),
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
