import { defineStore } from 'pinia'
import jwtDecode from "jwt-decode";

export const useUserStore = defineStore("user",{
    state: () => ({
        token: localStorage.getItem('token'),
    }),
    actions: {
        login(encodedToken) {
            this.token = encodedToken
            localStorage.setItem('token', encodedToken)
        },
        logout() {
            this.token = null
        },
    },
    getters: {
        user() {
            if (!this.token) {
                return null
            }
            const decodedToken = jwtDecode(this.token)
            return decodedToken
        }
    }
})