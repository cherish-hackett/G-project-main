// src/stores/auth.js
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    isAuthResolved: false
  }),
  actions: {
    async loginWithEmailAndPassword(userData) {
      try {
        const res = await api.post('/user/authenticate', userData);
        const user = res.data;
        if (user.isValid) {
          this.isAuthResolved = true;
          localStorage.setItem('userData', JSON.stringify(user));
          // const decoded = jwtDecode(user.token);
          // console.log(decoded.SOLDTO);
        }
        this.user = user;
        return user;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    removeAuthState(){
      return this.isAuthResolved = false;
    }
  },
  getters: {
    authState() {
      return this.isAuthResolved;
    }
  }
});
