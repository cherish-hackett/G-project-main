// Boot file for Axios configuration in Quasar
// This makes Axios available globally with interceptors for authentication
import { boot } from "quasar/wrappers";
import axios from "axios";

// Load API base URL from environment variables (defined in .env)
// Example: VITE_API_BASE_URL=https://api.myapp.com
const { VITE_API_BASE_URL } = import.meta.env;
console.log("Environment Variables:", import.meta.env);

// Create an Axios instance with default config
const api = axios.create({
  timeout: 30000, // 30s timeout for requests
  baseURL: VITE_API_BASE_URL, // All API requests will use this base URL
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // 🔹 Retrieve JWT token from localStorage if available
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log("User data loaded:", userData);

      const token = userData.token;
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ No user data found in local storage");
    }

    // 🔹 Handle Content-Type dynamically
    // If sending FormData → let browser set multipart boundaries
    if (config.data) {
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        // Otherwise, ensure JSON requests have the right header
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  function (err) {
    // Handle request errors
    return Promise.reject(err);
  }
);

// Boot function: inject Axios instances into Vue app
export default boot(({ app }) => {
  // Raw axios (without interceptors)
  app.config.globalProperties.$axios = axios;

  // Configured axios instance (with baseURL, interceptors)
  app.config.globalProperties.$api = api;
});

// Export api so it can be imported in Pinia stores or components
export { api };
