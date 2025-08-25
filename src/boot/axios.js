// // import { boot } from 'quasar/wrappers'
// // import axios from 'axios';
// // const { VITE_API_BASE_URL } = import.meta.env;
// // console.log(import.meta.env);

// // const api = axios.create({
// //   timeout: 30000,
// //   baseURL: VITE_API_BASE_URL,
// // })

// // export default boot(({ app }) => {

// //   app.config.globalProperties.$axios = axios

// //   app.config.globalProperties.$api = api
// // })

// // export { api }
// import { boot } from "quasar/wrappers";
// import axios from "axios";
// const { VITE_API_BASE_URL } = import.meta.env;
// console.log(import.meta.env);

// const api = axios.create({
//   timeout: 30000,
//   baseURL: VITE_API_BASE_URL,
// });

// api.interceptors.request.use(
//   function (config) {
//     const userDataString = localStorage.getItem('userData');
//     if (userDataString) {
//         const userData = JSON.parse(userDataString);
//         console.log(userData);
//         const token = userData.token;
//          config.headers['Content-Type'] = "application/json"
//       config.headers.Authorization = `Bearer ${token}`
//     } else {
//         console.log('No user data found in local storage');
//     }
//     // const token ="eyJhbGciOiJIUzI1NiJ9.eyJVU0VSUk9MRSI6IkFQSV9ERUFMRVIiLCJzdWIiOiJERUFMRVJQRVIyIiwiaWF0IjoxNzIxNzk5NTcwLCJleHAiOjE3MjIxNTk1NzB9.LzPsnNOdB2aL6h-Lh5S2my3kJ9OmEaHfcLqqtBMv2Rw";
//     // if (token) {
//     //   config.headers['Content-Type'] = "application/json"
//     //   config.headers.Authorization = `Bearer ${token}`
//     // }
//     return config;
//   },
//   function (err) {
//     return Promise.reject(err);
//   }
// );

// export default boot(({ app }) => {
//   app.config.globalProperties.$axios = axios;

//   app.config.globalProperties.$api = api;
// });

// export { api };

import { boot } from "quasar/wrappers";
import axios from "axios";

const { VITE_API_BASE_URL } = import.meta.env;
console.log(import.meta.env);

const api = axios.create({
  timeout: 30000,
  baseURL: VITE_API_BASE_URL,
});

api.interceptors.request.use(
  function (config) {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log(userData);
      const token = userData.token;
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No user data found in local storage");
    }

    // Conditionally set the Content-Type header based on the type of data being sent
    if (config.data) {
      if (config.data instanceof FormData) {
        
        delete config.headers["Content-Type"];
      } else {
        // Otherwise, set it to 'application/json'
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
