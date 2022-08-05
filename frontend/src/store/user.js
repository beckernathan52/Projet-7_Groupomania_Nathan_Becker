import { defineStore } from 'pinia'
import jwtDecode from "jwt-decode";

export const useUserStore = defineStore("user",{
    state: () => ({
        token: "",
    }),
    actions: {
        login(encodedToken) {
            this.token = encodedToken
            localStorage.setItem('token', encodedToken)
        },
        logout() {
            this.token = ""
        },
    },
    getters: {
        user() {
            if (!this.token) {
                return false
            }
            const decodedToken = jwtDecode(this.token)
            return decodedToken
        }
    }
})